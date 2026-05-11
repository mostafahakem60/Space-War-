import { appState, t, isRtl, playSound, rarityColors, raritySolidColors, WEAPONS_DATA } from './data.js';

export function renderShop() {
  const rtl = isRtl();
  const selectedItem = appState.selectedItem || WEAPONS_DATA[2];
  
  const menuItems = [
    { id: 'WEAPONS', labelKey: 'weapons', icon: 'crosshair' },
    { id: 'DEFENSE', labelKey: 'defense', icon: 'shield' },
    { id: 'ENGINES', labelKey: 'engines', icon: 'rocket' },
    { id: 'ABILITIES', labelKey: 'abilities', icon: 'zap' },
    { id: 'SKINS', labelKey: 'skins', icon: 'paintbrush' },
    { id: 'BUNDLES', labelKey: 'bundles', icon: 'package' },
  ];

  const stats = { damage: 1250, defense: 1100, speed: 1350, energy: 1000 };

  let html = `
    <div class="absolute inset-0 bg-[#02040b] text-white flex flex-col z-50 overflow-hidden select-none panel-animate-in ${rtl ? 'font-arabic' : 'font-sans'}">
      <div class="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,#101633_0%,#02040b_70%)] opacity-80"></div>
      <div class="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen"></div>
      
      <div class="relative z-10 w-full h-full flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">
        <!-- TOP BAR -->
        <div class="w-full flex items-center justify-between px-6 md:px-10 py-5 border-b border-blue-900/40 bg-black/40 backdrop-blur-md sticky top-0 z-50">
          <div class="flex flex-col">
            <h1 class="text-3xl md:text-4xl font-black italic tracking-widest text-[#e2e8f0] drop-shadow-[0_0_10px_rgba(96,165,250,0.5)] leading-none uppercase">
              ${t('shopTitle')}
            </h1>
            <span class="text-blue-300/80 text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold mt-1">
              ${t('upgradeYourShipTitle')}
            </span>
          </div>
          <div class="flex items-center gap-3 md:gap-6">
            <!-- Credits -->
            <div class="flex items-center gap-2 md:gap-3 bg-[#0a1120]/80 border border-blue-500/30 px-3 md:px-4 py-1.5 shadow-[0_0_15px_rgba(59,130,246,0.15)] ${rtl ? 'transform skew-x-[15deg] flex-row-reverse' : 'transform skew-x-[-15deg]'}">
              <i data-lucide="hexagon" class="text-blue-400 w-4 h-4 md:w-5 md:h-5 fill-blue-500/20 ${rtl ? 'transform skew-x-[-15deg]' : 'transform skew-x-[15deg]'}"></i>
              <div class="flex flex-col -mt-1 ${rtl ? 'transform skew-x-[-15deg] text-right' : 'transform skew-x-[15deg]'}">
                <span class="text-[8px] md:text-[10px] text-blue-300 font-bold uppercase tracking-widest leading-none mt-1">${t('credits')}</span>
                <span id="ui-credits" class="font-mono font-bold tracking-wider text-white text-sm md:text-base leading-none">${appState.credits.toLocaleString()}</span>
              </div>
            </div>
            <!-- Premium -->
            <div class="flex items-center gap-2 md:gap-3 bg-[#171108]/80 border border-amber-500/30 px-3 md:px-4 py-1.5 shadow-[0_0_15px_rgba(245,158,11,0.1)] ${rtl ? 'transform skew-x-[15deg] flex-row-reverse' : 'transform skew-x-[-15deg]'}">
              <i data-lucide="hexagon" class="text-amber-400 w-4 h-4 md:w-5 md:h-5 fill-amber-500/20 ${rtl ? 'transform skew-x-[-15deg]' : 'transform skew-x-[15deg]'}"></i>
              <div class="flex flex-col -mt-1 ${rtl ? 'transform skew-x-[-15deg] text-right' : 'transform skew-x-[15deg]'}">
                <span class="text-[8px] md:text-[10px] text-amber-300 font-bold uppercase tracking-widest leading-none mt-1">${t('premium')}</span>
                <span class="font-mono font-bold tracking-wider text-white text-sm md:text-base leading-none">${appState.premiumCredits.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr_250px] gap-6 px-6 pt-10 pb-6 relative">
          <!-- TITLE OVERLAY -->
          <div class="absolute top-4 left-0 w-full flex flex-col items-center pointer-events-none z-20">
            <h2 class="text-2xl md:text-3xl font-black italic tracking-widest text-[#f1f5f9] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">VOID HUNTER</h2>
            <p class="text-gray-400 tracking-[0.2em] uppercase text-xs mt-1 font-mono">${t('classInterceptor')}</p>
          </div>

          <!-- Left Nav -->
          <div class="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible z-20 pt-8 pb-4 md:py-0 px-2 md:px-0 scrollbar-hide">
             ${menuItems.map(cat => {
               const active = appState.activeCategory === cat.id;
               const classes = active ? 'border-blue-400 bg-blue-900/40 text-white shadow-[inset_0_0_20px_rgba(59,130,246,0.3),0_0_15px_rgba(59,130,246,0.4)]' 
               : 'border-blue-900/50 bg-[#050b1a]/60 text-blue-300/60 hover:text-blue-200 hover:border-blue-500/50 hover:bg-blue-900/20';
               const marginStyle = active ? (rtl ? 'margin-right: 0' : 'margin-left: 0') : '';
               return `
               <button data-action="shop-cat" data-cat="${cat.id}" class="flex items-center gap-3 px-4 py-3 transition-all duration-300 border backdrop-blur-sm whitespace-nowrap min-w-[150px] md:min-w-0 ${rtl ? 'transform skew-x-[10deg] mr-0 md:mr-4 flex-row-reverse' : 'transform skew-x-[-10deg] ml-0 md:ml-4'} ${classes}" style="${marginStyle}">
                 <div class="flex items-center justify-center w-6 ${rtl ? 'transform skew-x-[-10deg]' : 'transform skew-x-[10deg]'}">
                   <i data-lucide="${cat.icon}" class="w-5 h-5 ${active ? 'text-blue-300' : 'text-blue-500/50'}"></i>
                 </div>
                 <span class="font-bold tracking-[0.15em] text-xs md:text-sm uppercase ${rtl ? 'transform skew-x-[-10deg]' : 'transform skew-x-[10deg]'}">
                   ${t(cat.labelKey)}
                 </span>
               </button>`;
             }).join('')}
          </div>

           <!-- 3D SHIP (Center) -->
          <div class="relative h-[300px] md:h-[400px] flex items-center justify-center pointer-events-none mt-4 md:-mt-8">
            <div class="animate-shop-ship-float relative w-full h-full max-w-[400px]" style="perspective: 1200px; transform-style: preserve-3d">
              <!-- Hologram -->
              <div class="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[120%] h-[120px] rounded-[50%] border border-cyan-500/40 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.2)_0%,transparent_60%)] transform rotate-X-[75deg] shadow-[0_0_40px_rgba(34,211,238,0.3)]">
                 <div class="absolute inset-2 rounded-[50%] border-2 border-dashed border-cyan-400/30 animate-[spin_60s_linear_infinite]"></div>
                 <div class="absolute inset-8 rounded-[50%] border border-blue-400/20"></div>
              </div>
              
              <!-- Ship CSS Shapes -->
              <div class="absolute inset-0 flex items-center justify-center transform rotate-x-[15deg] ${rtl ? 'rotate-z-[5deg]' : '-rotate-z-[5deg]'}">
                <div class="w-[80%] h-[70px] bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 border border-gray-500 rounded-[100%_40%_40%_100%] shadow-[inset_0_-10px_20px_rgba(0,0,0,0.8),0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                   <div class="absolute top-2 left-[20%] w-[50%] h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                   <div class="absolute bottom-2 left-[30%] w-[40%] h-1 bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>
                   <div class="absolute top-[-5px] left-[35%] w-[30%] h-[25px] rounded-full bg-black border border-gray-600 shadow-[inset_0_2px_15px_rgba(168,85,247,0.6)] transform skew-x-[-25deg]"></div>
                </div>
                <div class="absolute top-[20%] left-[10%] w-[60%] h-[50px] bg-gray-800 border-l border-t border-gray-500 shadow-2xl flex items-end justify-center pb-2 z-10" style="clip-path:polygon(20% 0%,100% 100%,0% 100%)">
                  <div id="ship-weapon-bar" class="w-[80%] h-1.5" style="background-color: ${raritySolidColors[selectedItem.rarity]}; box-shadow: 0 0 15px ${raritySolidColors[selectedItem.rarity]}"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Stats -->
          <div class="flex flex-col gap-6 z-20 pt-8">
            <div class="self-end relative ${rtl ? 'self-start' : ''}">
              <div class="bg-[#1a0b26]/90 border border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.3)] px-6 py-2 flex items-center gap-3 ${rtl ? 'transform skew-x-[15deg] flex-row-reverse' : 'transform skew-x-[-15deg]'}">
                <div class="flex flex-col items-end ${rtl ? 'transform skew-x-[-15deg] items-start' : 'transform skew-x-[15deg]'}">
                  <span class="text-purple-300 text-[9px] tracking-widest font-bold uppercase leading-none mt-1">${t('power')}</span>
                  <div id="ui-power" class="text-2xl md:text-3xl font-mono font-black text-white leading-none mt-1">
                    ${appState.power.toLocaleString()}
                  </div>
                </div>
                <div class="${rtl ? 'transform skew-x-[-15deg]' : 'transform skew-x-[15deg]'}">
                   <i data-lucide="shield" class="w-6 h-6 text-purple-400 fill-purple-500/20"></i>
                </div>
              </div>
            </div>

            <div class="bg-[#050a14]/80 border border-blue-900/50 backdrop-blur-md p-4 max-w-[250px] ${rtl ? 'mr-auto' : 'ml-auto'}">
              <h3 class="text-[10px] font-bold tracking-[0.2em] text-blue-200 mb-4 uppercase border-b border-blue-900/50 pb-2">${t('currentStats')}</h3>
              <div class="space-y-4">
                ${[
                  { label: t('damage'), val: stats.damage, color: 'bg-orange-500', shadow: 'shadow-[0_0_8px_#f97316]' },
                  { label: t('armor'), val: stats.defense, color: 'bg-green-500', shadow: 'shadow-[0_0_8px_#22c55e]' },
                  { label: t('speed'), val: stats.speed, color: 'bg-blue-500', shadow: 'shadow-[0_0_8px_#3b82f6]' },
                  { label: t('energy'), val: stats.energy, color: 'bg-cyan-500', shadow: 'shadow-[0_0_8px_#06b6d4]' },
                ].map(stat => `
                  <div class="flex flex-col gap-1.5">
                    <div class="flex justify-between text-[10px] font-mono uppercase text-gray-300 items-baseline ${rtl ? 'flex-row-reverse' : ''}">
                      <span>${stat.label}</span> 
                      <span class="font-bold text-white text-xs">${stat.val.toLocaleString()}</span>
                    </div>
                    <div class="w-full bg-[#101726] h-1.5 overflow-hidden flex border border-white/5 ${rtl ? 'justify-end' : ''}">
                       <div class="h-full ${stat.color} ${stat.shadow}" style="width: ${(stat.val/2000)*100}%"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="w-full max-w-[1200px] mx-auto px-6 mt-2 relative z-20">
          <div class="flex justify-between items-end mb-4 border-b border-blue-900/30 pb-2 ${rtl ? 'flex-row-reverse' : ''}">
            <h2 class="text-lg font-bold tracking-widest text-[#e2e8f0] uppercase">${t(appState.activeCategory.toLowerCase()) || appState.activeCategory}</h2>
          </div>

          <div class="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x custom-scrollbar ${rtl ? 'flex-row-reverse' : ''}">
            ${WEAPONS_DATA.map(item => {
              const isSelected = selectedItem.id === item.id;
              const isOwned = appState.purchased.includes(item.id);
              const rColorClasses = rarityColors[item.rarity];
              const rHex = raritySolidColors[item.rarity];
              const style = isSelected ? `border-color: ${rHex}; background-color: ${rHex}10; box-shadow: 0 0 20px ${rHex}40` : '';
              
              return `
                <div data-action="select-item" data-id="${item.id}" class="snap-center flex-shrink-0 w-64 border transition-all duration-300 cursor-pointer p-4 flex flex-col justify-between relative group ${isSelected ? '' : rColorClasses} ${isSelected ? '-translate-y-1' : 'hover:-translate-y-0.5'}" style="${style}">
                  <div class="text-center mb-6">
                    <h4 class="font-bold tracking-wider uppercase text-sm text-[#f8fafc] leading-tight mb-1">${t(item.nameKey)}</h4>
                    <span class="text-[9px] uppercase font-bold tracking-widest" style="color: ${rHex}">${t(item.rarity)}</span>
                  </div>

                  <div class="w-full aspect-[4/3] flex items-center justify-center mb-6 relative">
                    <div class="absolute inset-x-8 top-1/2 -translate-y-1/2 h-1/2 bg-[radial-gradient(ellipse_at_center,currentColor,transparent_70%)] opacity-20" style="color: ${rHex}"></div>
                    <i data-lucide="target" class="w-16 h-16 opacity-80" style="color: ${rHex}"></i>
                  </div>
                  
                  <div class="space-y-1.5 mb-6 font-mono text-[10px] border-t border-white/5 pt-4">
                    ${item.damage ? `<div class="flex justify-between ${rtl ? 'flex-row-reverse' : ''}"><span class="uppercase text-gray-400">${t('damage')}</span> <span class="text-[#e2e8f0] font-bold">${item.damage}</span></div>` : ''}
                    ${item.fireRate ? `<div class="flex justify-between ${rtl ? 'flex-row-reverse' : ''}"><span class="uppercase text-gray-400">${t('fireRate')}</span> <span class="text-[#e2e8f0] font-bold">${item.fireRate}</span></div>` : ''}
                    ${item.energy ? `<div class="flex justify-between ${rtl ? 'flex-row-reverse' : ''}"><span class="uppercase text-gray-400">${t('energy')}</span> <span class="text-[#e2e8f0] font-bold">${item.energy}</span></div>` : ''}
                  </div>

                  <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-center gap-2 border px-3 py-1.5 bg-black/40 ${rtl ? 'flex-row-reverse' : ''}" style="border-color: ${rHex}30">
                       <i data-lucide="hexagon" fill="${rHex}20" class="w-3 h-3" style="color: ${rHex}"></i>
                       <span class="font-mono font-bold text-sm tracking-wider" style="color: ${isSelected ? '#fff' : rHex}">${item.price.toLocaleString()}</span>
                    </div>
                    
                    <button data-action="buy-item" data-id="${item.id}" ${isOwned || appState.credits < item.price ? 'disabled' : ''} class="w-full py-2 text-xs font-bold uppercase tracking-widest transition-all ${isOwned ? 'bg-[#0f172a] text-gray-500 border border-gray-700' : 'border hover:brightness-125 hover:text-white'}" style="${!isOwned ? `border-color: ${rHex}; color: ${rHex}; background-color: ${isSelected ? `${rHex}20` : 'transparent'}; text-shadow: ${isSelected ? `0 0 5px ${rHex}` : 'none'}` : ''}">
                      ${isOwned ? t('equipped') : t('buy')}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="w-full max-w-[1200px] mx-auto px-6 mt-4 relative z-20 mb-8" id="selected-item-detail">
          ${renderSelectedItem(selectedItem, rtl)}
        </div>
      </div>
      
      <!-- Close button -->
      <button data-action="back-main" class="absolute top-6 ${rtl ? 'left-6 md:left-10' : 'right-6 md:right-10'} z-[60] bg-black/50 border border-white/20 p-2 text-gray-400 hover:text-white hover:border-white transition-colors backdrop-blur-md cursor-pointer">
        <i data-lucide="x" class="w-6 h-6"></i>
      </button>

    </div>
  `;
  return html;
}

function renderSelectedItem(item, rtl) {
  const isOwned = appState.purchased.includes(item.id);
  const rHex = raritySolidColors[item.rarity];
  return `
    <div class="panel-animate-in w-full bg-[#030712] border border-gray-800 flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative ${rtl ? 'md:flex-row-reverse' : 'md:flex-row'}">
      <div class="w-full md:w-[40%] border-b md:border-b-0 p-8 flex items-center justify-center relative overflow-hidden min-h-[250px] ${rtl ? 'md:border-l border-gray-800' : 'md:border-r border-gray-800'}">
        <div class="absolute inset-0" style="background: radial-gradient(ellipse at center, ${rHex}15 0%, transparent 70%)"></div>
        ${isOwned ? `
        <div class="absolute top-4 ${rtl ? 'right-4' : 'left-4'} flex items-center gap-2 text-green-400 border border-green-500/40 bg-green-900/20 px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full">
          <i data-lucide="check-circle-2" class="w-4 h-4"></i> ${t('equipped')}
        </div>
        ` : ''}
        <i data-lucide="crosshair" class="w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" style="color: ${rHex}"></i>
      </div>

      <div class="flex-1 p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 border-gray-800 ${rtl ? 'md:border-l' : 'md:border-r'}">
        <h3 class="text-xl font-black uppercase italic tracking-wider text-[#f1f5f9] mb-1">${t(item.nameKey)}</h3>
        <span class="text-xs font-bold uppercase tracking-widest mb-4" style="color: ${rHex}">${t(item.rarity)}</span>
        <p class="text-gray-400 text-[11px] leading-relaxed max-w-sm mb-6">${t(item.descKey)}</p>
        
        <div class="space-y-4 max-w-sm">
          ${item.damage ? `
          <div class="flex items-center gap-4 ${rtl ? 'flex-row-reverse' : ''}">
            <span class="text-[10px] text-gray-500 uppercase font-mono w-16 ${rtl ? 'text-right' : ''}">${t('damage')}</span>
            <div class="flex-1 flex gap-1 h-3 ${rtl ? 'flex-row-reverse' : ''}">
               ${Array.from({length: 10}).map((_, i) => `<div class="flex-1 ${i < (item.damage / 150) ? 'bg-orange-500 shadow-[0_0_5px_#f97316]' : 'bg-gray-800'}"></div>`).join('')}
            </div>
            <div class="flex items-center gap-2 font-mono text-xs w-20 justify-end ${rtl ? 'flex-row-reverse' : ''}">
              <span class="font-bold text-white">${item.damage}</span>
              <span class="text-green-400 text-[9px] font-bold">▲ 250</span>
            </div>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="w-full md:w-[250px] p-6 flex flex-col justify-between bg-[#050814]">
        <div>
          <h4 class="text-[10px] font-bold text-gray-300 tracking-widest uppercase mb-1">${t('compare')}</h4>
          <p class="text-[9px] text-gray-500 tracking-wider uppercase mb-4 border-b border-gray-800 pb-2">${t('currentEquipped')}</p>
        </div>

        <div class="mt-auto">
          <div class="flex items-center justify-center gap-2 border border-blue-900/50 bg-[#0a1120] py-2 mb-2 ${rtl ? 'flex-row-reverse' : ''}">
            <i data-lucide="hexagon" fill="#3b82f640" class="w-4 h-4 text-blue-400"></i>
            <span class="font-mono font-bold text-lg text-white">${item.price.toLocaleString()}</span>
          </div>
          <button data-action="buy-item" data-id="${item.id}" ${isOwned || appState.credits < item.price ? 'disabled' : ''} class="w-full py-3 bg-[linear-gradient(to_bottom,#f59e0b,#d97706)] text-black font-black uppercase text-sm tracking-widest border border-yellow-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all">
            ${isOwned ? t('equipped') : t('buy')}
          </button>
        </div>
      </div>
    </div>
  `;
}
