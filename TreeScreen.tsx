
import React from 'react';
import { Hero } from '../types';

interface TreeScreenProps {
  souls: number;
  player: Hero | null;
  onUpgrade: (type: 'hp' | 'atk' | 'ult') => void;
  onStart: () => void;
}

const TreeScreen: React.FC<TreeScreenProps> = ({ souls, player, onUpgrade, onStart }) => {
  if (!player) return null;

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-orbitron text-yellow-500">ASCENSION TREE</h2>
        <div className="mt-2 text-cyan-400 font-bold text-xl flex items-center justify-center gap-2">
          <span className="text-2xl">💎</span> {souls} SOULS
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <UpgradeNode 
          title="Vitality" 
          desc="+50 Max HP" 
          cost={1} 
          icon="❤️" 
          canAfford={souls >= 1} 
          onClick={() => onUpgrade('hp')} 
        />
        <UpgradeNode 
          title="Might" 
          desc="+10 Attack" 
          cost={1} 
          icon="⚔️" 
          canAfford={souls >= 1} 
          onClick={() => onUpgrade('atk')} 
        />
        <UpgradeNode 
          title="Essence" 
          desc="+0.5 Ult Multiplier" 
          cost={2} 
          icon="🌀" 
          canAfford={souls >= 2} 
          onClick={() => onUpgrade('ult')} 
        />
      </div>

      <div className="mt-auto pt-6">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-orbitron text-sm text-cyan-400">CURRENT STATS</span>
            <span className="text-xs text-gray-500">{player.name}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-black/30 p-2 rounded">
              <div className="text-gray-500">HP</div>
              <div className="font-bold text-green-400">{player.maxHp}</div>
            </div>
            <div className="bg-black/30 p-2 rounded">
              <div className="text-gray-500">ATK</div>
              <div className="font-bold text-red-400">{player.atk}</div>
            </div>
            <div className="bg-black/30 p-2 rounded">
              <div className="text-gray-500">ULT</div>
              <div className="font-bold text-purple-400">x{player.ultMultiplier.toFixed(1)}</div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onStart}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-orbitron font-bold text-lg shadow-[0_0_20px_rgba(0,255,204,0.3)] transition-all active:scale-95"
        >
          ENTER BATTLE
        </button>
      </div>
    </div>
  );
};

const UpgradeNode: React.FC<{ 
  title: string; desc: string; cost: number; icon: string; canAfford: boolean; onClick: () => void 
}> = ({ title, desc, cost, icon, canAfford, onClick }) => (
  <button 
    onClick={onClick}
    disabled={!canAfford}
    className={`flex items-center p-4 rounded-xl border transition-all ${
      canAfford 
        ? 'bg-white/10 border-white/20 hover:border-cyan-400 hover:bg-cyan-900/20 active:scale-95' 
        : 'bg-white/5 border-white/5 opacity-40 grayscale cursor-not-allowed'
    }`}
  >
    <div className="text-3xl mr-4">{icon}</div>
    <div className="flex-1 text-left">
      <div className="font-bold text-lg leading-none">{title}</div>
      <div className="text-xs text-gray-400">{desc}</div>
    </div>
    <div className="text-yellow-500 font-bold flex items-center gap-1">
      {cost} <span className="text-xs">💎</span>
    </div>
  </button>
);

export default TreeScreen;
