import { translations } from './translations.js';

export const WEAPONS_DATA = [
  { id: 'w1', nameKey: 'laserCannon', rarity: 'common', category: 'WEAPONS', damage: 120, fireRate: '8.0/s', energy: 15, price: 12000, descKey: 'laserCannonDesc' },
  { id: 'w2', nameKey: 'plasmaGun', rarity: 'rare', category: 'WEAPONS', damage: 250, fireRate: '4.5/s', energy: 25, price: 35000, descKey: 'plasmaGunDesc' },
  { id: 'w3', nameKey: 'missileLauncher', rarity: 'epic', category: 'WEAPONS', damage: 750, fireRate: '1.2/s', energy: 40, price: 75000, descKey: 'missileLauncherDesc' },
  { id: 'w4', nameKey: 'ionBeam', rarity: 'epic', category: 'WEAPONS', damage: 600, fireRate: '2.0/s', energy: 35, price: 80000, descKey: 'ionBeamDesc' },
  { id: 'w5', nameKey: 'empBlast', rarity: 'legendary', category: 'WEAPONS', damage: 1000, fireRate: '0.8/s', energy: 60, price: 150000, descKey: 'empBlastDesc' },
];

export const raritySolidColors = {
  common: '#60a5fa', 
  rare: '#a855f7', 
  epic: '#f59e0b', 
  legendary: '#fde047' 
};

export const rarityColors = {
  common: 'text-blue-200 border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] bg-[#0c1428]',
  rare: 'text-purple-300 border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.2)] bg-[#100720]',
  epic: 'text-amber-400 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-[#1a1103]',
  legendary: 'text-yellow-300 border-yellow-400/50 shadow-[0_0_25px_rgba(250,204,21,0.4)] bg-[#170e17]'
};

export let appState = {
  language: localStorage.getItem('appLanguage') || 'en',
  difficulty: localStorage.getItem('gameDifficulty') || 'normal',
  activePanel: 'main', // main, upgrade, settings, achievements, game
  score: 0,
  level: 1,
  timeStr: '00:00',
  hp: 100,
  isGameOver: false,
  bhCooldown: 0,
  credits: 125450,
  premiumCredits: 2350,
  power: 9850,
  purchased: [],
  selectedItem: WEAPONS_DATA[2],
  activeCategory: 'WEAPONS'
};

export function t(key) {
  return translations[appState.language][key] || translations.en[key] || key;
}

export function isRtl() {
  return appState.language === 'ar';
}

export function setLanguage(lang) {
  appState.language = lang;
  localStorage.setItem('appLanguage', lang);
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  document.body.className = `bg-black text-white overflow-hidden select-none touch-none ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`;
}

export function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'warp') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } else if (type === 'buy') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch(e) {}
}
