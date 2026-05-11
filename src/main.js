import { appState, setLanguage, isRtl, t, playSound } from './data.js';
import { GameEngine } from './game/GameEngine.js';
import { renderShop } from './shop.js';
import { renderSettings, renderAchievements } from './settings.js';
import { renderGame } from './game.js';

let engine = null;
let gameInterval = null;
let uiUpdateInterval = null;

function renderApp() {
  const root = document.getElementById('root');
  root.innerHTML = '';
  
  if (appState.isPlaying) {
    root.innerHTML = renderGame();
    initGame();
  } else {
    root.innerHTML = renderMainMenuWrapper();
    initMainMenu();
    if (appState.activePanel === 'upgrade') {
      document.getElementById('shop-container').innerHTML = renderShop();
      document.getElementById('shop-container').classList.remove('hidden');
      document.getElementById('panel-container').classList.add('hidden');
    } else if (appState.activePanel === 'settings') {
      document.getElementById('panel-container').innerHTML = renderSettings();
    } else if (appState.activePanel === 'achievements') {
      document.getElementById('panel-container').innerHTML = renderAchievements();
    } else {
      document.getElementById('panel-container').innerHTML = renderMainButtons();
    }
  }
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function renderMainMenuWrapper() {
  const rtl = isRtl();
  return `
    <div id="main-menu" class="absolute inset-0 flex items-center justify-start px-8 md:px-20 bg-transparent text-white z-50 overflow-hidden ${rtl ? 'font-arabic' : 'font-sans'}">
      <div id="bg-layers" class="absolute inset-0 -z-20 bg-[#050508]">
         <div class="bg-layer absolute inset-[-5%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen transition-transform duration-75"></div>
         <div class="bg-layer absolute inset-[-10%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-screen scale-150 transition-transform duration-75"></div>
         <div class="bg-layer absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[100px] -z-10 mix-blend-screen transition-transform duration-75"></div>
         <div class="bg-layer absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px] -z-10 mix-blend-screen transition-transform duration-75"></div>
      </div>
      <div class="relative z-10 w-full max-w-7xl mx-auto flex h-full py-20 md:py-10">
        <div id="panel-container" class="w-full flex h-full panel-animate-in"></div>
        <div id="shop-container" class="w-full h-full absolute inset-0 hidden"></div>
      </div>
      <div class="absolute bottom-0 left-0 w-full h-10 border-t border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 text-xs font-mono text-gray-500 tracking-widest uppercase z-10">
        <div class="flex gap-6">
          <span>Armor <span class="text-cyan-400">85%</span></span>
          <span class="hidden md:inline">Power Level <span class="text-purple-400">92%</span></span>
        </div>
        <div class="flex gap-6">
          <span>Server <span class="text-emerald-400">Online</span></span>
          <span>Ping <span class="text-white text-opacity-80">24ms</span></span>
        </div>
      </div>
    </div>
  `;
}

function renderMainButtons() {
  const rtl = isRtl();
  return `
    <div class="w-full flex flex-col md:flex-row gap-12 items-center md:items-start h-full">
      <div class="flex flex-col flex-shrink-0 relative z-20 ${rtl ? 'ml-auto text-right md:-ml-0' : ''}">
        <div class="mb-12 cursor-default">
          <h1 class="text-4xl md:text-5xl font-black italic tracking-tighter text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] uppercase">Neon Strike</h1>
          <div class="h-1 w-full bg-gradient-to-r ${rtl ? 'from-transparent to-blue-500' : 'from-blue-500 to-transparent'} mt-2"></div>
          <p class="text-gray-400 text-xs mt-2 uppercase tracking-[0.3em] font-mono">v2.4.1 Nexus</p>
        </div>
        ${getSciFiButton(t('startGame'), t('launchNewMission'), 'blue', 'start-game')}
        ${getSciFiButton(t('continue'), t('resumeCheckpoint'), 'purple', 'continue', 'Sector 4 • 85%')}
        ${getSciFiButton(t('upgradeShip'), t('enhanceWeapons'), 'gold', 'upgrade-ship')}
        ${getSciFiButton(t('settings'), t('configureGame'), 'gray', 'settings')}
        ${getSciFiButton(t('achievements'), t('viewMedals'), 'green', 'achievements')}
      </div>
      <div class="flex-1 w-full h-[60vh] md:h-full relative flex items-center justify-center pointer-events-none md:pointer-events-auto mt-8 md:mt-0">
        <div class="animate-ship-float w-[300px] h-[250px] md:w-[400px] md:h-[300px] relative mix-blend-screen" style="perspective: 1000px">
          <div class="absolute inset-0 border border-blue-500/30 bg-blue-900/10 backdrop-blur-sm shadow-[0_0_50px_rgba(59,130,246,0.3)] rounded-full transform rotate-x-[60deg] pointer-events-none"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,1)]"></div>
          <div class="absolute top-1/2 left-1/4 w-3 h-20 bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,1)] filter blur-[2px]"></div>
          <div class="absolute top-1/2 right-1/4 w-3 h-20 bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,1)] filter blur-[2px]"></div>
        </div>
      </div>
    </div>
  `;
}

function getSciFiButton(label, tooltip, theme, action, subLabel = '') {
  const rtl = isRtl();
  const themeColors = {
    blue: 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] from-blue-900/40 text-blue-300',
    purple: 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] from-purple-900/40 text-purple-300',
    gold: 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] from-amber-900/40 text-amber-300',
    green: 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] from-emerald-900/40 text-emerald-300',
    gray: 'border-gray-500 shadow-[0_0_15px_rgba(156,163,175,0.5)] from-gray-900/40 text-gray-300',
  };
  const hoverColors = {
    blue: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] hover:bg-blue-500/20',
    purple: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] hover:bg-purple-500/20',
    gold: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.8)] hover:bg-amber-500/20',
    green: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] hover:bg-emerald-500/20',
    gray: 'hover:shadow-[0_0_25px_rgba(156,163,175,0.8)] hover:bg-gray-500/20',
  };
  const clipPathBase = rtl 
    ? 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
    : 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)';

  return `
    <div class="relative group mb-4 w-64 md:w-80">
      <button data-action="${action}" class="scifi-btn w-full relative overflow-hidden backdrop-blur-md bg-gradient-to-r to-transparent border-l-4 border-y border-r border-y-white/10 border-r-white/10 ${themeColors[theme]} ${hoverColors[theme]} hover:text-white px-6 py-3 transition-colors duration-300 text-left font-mono font-bold tracking-widest uppercase flex flex-col justify-center" style="clip-path: ${clipPathBase}; text-align: ${rtl ? 'right' : 'left'}">
        <span class="relative z-10 flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}">
          <span class="text-xl drop-shadow-md">${label}</span>
          <i data-lucide="chevron-right" class="opacity-0 group-hover:opacity-100 transition-all duration-300 transform ${rtl ? 'rotate-180 translate-x-2 group-hover:translate-x-0' : '-translate-x-2 group-hover:translate-x-0'} w-5 h-5"></i>
        </span>
        ${subLabel ? `<span class="block text-xs mt-1 text-white/50 group-hover:text-white/80 transition-colors uppercase font-sans tracking-normal">${subLabel}</span>` : ''}
        <div class="scanline-effect"></div>
      </button>
      <div class="absolute ${rtl ? 'right-full mr-4' : 'left-full ml-4'} top-1/2 -translate-y-1/2 w-48 p-3 backdrop-blur-xl bg-black/60 border border-white/10 text-white/80 text-xs font-sans rounded-md pointer-events-none hidden md:group-hover:block opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <div class="w-1 h-full absolute ${rtl ? 'right-0' : 'left-0'} top-0 bg-${theme === 'blue' ? 'blue' : theme === 'purple' ? 'purple' : theme === 'gold' ? 'amber' : theme === 'gray' ? 'gray' : 'emerald'}-500/50"></div>
        ${tooltip}
      </div>
    </div>
  `;
}

