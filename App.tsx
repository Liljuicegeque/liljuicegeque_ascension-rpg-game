
import React, { useState, useCallback } from 'react';
import { Hero, Boss, GameState, HeroName, DamageEffect } from './types';
import { HEROES, BOSSES, STORY_STAGES } from './constants';
import Background from './components/Background';
import BattleScreen from './components/BattleScreen';
import StartScreen from './components/StartScreen';
import TreeScreen from './components/TreeScreen';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    screen: 'menu',
    mode: 'roguelike',
    storyChapter: 0,
    souls: 0,
    stage: 0,
    ult: 0,
    isBusy: false,
    player: null,
    enemy: null,
    shake: false,
    status: {
      loopUsed: false,
      formActive: false,
      soldiers: 0,
      frozen: false,
      burn: 0,
      web: false,
      timeLocked: 0
    }
  });

  const [log, setLog] = useState<string[]>([]);
  const [damageEffects, setDamageEffects] = useState<DamageEffect[]>([]);

  const addLog = useCallback((msg: string) => {
    setLog(prev => [`[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${msg}`, ...prev].slice(0, 8));
  }, []);

  const triggerShake = () => {
    setState(prev => ({ ...prev, shake: true }));
    setTimeout(() => setState(prev => ({ ...prev, shake: false })), 300);
  };

  const addDamageEffect = useCallback((value: string, color: string, isPlayer: boolean) => {
    const id = Date.now() + Math.random();
    const x = isPlayer ? 100 : 250;
    const y = 200 + (Math.random() - 0.5) * 60;
    setDamageEffects(prev => [...prev, { id, value, x, y, color }]);
    setTimeout(() => {
      setDamageEffects(prev => prev.filter(e => e.id !== id));
    }, 1200);
  }, []);

  const handlePickHero = (name: HeroName) => {
    const baseHero = HEROES[name];
    setState(prev => ({
      ...prev,
      player: { ...baseHero },
      screen: prev.mode === 'story' ? 'story' : 'tree'
    }));
    addLog(`System: Monarch ${name} stabilized.`);
  };

  const createCustomHero = (name: string, icon: string, stats: { hp: number, atk: number }) => {
    const customHero: Hero = {
      name,
      id: 'Custom',
      icon,
      hp: stats.hp,
      maxHp: stats.hp,
      atk: stats.atk,
      ultMultiplier: 3.0,
      passive: 'Ascendant Will',
      description: 'A sovereign of your own design.',
      color: '#ffffff'
    };
    setState(prev => ({
      ...prev,
      player: customHero,
      screen: 'menu'
    }));
    addLog(`System: Custom Monarch ${name} registered.`);
  };

  const handleStartBattle = () => {
    const bossIndex = state.mode === 'story' ? STORY_STAGES[state.storyChapter].bossIndex : state.stage;
    const boss = BOSSES[bossIndex];
    setState(prev => ({
      ...prev,
      enemy: { ...boss, hp: boss.maxHp },
      screen: 'battle',
      ult: 0,
      status: { ...prev.status, frozen: false, web: false, burn: 0, soldiers: 0 }
    }));
    if (state.player) {
      setState(prev => ({
        ...prev,
        player: prev.player ? { ...prev.player, hp: prev.player.maxHp } : null
      }));
    }
    addLog(`Combat: Initiating encounter with ${boss.name}...`);
  };

  const executeTurn = async (type: 'atk' | 'heal' | 'ult' | 'focus') => {
    if (state.isBusy || !state.player || !state.enemy) return;
    setState(prev => ({ ...prev, isBusy: true }));

    let currentEnemy = { ...state.enemy };
    let currentPlayer = { ...state.player };
    let currentUlt = state.ult;
    let currentStatus = { ...state.status };

    // PLAYER ACTION
    if (type === 'heal') {
      const healAmt = Math.floor(currentPlayer.maxHp * 0.25);
      currentPlayer.hp = Math.min(currentPlayer.maxHp, currentPlayer.hp + healAmt);
      currentStatus.web = false;
      addLog(`✨ Vitality Reversion: +${healAmt} HP.`);
      addDamageEffect(`+${healAmt}`, '#2ecc71', true);
    } else if (!currentStatus.web) {
      let dmg = currentPlayer.atk;
      if (type === 'ult') {
        dmg *= currentPlayer.ultMultiplier;
        currentUlt = 0;
        triggerShake();
        addLog(`💥 OMNI-BURST: ${currentPlayer.name} overrides causality!`);
        if (currentPlayer.id === 'Ayaka') currentStatus.frozen = true;
        if (currentPlayer.id === 'Erebus') currentStatus.timeLocked = 2;
      } else if (type === 'focus') {
        currentUlt = Math.min(100, currentUlt + 45);
        dmg = 0;
        addLog(`🧘 Gathering Pulse energy...`);
      } else {
        dmg += Math.random() * 15;
        currentUlt = Math.min(100, currentUlt + 20);
        // Erebus Echo
        if (currentPlayer.id === 'Erebus' && Math.random() < 0.3) {
          setTimeout(() => {
            addLog(`⏳ Time Echo! Extra strike.`);
            addDamageEffect(`${Math.floor(dmg * 0.5)}`, '#f1c40f', false);
          }, 300);
          currentEnemy.hp -= (dmg * 0.5);
        }
      }

      if (dmg > 0) {
        currentEnemy.hp -= dmg;
        addDamageEffect(`${Math.floor(dmg)}`, '#ffffff', false);
      }
    }

    setState(prev => ({ ...prev, player: currentPlayer, enemy: currentEnemy, ult: currentUlt, status: currentStatus }));

    if (currentEnemy.hp <= 0) {
      setTimeout(() => {
        if (state.mode === 'story') {
          if (state.storyChapter < STORY_STAGES.length - 1) {
            setState(prev => ({ ...prev, storyChapter: prev.storyChapter + 1, screen: 'story', isBusy: false }));
          } else {
            setState(prev => ({ ...prev, screen: 'win', isBusy: false }));
          }
        } else {
          const nextStage = state.stage + 1;
          if (nextStage >= BOSSES.length) {
            setState(prev => ({ ...prev, screen: 'win', isBusy: false }));
          } else {
            setState(prev => ({ ...prev, stage: nextStage, souls: prev.souls + 3, screen: 'tree', isBusy: false }));
          }
        }
        addLog(`🏆 ${currentEnemy.name} erased from existence.`);
      }, 800);
      return;
    }

    // ENEMY TURN
    await new Promise(r => setTimeout(r, 600));
    if (currentStatus.frozen || currentStatus.timeLocked > 0) {
      if (currentStatus.timeLocked > 0) currentStatus.timeLocked--;
      if (currentStatus.frozen) currentStatus.frozen = false;
      addLog(`⏳ Reality Locked: Boss frozen.`);
    } else {
      if (currentPlayer.id === 'Kurenai' && Math.random() < 0.25) {
        addLog(`💨 Phantom Dodge: 0 damage.`);
      } else {
        const edmg = currentEnemy.atk + (Math.random() * 10);
        currentPlayer.hp -= edmg;
        triggerShake();
        addLog(`💢 ${currentEnemy.name} ripple attack: -${Math.floor(edmg)}.`);
        addDamageEffect(`-${Math.floor(edmg)}`, '#ff4757', true);
      }
    }

    // Geque Revive
    if (currentPlayer.hp <= 0 && currentPlayer.id === 'Geque' && !currentStatus.loopUsed) {
      currentPlayer.hp = currentPlayer.maxHp * 0.5;
      currentStatus.loopUsed = true;
      addLog(`🔄 OMNI-LOOP: Death was a simulation.`);
    }

    setState(prev => ({ ...prev, player: currentPlayer, enemy: currentEnemy, status: currentStatus, isBusy: false }));

    if (currentPlayer.hp <= 0) {
      setState(prev => ({ ...prev, screen: 'gameover' }));
    }
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden text-white font-rajdhani ${state.shake ? 'animate-shake' : ''}`}>
      <Background />
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        <div className="max-w-md w-full h-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
          
          {state.screen === 'menu' && (
            <div className="flex-1 flex flex-col p-8 space-y-4">
              <h1 className="text-4xl font-orbitron text-center text-cyan-400 mt-8 mb-12 drop-shadow-neon">
                KAGE NO KAKUSEI
              </h1>
              <MenuButton label="STORY MODE" sub="Relive Geque's Ascension" onClick={() => setState(prev => ({ ...prev, screen: 'start', mode: 'story' }))} />
              <MenuButton label="BATTLE CYCLE" sub="Roguelike Survival" onClick={() => setState(prev => ({ ...prev, screen: 'start', mode: 'roguelike' }))} />
              <MenuButton label="FORGE MONARCH" sub="Create Custom Character" onClick={() => setState(prev => ({ ...prev, screen: 'custom' }))} />
            </div>
          )}

          {state.screen === 'custom' && <CustomCreator onCreate={createCustomHero} onBack={() => setState(prev => ({ ...prev, screen: 'menu' }))} />}

          {state.screen === 'start' && <StartScreen onPick={handlePickHero} />}
          
          {state.screen === 'story' && (
             <div className="flex-1 flex flex-col p-8 text-center space-y-6">
                <h2 className="text-2xl font-orbitron text-cyan-400">{STORY_STAGES[state.storyChapter].title}</h2>
                <div className="bg-black/40 p-6 rounded-2xl border border-white/5 text-sm leading-relaxed italic text-gray-300">
                  {STORY_STAGES[state.storyChapter].text}
                </div>
                <button onClick={handleStartBattle} className="mt-auto py-4 bg-cyan-600 rounded-xl font-bold animate-pulse">BEGIN ARC</button>
             </div>
          )}

          {state.screen === 'tree' && <TreeScreen souls={state.souls} player={state.player} onUpgrade={(type) => {}} onStart={handleStartBattle} />}
          
          {state.screen === 'battle' && <BattleScreen state={state} log={log} damageEffects={damageEffects} onAction={executeTurn} />}

          {(state.screen === 'win' || state.screen === 'gameover') && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
              <h1 className={`text-5xl font-orbitron ${state.screen === 'win' ? 'text-cyan-400' : 'text-red-600'}`}>
                {state.screen === 'win' ? 'ASCENDED' : 'LOOP ENDED'}
              </h1>
              <button onClick={() => setState(prev => ({ ...prev, screen: 'menu', stage: 0, storyChapter: 0 }))} className="px-12 py-4 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all font-bold">
                RETURN TO MENU
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(5px, -5px); }
          50% { transform: translate(-5px, 5px); }
          75% { transform: translate(5px, 5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
        .drop-shadow-neon { filter: drop-shadow(0 0 10px rgba(0, 255, 204, 0.7)); }
      `}</style>
    </div>
  );
};

