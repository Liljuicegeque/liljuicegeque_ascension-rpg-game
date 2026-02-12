
import React from 'react';
import { GameState, DamageEffect } from '../types';

interface BattleScreenProps {
  state: GameState;
  log: string[];
  damageEffects: DamageEffect[];
  onAction: (type: 'atk' | 'heal' | 'ult' | 'focus') => void;
}

const BattleScreen: React.FC<BattleScreenProps> = ({ state, log, damageEffects, onAction }) => {
  const { player, enemy, ult, status, stage, isBusy } = state;

  if (!player || !enemy) return null;

  const isTimeLocked = status.timeLocked > 0 || status.frozen;

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-700 ${isTimeLocked ? 'filter sepia brightness-75' : ''}`}>
      {/* Damage Layer */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        {damageEffects.map(effect => (
          <div 
            key={effect.id}
            className="absolute font-orbitron font-bold text-3xl animate-float-up pointer-events-none"
            style={{ 
              left: `${effect.x}px`, 
              top: `${effect.y}px`, 
              color: effect.color,
              textShadow: '0 0 10px rgba(0,0,0,1)'
            }}
          >
            {effect.value}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-white/5 bg-black/40">
        <div className="text-cyan-400 font-orbitron text-xs tracking-widest uppercase">
          {state.mode === 'story' ? `CHAPTER ${state.storyChapter + 1}` : `LOOP ${stage + 1}`}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i < status.soldiers ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {/* Enemy Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className={`relative transition-transform duration-500 ${isTimeLocked ? 'scale-110' : 'animate-float'}`}>
          <div className="text-9xl filter drop-shadow-[0_0_20px_rgba(0,255,204,0.3)] select-none">
            {enemy.icon}
          </div>
          {isTimeLocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl text-white/40 animate-spin-slow">⏳</span>
            </div>
          )}
        </div>
        
        <div className="mt-8 w-full max-w-xs space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
            <span>{enemy.name}</span>
            <span>{Math.max(0, Math.floor(enemy.hp))} HP</span>
          </div>
          <div className="h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-700" 
              style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Player Stats */}
      <div className="px-6 py-4 bg-black/40 border-t border-white/5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{player.icon}</span>
            <div>
              <div className="text-sm font-orbitron font-bold tracking-tight">{player.name}</div>
              <div className="text-[9px] text-cyan-500 font-bold uppercase">{player.passive}</div>
            </div>
          </div>
          <div className="text-right">
             <div className="text-[9px] text-gray-500">REVERSION SYNC</div>
             <div className="text-lg font-orbitron text-purple-400 leading-none">{Math.floor(ult)}%</div>
          </div>
        </div>

        <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.4)]" 
            style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
          />
        </div>
      </div>

      {/* Log */}
      <div className="h-24 bg-black/80 p-3 overflow-y-auto text-[10px] font-mono space-y-1 border-t border-white/10">
        {log.map((m, i) => (
          <div key={i} className={`${i === 0 ? 'text-cyan-400 animate-pulse' : 'text-gray-600'}`}>
            {m}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="p-4 grid grid-cols-2 gap-3 bg-black/60">
        <BattleBtn label="STRIKE" color="bg-white/10" disabled={isBusy || status.web} onClick={() => onAction('atk')} />
        <BattleBtn label="MEND" color="bg-white/10" disabled={isBusy} onClick={() => onAction('heal')} />
        <BattleBtn label="FOCUS" color="bg-white/10" disabled={isBusy} onClick={() => onAction('focus')} />
        <BattleBtn 
          label="ULTIMATE" 
          color={ult >= 100 ? "bg-cyan-600" : "bg-white/5"} 
          disabled={isBusy || ult < 100} 
          onClick={() => onAction('ult')} 
          glow={ult >= 100}
        />
      </div>

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-80px) scale(1.5); opacity: 0; }
        }
        .animate-float-up { animation: float-up 1.2s forwards ease-out; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
};

const BattleBtn: React.FC<{ label: string, color: string, disabled: boolean, onClick: () => void, glow?: boolean }> = ({ label, color, disabled, onClick, glow }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`py-3 rounded-xl font-orbitron text-[10px] font-bold border transition-all active:scale-90 ${disabled ? 'opacity-20 cursor-not-allowed grayscale' : `${color} border-white/10 hover:border-white/40`} ${glow ? 'animate-pulse shadow-[0_0_15px_rgba(0,255,255,0.4)]' : ''}`}
  >
    {label}
  </button>
);

export default BattleScreen;
