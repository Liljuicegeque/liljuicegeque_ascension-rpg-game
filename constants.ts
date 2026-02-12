
import { Hero, Boss } from './types';

export const HEROES: Record<string, Hero> = {
  'Geque': { 
    name: 'Geque', 
    id: 'Geque',
    icon: '⚔️', 
    hp: 200, 
    maxHp: 200, 
    atk: 45, 
    ultMultiplier: 3, 
    passive: 'Omni-Loop', 
    description: 'Revives once with 50% HP upon defeat. Sovereignty of the Negative Layer.',
    color: '#00ffcc'
  },
  'Kurenai': { 
    name: 'Kurenai', 
    id: 'Kurenai',
    icon: '🦊', 
    hp: 140, 
    maxHp: 140, 
    atk: 40, 
    ultMultiplier: 4, 
    passive: 'Phantom Mirror', 
    description: '25% chance to dodge any incoming hit. Master of Thread Manipulation.',
    color: '#ff4757'
  },
  'Ayaka': { 
    name: 'Ayaka', 
    id: 'Ayaka',
    icon: '❄️', 
    hp: 250, 
    maxHp: 250, 
    atk: 30, 
    ultMultiplier: 2.5, 
    passive: 'Frost Eternity', 
    description: 'Ultimate freezes the boss for 1 turn. Leader of Division Null.',
    color: '#70a1ff'
  },
  'Erebus': { 
    name: 'Erebus', 
    id: 'Erebus',
    icon: '⏳', 
    hp: 180, 
    maxHp: 180, 
    atk: 38, 
    ultMultiplier: 3.5, 
    passive: 'Chronos Overflow', 
    description: 'Time control: Basic attacks have 30% chance to repeat (Echo strike).',
    color: '#f1c40f'
  }
};

export const BOSSES: Boss[] = [
  { name: 'Arachne', icon: '🕸️', hp: 350, maxHp: 350, atk: 25, skill: 'web' },
  { name: 'Xandros', icon: '🌌', hp: 1000, maxHp: 1000, atk: 55, skill: 'rewrite' },
  { name: 'Ashborn', icon: '🔥', hp: 2500, maxHp: 2500, atk: 90, skill: 'shadows' },
  { name: 'Aeon', icon: '🪐', hp: 5000, maxHp: 5000, atk: 120, skill: 'time_compression' }
];

export const STORY_STAGES = [
  {
    chapter: 1,
    title: "Arc 1: The Ashes",
    text: "The fire took everything. But in the smoke, Geque felt it—the Void Pulse. Ayaka offers a path, but the distortions are real.",
    bossIndex: 0
  },
  {
    chapter: 2,
    title: "Arc 2: Catalyst",
    text: "Emotions are the key. Reality cracks as Erebus descends to test the 'Anomaly'. Your heart breaks, and the rifts open wide.",
    bossIndex: 1
  },
  {
    chapter: 3,
    title: "Arc 4: Omni Loop",
    text: "Death is not the end. The Omni Loop triggers. Adapt. Overcome. Revert existence until the enemy is erased.",
    bossIndex: 2
  },
  {
    chapter: 4,
    title: "Arc 5: Fate",
    text: "The King of the Negative Layer has risen. Arachne pulls the cosmic threads, but you are the anomaly she cannot control.",
    bossIndex: 3
  }
];
