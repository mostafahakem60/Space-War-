export class BlackHole {
  constructor(x, y, level) {
    this.x = x;
    this.y = y;
    this.radius = 100 + (level * 20); // How far it pulls
    this.power = 0.5 + (level * 0.1); // Pull strength
    this.maxLifeTime = 3000 + (level * 500); // Duration
    this.lifeTime = this.maxLifeTime;
    this.active = true;
    this.angle = 0;
  }

  update(deltaTime) {
    this.lifeTime -= deltaTime;
    if (this.lifeTime <= 0) {
      this.active = false;
    }
    this.angle += deltaTime * 0.005; // Spin visual
  }

  draw(ctx) {
    if (!this.active) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Event Horizon (Black center)
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.shadowColor = '#6b21a8'; // Purple rim
    ctx.shadowBlur = 20;
    ctx.fill();

    const fadeOut = Math.min(1, this.lifeTime / 500);
    const fadeIn = Math.min(1, (this.maxLifeTime - this.lifeTime) / 500); 
    ctx.globalAlpha = fadeOut * fadeIn;
    
    for(let i=0; i<3; i++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radius * (0.3 + i*0.2), this.radius * (0.2 + i*0.1), i * Math.PI/3, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(168, 85, 247, 0.5)' : 'rgba(34, 211, 238, 0.5)';
        ctx.lineWidth = 2 + (Math.sin(this.angle * 5 + i) * 2);
        ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(88, 28, 135, 0.05)';
    ctx.fill();

    ctx.restore();
  }
}

export class Particle {
  constructor(x, y, vx, vy, radius, color, decay = 0.02) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
    this.alpha = 1;
    this.decay = decay;
  }

  update(timeScale) {
    this.x += this.vx * timeScale;
    this.y += this.vy * timeScale;
    this.alpha -= this.decay * timeScale;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = this.alpha * 0.4;
    ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

export class Star {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.alpha = Math.random() * 0.8 + 0.2;
    this.speedMult = 1;
  }

  update(height, timeScale, globalSpeedMult = 1) {
    this.y += this.speed * timeScale * globalSpeedMult;
    if (this.y > height) {
      this.y = 0;
      this.x = Math.random() * (window.innerWidth || 800);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class Bullet {
  constructor(x, y, vx, vy, color, isEnemy, radius = 4) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.isEnemy = isEnemy;
    this.radius = radius;
    this.active = true;
  }

  update(timeScale) {
    this.x += this.vx * timeScale;
    this.y += this.vy * timeScale;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 1.8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 50;
    this.hp = 100;
    this.maxHp = 100;
    this.color = '#00ffff';
    this.weaponLevel = 1;
    this.hasShield = false;
    this.active = true;
    this.lastShotTime = 0;
    
    this.baseFireRate = 160; 
    this.fireRate = 160;
    this.bulletSpeed = 15;
    this.agility = 0.6;
    
    this.hitFlashTime = 0;
  }

  levelUp(newLevel) {
    const oldMax = this.maxHp;
    this.maxHp = 100 + (newLevel - 1) * 5;
    this.hp += (this.maxHp - oldMax);
    this.fireRate = Math.max(90, this.baseFireRate - (newLevel - 1) * 5);
    this.bulletSpeed = Math.min(22, 15 + (newLevel - 1) * 0.4);
    this.agility = Math.min(0.85, 0.6 + (newLevel - 1) * 0.015);
  }

  update(deltaTime) {
    if (this.hitFlashTime > 0) {
      this.hitFlashTime -= deltaTime;
    }
  }

  draw(ctx) {
    if (!this.active) return;
    
    ctx.save();
    
    if (this.hasShield) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width * 1.2, 0, Math.PI * 2);
      ctx.strokeStyle = '#22d3ee';
      
      ctx.lineWidth = 6;
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1;
      ctx.stroke();
    }

    ctx.translate(this.x, this.y);

    const hit = this.hitFlashTime > 0;
    const s = 1.35;
    const hw = (this.width / 2) * s;
    const hh = (this.height / 2) * s;

    if (!hit) {
      const drawThrust = (x, y, w, h) => {
        const flicker = 0.8 + Math.random() * 0.4;
        ctx.beginPath();
        ctx.moveTo(x - w/2, y);
        ctx.lineTo(x + w/2, y);
        ctx.lineTo(x, y + h * flicker);
        ctx.closePath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x - w/3, y);
        ctx.lineTo(x + w/3, y);
        ctx.lineTo(x, y + h * flicker * 0.7);
        ctx.closePath();
        ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x - w/6, y);
        ctx.lineTo(x + w/6, y);
        ctx.lineTo(x, y + h * flicker * 0.3);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      };

      drawThrust(-hw * 1.1, hh * 0.5, hw * 0.6, hh * 1.5);
      drawThrust(hw * 1.1, hh * 0.5, hw * 0.6, hh * 1.5);
      drawThrust(-hw * 0.3, hh * 0.8, hw * 0.3, hh * 0.8);
      drawThrust(hw * 0.3, hh * 0.8, hw * 0.3, hh * 0.8);
    }

    ctx.globalAlpha = 1;

    const cHullMain = hit ? '#ffffff' : '#f8fafc';
    const cHullDark = hit ? '#ffffff' : '#cbd5e1';
    const cMechDark = hit ? '#ffffff' : '#1e293b';
    const cMechMid  = hit ? '#ffffff' : '#475569';
    
    const drawEngine = (x, y) => {
      ctx.fillStyle = cMechDark;
      ctx.beginPath();
      ctx.rect(x - hw*0.4, y - hh*0.4, hw*0.8, hh*1.1);
      ctx.fill();
      
      ctx.fillStyle = cMechMid;
      ctx.fillRect(x - hw*0.42, y - hh*0.2, hw*0.84, hh*0.2);
      ctx.fillRect(x - hw*0.42, y + hh*0.2, hw*0.84, hh*0.1);
      
      ctx.fillStyle = cHullDark;
      ctx.beginPath();
      ctx.ellipse(x, y - hh*0.4, hw*0.4, hw*0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = hit ? '#ffffff' : '#0f172a';
      ctx.beginPath();
      ctx.ellipse(x, y - hh*0.4, hw*0.2, hw*0.08, 0, 0, Math.PI * 2);
      ctx.fill();
    };
    drawEngine(-hw * 1.1, hh * 0);
    drawEngine(hw * 1.1, hh * 0);

    ctx.fillStyle = cHullDark;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.2);
    ctx.lineTo(-hw * 1.3, hh * 0.2); 
    ctx.lineTo(-hw * 1.3, hh * 0.4); 
    ctx.lineTo(-hw * 0.3, hh * 0.5); 
    ctx.lineTo(0, hh * 0.7);         
    ctx.lineTo(hw * 0.3, hh * 0.5);
    ctx.lineTo(hw * 1.3, hh * 0.4);
    ctx.lineTo(hw * 1.3, hh * 0.2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = cHullMain;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.1);
    ctx.lineTo(-hw * 0.9, hh * 0.25);
    ctx.lineTo(-hw * 0.3, hh * 0.4);
    ctx.lineTo(0, hh * 0.5);
    ctx.lineTo(hw * 0.3, hh * 0.4);
    ctx.lineTo(hw * 0.9, hh * 0.25);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = cHullMain;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 1.3);
    ctx.lineTo(-hw * 0.4, -hh * 0.5);
    ctx.lineTo(-hw * 0.5, hh * 0.3);
    ctx.lineTo(-hw * 0.2, hh * 0.8);
    ctx.lineTo(hw * 0.2, hh * 0.8);
    ctx.lineTo(hw * 0.5, hh * 0.3);
    ctx.lineTo(hw * 0.4, -hh * 0.5);
    ctx.closePath();
    ctx.fill();
    
    if (!hit) {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -hh * 1.2);
      ctx.lineTo(0, -hh * 0.7);
      ctx.moveTo(-hw * 0.2, -hh * 0.3);
      ctx.lineTo(-hw * 0.4, hh * 0.2);
      ctx.moveTo(hw * 0.2, -hh * 0.3);
      ctx.lineTo(hw * 0.4, hh * 0.2);
      ctx.stroke();
    }

    if (!hit) {
      const grad = ctx.createLinearGradient(0, -hh * 0.6, 0, hh * 0.2);
      grad.addColorStop(0, '#fde68a');
      grad.addColorStop(0.3, '#f59e0b');
      grad.addColorStop(1, '#78350f');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = '#ffffff';
    }
    ctx.beginPath();
    ctx.ellipse(0, -hh * 0.15, hw * 0.25, hh * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    if (!hit) {
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -hh * 0.55);
      ctx.lineTo(0, hh * 0.25);
      ctx.moveTo(-hw * 0.23, -hh * 0.1);
      ctx.lineTo(hw * 0.23, -hh * 0.1);
      ctx.stroke();
    }

    if (!hit) {
      const drawNeon = (x1, y1, x2, y2, core, glow) => {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = glow;
        ctx.lineWidth = 6; ctx.globalAlpha = 0.5; ctx.stroke();
        ctx.strokeStyle = core;
        ctx.lineWidth = 2; ctx.globalAlpha = 1; ctx.stroke();
      };

      drawNeon(-hw*0.4, hh*0.1, -hw*0.9, hh*0.22, '#f5d0fe', '#c084fc');
      drawNeon(hw*0.4, hh*0.1, hw*0.9, hh*0.22, '#f5d0fe', '#c084fc');
      drawNeon(-hw*0.25, -hh*0.6, -hw*0.42, 0, '#cffafe', '#06b6d4');
      drawNeon(hw*0.25, -hh*0.6, hw*0.42, 0, '#cffafe', '#06b6d4');
      drawNeon(-hw*1.4, -hh*0.2, -hw*1.4, hh*0.15, '#cffafe', '#06b6d4');
      drawNeon(hw*1.4, -hh*0.2, hw*1.4, hh*0.15, '#cffafe', '#06b6d4');
    }

    ctx.restore();
  }
}

