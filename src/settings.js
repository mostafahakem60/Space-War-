import { appState, t, isRtl, playSound } from './data.js';

export function renderSettings() {
  const rtl = isRtl();
  return `
    <div class="w-full flex items-center justify-center panel-animate-in mx-auto">
      <div class="w-full max-w-2xl backdrop-blur-xl bg-black/50 border border-gray-500/30 p-8 md:p-12 shadow-[0_0_40px_rgba(255,255,255,0.05)] relative overflow-hidden flex flex-col gap-6" style="clip-path: polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)">
           <h2 class="text-2xl font-black italic text-gray-300 uppercase tracking-widest flex items-center border-b border-white/10 pb-4">
             <i data-lucide="volume-2" class="${rtl ? 'ml-3' : 'mr-3'} text-cyan-400"></i> ${t('settings')}
           </h2>

           <div class="space-y-4 font-mono text-sm text-gray-300">
             <div class="flex items-center justify-between hover:bg-white/5 p-2 rounded cursor-pointer transition-colors">
               <span>${t('audio')}</span>
               <div class="w-48 h-2 bg-white/10"><div class="w-[80%] h-full bg-cyan-400"></div></div>
             </div>
             <div class="flex items-center justify-between hover:bg-white/5 p-2 rounded cursor-pointer transition-colors mt-4">
               <span>${t('graphics')}</span>
               <span class="text-cyan-400">ULTRA</span>
             </div>
             <div class="flex items-center justify-between hover:bg-white/5 p-2 rounded cursor-pointer transition-colors">
               <span>${t('controls')}</span>
               <div class="w-48 h-2 bg-white/10"><div class="w-[60%] h-full bg-cyan-400"></div></div>
             </div>
             
             <!-- LANGUAGE TOGGLE -->
             <div class="flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-white/5 p-2 rounded cursor-pointer transition-colors mt-4 border-t border-white/5 pt-4">
               <span class="mb-2 md:mb-0">${t('language')}</span>
               <div class="flex gap-2">
                 <button data-action="set-lang" data-lang="en" dir="ltr" class="px-4 py-1 border ${appState.language === 'en' ? 'border-cyan-400 bg-cyan-900/40 text-white' : 'border-gray-600 text-gray-400 hover:text-white'} transition-colors font-sans">
                   ${t('english')}
                 </button>
                 <button data-action="set-lang" data-lang="ar" dir="rtl" class="px-4 py-1 border ${appState.language === 'ar' ? 'border-cyan-400 bg-cyan-900/40 text-white' : 'border-gray-600 text-gray-400 hover:text-white'} transition-colors font-arabic">
                     ${t('arabic')}
                 </button>
               </div>
             </div>

             <!-- DIFFICULTY TOGGLE -->
             <div class="flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-white/5 p-2 rounded cursor-pointer transition-colors pt-2">
               <span class="mb-2 md:mb-0">${t('difficulty')}</span>
               <div class="flex gap-2 flex-wrap ${rtl ? 'flex-row-reverse' : ''}">
                 ${['easy', 'normal', 'hard', 'nightmare'].map(level => {
                    const isSelected = appState.difficulty === level;
                    const colors = level === 'nightmare' 
                        ? (isSelected ? 'border-red-500 bg-red-900/40 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-gray-600 text-red-400 hover:text-red-300')
                        : (isSelected ? 'border-cyan-400 bg-cyan-900/40 text-white' : 'border-gray-600 text-gray-400 hover:text-white');
                    return `
                    <button data-action="set-diff" data-diff="${level}" class="px-3 py-1 text-xs border ${colors} transition-colors tracking-widest">${t(level)}</button>
                    `;
                 }).join('')}
               </div>
             </div>
           </div>

           <button data-action="back-main" class="mt-8 self-start text-sm text-gray-400 hover:text-white font-mono uppercase bg-transparent border border-gray-600 hover:border-gray-400 px-4 py-2 transition-colors">
             ${t('backToMain')}
           </button>
        </div>
    </div>
  `;
}

export function renderAchievements() {
  const rtl = isRtl();
  const achievements = [
    { title: 'First Blood', desc: 'Destroy 100 enemy scouts', done: true },
    { title: 'Iron Clad', desc: 'Survive to level 10 without damage', done: true },
    { title: 'Dreadnought Hunter', desc: 'Defeat the Abyssal Boss', done: false },
    { title: 'Nova Core', desc: 'Collect 50 weapon powerups', done: true },
    { title: 'Untouchable', desc: 'Dodge 1000 projectiles', done: false },
  ];

  return `
    <div class="w-full flex items-center justify-center panel-animate-in mx-auto">
      <div class="w-full max-w-2xl backdrop-blur-xl bg-emerald-900/10 border border-emerald-500/30 p-8 md:p-12 shadow-[0_0_40px_rgba(16,185,129,0.1)] relative overflow-hidden" style="clip-path: polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)">
           <h2 class="text-2xl font-black italic text-emerald-400 mb-6 uppercase tracking-widest flex items-center border-b border-emerald-400/20 pb-4">
             <i data-lucide="award" class="${rtl ? 'ml-3' : 'mr-3'}"></i> ${t('achievements')}
           </h2>

           <div class="space-y-3 h-[250px] overflow-y-auto pr-2 custom-scrollbar">
             ${achievements.map(ach => `
               <div class="flex items-start p-3 border ${ach.done ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-700/50 opacity-50'} transition-colors gap-4">
                 <i data-lucide="shield" class="mt-1 flex-shrink-0 ${ach.done ? 'text-emerald-400' : 'text-gray-600'} w-6 h-6"></i>
                 <div>
                   <h3 class="font-mono font-bold uppercase text-sm ${ach.done ? 'text-white' : 'text-gray-400'}">${ach.title}</h3>
                   <p class="text-xs text-gray-500 uppercase">${ach.desc}</p>
                 </div>
               </div>
             `).join('')}
           </div>

           <button data-action="back-main" class="mt-6 self-start text-sm text-gray-400 hover:text-white font-mono uppercase bg-transparent border border-gray-600 hover:border-emerald-400 hover:text-emerald-300 px-4 py-2 transition-colors">
             ${t('backToMain')}
           </button>
        </div>
    </div>
  `;
}
