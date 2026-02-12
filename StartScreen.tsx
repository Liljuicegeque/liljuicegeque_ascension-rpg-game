
import React from 'react';
import { HEROES } from '../constants';
import { HeroName } from '../types';

interface StartScreenProps {
  onPick: (name: HeroName) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onPick }) => {
  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-orbitron text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,204,0.5)]">
          LILJUICE GEQUE
        </h1>
        <p className="text-xs tracking-widest text-cyan-700/80 font-bold uppercase mt-1">Final Ascension</p>
      </header>

      <div className="space-y-4">
        {Object.values(HEROES).map((hero) => (
          <div 
            key={hero.name}
            onClick={() => onPick(hero.name as HeroName)}
            className="group relative cursor-pointer p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-900/10 transition-all overflow-hidden"
          >
            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-16 h-16 rounded-full bg-black/50 border-2 border-cyan-500/50 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(0,255,204,0.2)]">
                {hero.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-orbitron text-white group-hover:text-cyan-400 transition-colors">{hero.name}</h3>
                <p className="text-xs text-cyan-400 font-bold mb-1">Passive: {hero.passive}</p>
                <p className="text-sm text-gray-400 leading-tight">{hero.description}</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
               <span className="text-4xl">{hero.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartScreen;