export class Enemy {
  constructor(x, y, type, level) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.active = true;
    this.lastShotTime = 0;
    this.hitFlashTime = 0;
    this.angle = 0;
    
    if (type === 0) {
      this.radius = 20;
      this.hp = 15 + level * 5;
      this.color = '#ec4899';
      this.vy = 3 + Math.random() * 2;
      this.vx = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random());
      this.fireRate = 0;
    } else if (type === 1) {
      this.radius = 25;
      this.hp = 40 + level * 10;
      this.color = '#eab308';
      this.vy = 1.5 + Math.random();
      this.vx = (Math.random() - 0.5) * 3;
      this.fireRate = Math.max(800, 1800 - level * 50);
    } else if (type === 2) {
      this.radius = 35;
      this.hp = 120 + level * 25;
      this.color = '#a855f7';
      this.vy = 0.8 + Math.random() * 0.4;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.fireRate = Math.max(1000, 2200 - level * 60);
    } else {
      this.radius = 60;
      this.hp = 600 + level * 150;
      this.color = '#ef4444'; 
      this.vy = 0.5;
      this.vx = 1.5;
      this.fireRate = Math.max(400, 800 - level * 20);
    }
    this.maxHp = this.hp;
  }

  update(deltaTime, width, timeScale) {
    this.x += this.vx * timeScale;
    this.y += this.vy * timeScale;
    
    if (this.type === 3) {
      if (this.y > 150) this.vy = 0;
    }

    if (this.x - this.radius < 0) {
       this.x = this.radius;
       this.vx *= -1;
    } else if (this.x + this.radius > width) {
       this.x = width - this.radius;
       this.vx *= -1;
    }
    
    if (this.hitFlashTime > 0) {
      this.hitFlashTime -= deltaTime;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    if (this.hitFlashTime > 0) {
      ctx.fillStyle = '#ffffff';
    } else {
      ctx.strokeStyle = this.color;
    }
    
    ctx.beginPath();
    if (this.type === 0) {
      ctx.moveTo(0, this.radius); 
      ctx.lineTo(this.radius/1.5, -this.radius); 
      ctx.lineTo(0, -this.radius/2); 
      ctx.lineTo(-this.radius/1.5, -this.radius); 
    } else if (this.type === 1) {
      ctx.moveTo(0, this.radius * 0.8); 
      ctx.lineTo(this.radius * 0.3, 0); 
      ctx.lineTo(this.radius, -this.radius * 0.5); 
      ctx.lineTo(this.radius * 0.6, -this.radius * 0.8); 
      ctx.lineTo(0, -this.radius * 0.4); 
      ctx.lineTo(-this.radius * 0.6, -this.radius * 0.8);
      ctx.lineTo(-this.radius, -this.radius * 0.5); 
      ctx.lineTo(-this.radius * 0.3, 0); 
    } else if (this.type === 2) {
      ctx.moveTo(0, this.radius); 
      ctx.lineTo(this.radius * 0.8, this.radius * 0.4); 
      ctx.lineTo(this.radius, -this.radius * 0.6); 
      ctx.lineTo(this.radius * 0.4, -this.radius); 
      ctx.lineTo(-this.radius * 0.4, -this.radius); 
      ctx.lineTo(-this.radius, -this.radius * 0.6); 
      ctx.lineTo(-this.radius * 0.8, this.radius * 0.4);
    } else {
      ctx.moveTo(0, this.radius);
      ctx.lineTo(this.radius * 0.2, this.radius * 0.4);
      ctx.lineTo(this.radius * 0.9, this.radius * 0.2);
      ctx.lineTo(this.radius * 0.6, -this.radius * 0.8);
      ctx.lineTo(this.radius * 0.2, -this.radius * 0.5);
      ctx.lineTo(0, -this.radius);
      ctx.lineTo(-this.radius * 0.2, -this.radius * 0.5);
      ctx.lineTo(-this.radius * 0.6, -this.radius * 0.8);
      ctx.lineTo(-this.radius * 0.9, this.radius * 0.2);
      ctx.lineTo(-this.radius * 0.2, this.radius * 0.4);
    }
    ctx.closePath();
    
    if (this.hitFlashTime > 0) {
      ctx.fill();
    } else {
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 6;
      ctx.stroke();
      
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    
    ctx.translate(-this.x, -this.y);
    
    const hpPct = this.hp / this.maxHp;
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x - 20, this.y - this.radius - 15, 40, 4);
    ctx.fillStyle = '#00ff00';
    ctx.shadowBlur = 0;
    ctx.fillRect(this.x - 20, this.y - this.radius - 15, 40 * hpPct, 4);
    ctx.restore();
  }
}

export class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.type = type;
    this.vy = 2;
    this.active = true;
    this.angle = 0;
    
    switch(type) {
      case 'shield': this.color = '#3b82f6'; break;
      case 'weapon': this.color = '#f59e0b'; break;
      case 'heal': this.color = '#10b981'; break;
    }
  }

  update(timeScale) {
    this.y += this.vy * timeScale;
    this.angle += 0.05 * timeScale;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    ctx.strokeStyle = this.color;
    
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(this.radius, 0);
    ctx.lineTo(0, this.radius);
    ctx.lineTo(-this.radius, 0);
    ctx.closePath();
    
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 6;
    ctx.stroke();
    
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.5;
    ctx.fill();
    
    ctx.restore();
  }
}