function initMainMenu() {
  // Event listener is attached globally below
}

function handleMenuClicks(e) {
  let btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const action = btn.getAttribute('data-action');
  
  if (action === 'start-game' || action === 'continue') {
    playSound('click');
    appState.isPlaying = true;
    appState.isGameOver = false;
    appState.score = 0;
    appState.level = 1;
    appState.hp = 100;
    renderApp();
  } else if (action === 'upgrade-ship') {
    playSound('hover');
    appState.activePanel = 'upgrade';
    renderApp();
  } else if (action === 'settings') {
    playSound('hover');
    appState.activePanel = 'settings';
    renderApp();
  } else if (action === 'achievements') {
    playSound('hover');
    appState.activePanel = 'achievements';
    renderApp();
  } else if (action === 'back-main') {
    playSound('click');
    if (appState.isPlaying) {
      cleanupGame();
    }
    appState.isPlaying = false;
    appState.activePanel = 'main';
    appState.isGameOver = false;
    renderApp();
  } else if (action === 'set-lang') {
    playSound('click');
    setLanguage(btn.getAttribute('data-lang'));
    renderApp();
  } else if (action === 'set-diff') {
    playSound('click');
    appState.difficulty = btn.getAttribute('data-diff');
    renderApp();
  } else if (action === 'shop-cat') {
    playSound('click');
    appState.activeCategory = btn.getAttribute('data-cat');
    renderApp();
  } else if (action === 'restart-game') {
    playSound('click');
    cleanupGame();
    appState.isGameOver = false;
    appState.score = 0;
    appState.level = 1;
    appState.hp = 100;
    renderApp();
  }
}

