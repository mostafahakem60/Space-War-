import { appState, t, isRtl } from './data.js';

export function renderGame() {
  const isRtlLang = isRtl();
  return `
    <div class="relative w-full h-full bg-black overflow-hidden object-contain touch-none select-none ${isRtlLang ? 'font-arabic' : 'font-sans'}">
        <!-- Render Layer -->
        <canvas id="game-canvas" class="absolute inset-0 w-full h-full object-contain touch-none select-none z-10 block" style="width: 100vw; height: 100vh;"></canvas>

        <!-- Dynamic Game Background Overlay -->
        <div class="absolute inset-0 pointer-events-none z-0">
          <div class="absolute inset-[-5%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen transition-transform duration-75"></div>
          <div id="game-bg-1" class="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[100px] -z-10 mix-blend-screen transition-transform duration-75"></div>
          <div id="game-bg-2" class="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px] -z-10 mix-blend-screen transition-transform duration-75"></div>
        </div>

        <div class="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none z-20"></div>

        <!-- HUD Layer -->
        <!-- Top Left: Back & Score -->
        <div class="absolute top-4 md:top-8 ${isRtlLang ? 'right-4 md:right-8' : 'left-4 md:left-8'} flex items-start gap-4 md:gap-6 z-30 ${isRtlLang ? 'flex-row-reverse' : ''}">
           <button data-action="back-main" class="p-2 md:p-3 bg-white/5 backdrop-blur-sm border md:border-2 border-white/10 text-white/50 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all rounded-none group cursor-pointer pointer-events-auto">
             <i data-lucide="arrow-left" class="w-5 h-5 md:w-6 md:h-6 ${isRtlLang ? 'rotate-180' : ''} group-hover:-translate-x-1 transition-transform"></i>
           </button>
           
           <div class="flex flex-col bg-black/40 backdrop-blur-md border border-white/10 p-2 md:p-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isRtlLang ? 'items-end' : 'items-start'}">
             <span class="text-white/40 text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-sans -mb-1">${t('score')}</span>
             <span id="ui-game-score" class="text-2xl md:text-4xl font-mono font-black italic tracking-tighter text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" style="font-variant-numeric: tabular-nums">
               000000
             </span>
             <div class="flex items-center gap-2 mt-1 -mb-1 ${isRtlLang ? 'flex-row-reverse bg-gray-900 pr-1 pl-2' : 'bg-gray-900 pl-1 pr-2'} border border-white/5 w-fit">
                <div class="w-3 h-3 md:w-4 md:h-4 bg-purple-500/20 flex items-center justify-center">
                  <i data-lucide="zap" class="w-2 h-2 text-purple-400"></i>
                </div>
                <span id="ui-game-level" class="text-purple-400 font-mono text-[9px] md:text-xs">LVL 01</span>
             </div>
           </div>
        </div>

        <!-- Top Right: Health & BH Cooldown -->
        <div class="absolute top-4 md:top-8 ${isRtlLang ? 'left-4 md:left-8' : 'right-4 md:right-8'} flex flex-col ${isRtlLang ? 'items-start' : 'items-end'} gap-3 md:gap-4 z-30 w-[150px] md:w-[250px] pointer-events-none">
          <div class="w-full bg-black/40 backdrop-blur-md border border-red-500/30 p-2 md:p-3 shadow-[0_0_20px_rgba(239,68,68,0.1)] mb-1">
             <div class="flex justify-between items-baseline mb-1 ${isRtlLang ? 'flex-row-reverse' : ''}">
               <span class="text-red-400/80 text-[10px] md:text-xs uppercase tracking-widest font-bold">${t('hp')}</span>
               <span id="ui-game-hp-text" class="text-red-400 font-mono text-sm md:text-lg font-bold">100%</span>
             </div>
             <div class="w-full h-1.5 md:h-2 bg-red-950 border border-red-900/50 relative overflow-hidden ${isRtlLang ? 'flex justify-end' : ''}">
               <div id="ui-game-hp-bar" class="h-full bg-red-500 shadow-[0_0_10px_#ef4444]" style="width: 100%; transition: width 0.1s linear"></div>
             </div>
          </div>

          <div class="w-full bg-black/40 backdrop-blur-md border border-fuchsia-500/30 p-2 shadow-[0_0_20px_rgba(217,70,239,0.1)]">
             <div class="flex items-center gap-2 mb-1 ${isRtlLang ? 'flex-row-reverse' : ''}">
               <i data-lucide="loader" class="w-3 h-3 text-fuchsia-400 animate-spin" id="ui-game-bh-icon"></i>
               <span class="text-fuchsia-400/80 text-[8px] md:text-[10px] uppercase tracking-widest font-bold">${isRtlLang ? 'القدرة' : 'B. HOLE'}</span>
             </div>
             <div class="w-full h-1 bg-fuchsia-950 border border-fuchsia-900/50 relative overflow-hidden ${isRtlLang ? 'flex justify-end' : ''}">
                <div id="ui-game-bh-bar" class="h-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" style="width: 0%; transition: width 0.1s linear"></div>
             </div>
          </div>
        </div>

        <!-- Center Display: Level Up / Warnings -->
        <div id="ui-game-center-msg" class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 flex flex-col items-center opacity-0 transition-opacity duration-300">
           <h2 id="ui-game-center-title" class="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"></h2>
           <p id="ui-game-center-sub" class="text-sm md:text-xl font-mono text-cyan-400 tracking-[0.3em] uppercase mt-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"></p>
        </div>

        <!-- Game Over Screen -->
        <div id="ui-game-over" class="absolute inset-0 bg-red-950/90 backdrop-blur-md flex-col items-center justify-center z-50 pointer-events-auto hidden">
           <div class="bg-black/80 border-2 border-red-500/50 p-12 md:p-20 shadow-[0_0_100px_rgba(239,68,68,0.3)] flex flex-col items-center gap-8 relative overflow-hidden">
             <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
             <div class="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
             
             <h2 class="text-5xl md:text-7xl font-black italic tracking-tighter text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] uppercase">
               ${t('gameOver')}
             </h2>
             
             <div class="flex flex-col items-center gap-2 bg-red-950/30 px-12 py-6 border border-red-900/50 w-full">
               <span class="text-red-400/60 uppercase tracking-[0.3em] font-mono text-sm">${t('finalScore')}</span>
               <span id="ui-final-score" class="text-4xl md:text-5xl font-mono font-bold text-white tracking-widest">0</span>
             </div>

             <div class="flex flex-col sm:flex-row gap-4 w-full mt-4 flex-wrap justify-center">
                <button data-action="restart-game" class="scifi-btn border-red-500 text-red-300 px-8 py-4 uppercase font-bold tracking-widest text-sm hover:bg-red-500/20 transition-colors w-full sm:w-auto" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)">
                  ${t('retry')}
                </button>
                <button data-action="back-main" class="scifi-btn border-gray-500 text-gray-300 px-8 py-4 uppercase font-bold tracking-widest text-sm hover:bg-gray-500/20 transition-colors w-full sm:w-auto" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)">
                  ${t('backToMain')}
                </button>
             </div>
           </div>
        </div>
    </div>
  `;
}
