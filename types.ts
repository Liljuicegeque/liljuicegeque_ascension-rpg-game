
export type HeroName = 'Geque' | 'Kurenai' | 'Ayaka' | 'Erebus' | 'Custom';

export interface Hero {
  name: string;
  id: HeroName;
  icon: string;
  hp: number;
  maxHp: number;
  atk: number;
  ultMultiplier: number;
  passive: string;
  description: string;
  color: string;
}

export interface Boss {
  name: string;
  icon: string;
  hp: number;
  maxHp: number;
  atk: number;
  skill: 'web' | 'rewrite' | 'shadows' | 'time_compression';
}

export interface GameState {
  screen: 'menu' | 'start' | 'custom' | 'tree' | 'battle' | 'story' | 'win' | 'gameover';
  mode: 'roguelike' | 'story';
  storyChapter: number;
  souls: number;
  stage: number;
  ult: number;
  isBusy: boolean;
  player: Hero | null;
  enemy: Boss | null;
  shake: boolean;
  status: {
    loopUsed: boolean;
    formActive: boolean;
    soldiers: number;
    frozen: boolean;
    burn: number;
    web: boolean;
    timeLocked: number;
  };
}

export type DamageEffect = {
  id: number;
  value: string;
  x: number;
  y: number;
  color: string;
};