function cleanupGame() {
  if (engine) engine.stop();
  if (gameInterval) clearInterval(gameInterval);
  if (uiUpdateInterval) clearInterval(uiUpdateInterval);
  engine = null;
}

function initGame() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const resizeHandler = () => {
    if (canvas && document.body.contains(canvas)) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    } else {
      window.removeEventListener('resize', resizeHandler);
    }
  };
  window.addEventListener('resize', resizeHandler);
  
  engine = new GameEngine(canvas);
  engine.start();

  // Update DOM with engine state continuously
  uiUpdateInterval = setInterval(() => {
    if (!engine || appState.activePanel !== 'main' || !appState.isPlaying) return;

    appState.score = engine.score;
    appState.level = engine.level;
    appState.hp = engine.playerHP;
    appState.isGameOver = engine.isGameOver;

    const elScore = document.getElementById('ui-game-score');
    if (elScore) elScore.innerText = appState.score.toString().padStart(6, '0');
    
    const elLevel = document.getElementById('ui-game-level');
    if (elLevel) elLevel.innerText = `LVL ${appState.level.toString().padStart(2, '0')}`;
    
    const elHpBar = document.getElementById('ui-game-hp-bar');
    const elHpText = document.getElementById('ui-game-hp-text');
    if (elHpBar) {
      elHpBar.style.width = `${appState.hp}%`;
      elHpText.innerText = `${Math.floor(appState.hp)}%`;
      if (appState.hp > 60) elHpBar.className = 'h-full bg-green-500 shadow-[0_0_10px_#22c55e]';
      else if (appState.hp > 30) elHpBar.className = 'h-full bg-yellow-500 shadow-[0_0_10px_#eab308]';
      else elHpBar.className = 'h-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse';
    }

    if (appState.isGameOver) {
      const gO = document.getElementById('ui-game-over');
      if (gO) {
        gO.classList.remove('hidden');
        gO.classList.add('flex');
        document.getElementById('ui-final-score').innerText = appState.score.toString();
      }
    }
  }, 50);
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', handleMenuClicks);
  setLanguage(appState.language);
  renderApp();
});