const MenuButton: React.FC<{ label: string, sub: string, onClick: () => void }> = ({ label, sub, onClick }) => (
  <button onClick={onClick} className="group p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-cyan-900/20 hover:border-cyan-500/50 transition-all active:scale-95">
    <div className="text-xl font-orbitron group-hover:text-cyan-400 transition-colors">{label}</div>
    <div className="text-xs text-gray-500 font-bold tracking-widest">{sub}</div>
  </button>
);

const CustomCreator: React.FC<{ onCreate: (n: string, i: string, s: any) => void, onBack: () => void }> = ({ onCreate, onBack }) => {
  const [name, setName] = useState('New Sovereign');
  const [icon, setIcon] = useState('🌑');
  return (
    <div className="flex-1 flex flex-col p-8 space-y-6">
      <h2 className="text-2xl font-orbitron text-center">FORGE SOUL</h2>
      <input value={name} onChange={e => setName(e.target.value)} className="bg-black/50 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-cyan-500" placeholder="Name..." />
      <div className="grid grid-cols-4 gap-2">
        {['🌑','💠','🔥','🌀','💀','⚡','🧊','🎭'].map(i => (
          <button key={i} onClick={() => setIcon(i)} className={`p-4 rounded-xl border ${icon === i ? 'border-cyan-500 bg-cyan-900/20' : 'border-white/5'}`}>{i}</button>
        ))}
      </div>
      <button onClick={() => onCreate(name, icon, { hp: 200, atk: 40 })} className="mt-auto py-4 bg-cyan-600 rounded-xl font-bold">FINALIZE EXISTENCE</button>
      <button onClick={onBack} className="text-xs text-gray-500 uppercase tracking-widest">Cancel</button>
    </div>
  );
};

export default App;
