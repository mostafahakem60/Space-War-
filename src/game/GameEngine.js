import { Player, Enemy, Bullet, Particle, Star, PowerUp, BlackHole } from './Entities.js';

export class GameEngine {
  constructor(canvas, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.opts = opts || {};
    this.opts.onLevelUpdate = this.opts.onLevelUpdate || (() => {});
    this.opts.onTimeUpdate = this.opts.onTimeUpdate || (() => {});
    this.opts.onScoreUpdate = this.opts.onScoreUpdate || (() => {});
    this.opts.onHpUpdate = this.opts.onHpUpdate || (() => {});
    this.opts.onGameOver = this.opts.onGameOver || (() => {});
    
    this.player = new Player(canvas.width / 2, canvas.height - 100);
    
    this.enemies = [];
    this.bullets = [];
    this.particles = [];
    this.stars = [];
    this.powerups = [];
    this.blackHoles = [];

    this.score = 0;
    this.level = 1;
    this.timePlayed = 0;
    this.lastTime = 0;
    this.animFrameId = 0;
    this.running = false;
    
    this.shakeTime = 0;
    this.shakeMagnitude = 0;

    this.enemySpawnTimer = 0;
    this.enemySpawnRate = 2000;
    this.levelTimer = 0;
    
    this.bgTheme = { r: 5, g: 5, b: 5, starSpeed: 1 };
    this.targetTheme = { r: 5, g: 5, b: 5, starSpeed: 1 };
    
    this.isPointerDown = false;
    this.pointerX = 0;
    this.pointerY = 0;
    
    this.audioCtx = null;
    this.audioEnabled = false;

    for (let i = 0; i < 100; i++) {
      this.stars.push(new Star(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2 + 0.5,
        Math.random() * 0.5 + 0.1
      ));
    }

    this.setupInputs();
  }

  get playerHP() {
    return this.player ? this.player.hp : 0;
  }

  get isGameOver() {
    return this.player ? !this.player.active : true;
  }

  initAudio() {
    if (!this.audioEnabled) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        this.audioEnabled = true;
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
  }

  playSound(type) {
    if (!this.audioCtx || !this.audioEnabled) return;
    
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const start = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    
    if (type === 'shoot') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, start);
      osc.frequency.exponentialRampToValueAtTime(300, start + 0.1);
      gainNode.gain.setValueAtTime(0.1, start);
      gainNode.gain.exponentialRampToValueAtTime(0.01, start + 0.1);
      osc.start(start);
      osc.stop(start + 0.1);
    } else if (type === 'explosion') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, start);
      osc.frequency.exponentialRampToValueAtTime(0.01, start + 0.3);
      gainNode.gain.setValueAtTime(0.2, start);
      gainNode.gain.exponentialRampToValueAtTime(0.01, start + 0.3);
      osc.start(start);
      osc.stop(start + 0.3);
    } else if (type === 'hit') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, start);
      osc.frequency.exponentialRampToValueAtTime(100, start + 0.1);
      gainNode.gain.setValueAtTime(0.1, start);
      gainNode.gain.exponentialRampToValueAtTime(0.01, start + 0.1);
      osc.start(start);
      osc.stop(start + 0.1);
    } else if (type === 'powerup') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, start);
      osc.frequency.linearRampToValueAtTime(800, start + 0.1);
      osc.frequency.linearRampToValueAtTime(1200, start + 0.2);
      gainNode.gain.setValueAtTime(0.1, start);
      gainNode.gain.linearRampToValueAtTime(0.01, start + 0.3);
      osc.start(start);
      osc.stop(start + 0.3);
    }
  }

  setupInputs() {
    const handlePointerMove = (e) => {
      e.preventDefault();
      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      const rect = this.canvas.getBoundingClientRect();
      this.pointerX = clientX - rect.left;
      this.pointerY = clientY - rect.top;
      
      if (this.isPointerDown) {
        this.player.x += (this.pointerX - this.player.x) * this.player.agility; 
        this.player.y += (this.pointerY - 60 - this.player.y) * this.player.agility; 
        
        this.player.x = Math.max(this.player.width/2, Math.min(this.canvas.width - this.player.width/2, this.player.x));
        this.player.y = Math.max(this.player.height/2, Math.min(this.canvas.height - this.player.height/2, this.player.y));
      }
    };

    const handlePointerDown = (e) => {
      e.preventDefault();
      this.isPointerDown = true;
      this.initAudio();
      handlePointerMove(e);
    };

    const handlePointerUp = (e) => {
      e.preventDefault();
      this.isPointerDown = false;
    };

    this.canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    this.canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
    this.canvas.addEventListener('touchend', handlePointerUp, { passive: false });
    
    this.canvas.addEventListener('mousedown', handlePointerDown);
    this.canvas.addEventListener('mousemove', handlePointerMove);
    this.canvas.addEventListener('mouseup', handlePointerUp);
    this.canvas.addEventListener('mouseleave', handlePointerUp);
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.loop(performance.now());
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.animFrameId);
  }

  shake(magnitude, duration) {
    this.shakeMagnitude = magnitude;
    this.shakeTime = duration;
  }

  createExplosion(x, y, color, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1;
      
      let p = this.particles.find(part => part.alpha <= 0);
      if (p) {
        p.x = x; p.y = y; p.vx = Math.cos(angle) * speed; p.vy = Math.sin(angle) * speed;
        p.radius = Math.random() * 3 + 1; p.color = color; p.decay = Math.random() * 0.05 + 0.01; p.alpha = 1;
      } else {
        this.particles.push(new Particle(
          x, y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          Math.random() * 3 + 1,
          color,
          Math.random() * 0.05 + 0.01
        ));
      }
    }
  }

  spawnBullet(x, y, vx, vy, color, isEnemy, radius = 4) {
    let b = this.bullets.find(bullet => !bullet.active);
    if (b) {
      b.x = x; b.y = y; b.vx = vx; b.vy = vy; b.color = color; b.isEnemy = isEnemy; b.radius = radius; b.active = true;
    } else {
      this.bullets.push(new Bullet(x, y, vx, vy, color, isEnemy, radius));
    }
  }

  updateThemeForLevel() {
    if (this.level % 10 === 0) {
      this.targetTheme = { r: 10, g: 0, b: 0, starSpeed: 3 };
    } else if (this.level % 5 === 0) {
      this.targetTheme = { r: 25, g: 0, b: 0, starSpeed: 2 };
    } else if (this.level >= 6 && this.level <= 9) {
      this.targetTheme = { r: 5, g: 0, b: 15, starSpeed: 1.5 };
    } else if (this.level > 10) {
      this.targetTheme = { r: 0, g: 15, b: 5, starSpeed: 2.5 };
    } else {
      this.targetTheme = { r: 5, g: 5, b: 5, starSpeed: 1 };
    }
  }

  update(deltaTime) {
    if (!this.player.active) return;
    
    let timeScale = deltaTime / 16.6667;
    if (isNaN(timeScale) || timeScale < 0) timeScale = 1;

    this.bgTheme.r += (this.targetTheme.r - this.bgTheme.r) * 0.02 * timeScale;
    this.bgTheme.g += (this.targetTheme.g - this.bgTheme.g) * 0.02 * timeScale;
    this.bgTheme.b += (this.targetTheme.b - this.bgTheme.b) * 0.02 * timeScale;
    this.bgTheme.starSpeed += (this.targetTheme.starSpeed - this.bgTheme.starSpeed) * 0.01 * timeScale;

    this.levelTimer += deltaTime;
    if (this.levelTimer > 20000) {
      this.level++;
      this.levelTimer = 0;
      this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 150);
      
      this.player.levelUp(this.level);
      this.opts.onLevelUpdate(this.level);
      this.updateThemeForLevel();
      
      if (this.level % 5 === 0) {
        this.enemies.push(new Enemy(this.canvas.width / 2, -100, 3, this.level));
      }
    }
    
    this.timePlayed += deltaTime;
    if (this.timePlayed % 1000 < deltaTime) {
      this.opts.onTimeUpdate(Math.floor(this.timePlayed / 1000));
    }

    if (this.shakeTime > 0) {
      this.shakeTime -= deltaTime;
    }

    this.player.update(deltaTime);
    if (this.isPointerDown || true) {
      this.player.lastShotTime += deltaTime;
      if (this.player.lastShotTime >= this.player.fireRate) {
        this.player.lastShotTime = 0;
        this.playSound('shoot');
        const spd = this.player.bulletSpeed;
        if (this.player.weaponLevel === 1) {
          this.spawnBullet(this.player.x, this.player.y - 20, 0, -spd, '#22d3ee', false);
        } else if (this.player.weaponLevel === 2) {
          this.spawnBullet(this.player.x - 10, this.player.y - 20, 0, -spd, '#22d3ee', false);
          this.spawnBullet(this.player.x + 10, this.player.y - 20, 0, -spd, '#22d3ee', false);
        } else {
          this.spawnBullet(this.player.x, this.player.y - 20, 0, -spd, '#22d3ee', false);
          this.spawnBullet(this.player.x - 15, this.player.y - 15, -2, -spd + 1, '#22d3ee', false);
          this.spawnBullet(this.player.x + 15, this.player.y - 15, 2, -spd + 1, '#22d3ee', false);
        }
      }
    }

    this.player.x = Math.max(this.player.width/2, Math.min(this.canvas.width - this.player.width/2, this.player.x));
    this.player.y = Math.max(this.player.height/2, Math.min(this.canvas.height - this.player.height/2, this.player.y));

    this.enemySpawnTimer += deltaTime;
    if (this.enemySpawnTimer > this.enemySpawnRate) {
      this.enemySpawnTimer = 0;
      const x = Math.random() * (this.canvas.width - 60) + 30;
      let type = 0;
      if (this.level > 2 && Math.random() > 0.6) type = 1;
      if (this.level > 4 && Math.random() > 0.8) type = 2;
      
      this.enemies.push(new Enemy(x, -50, type, this.level));
    }

    this.stars.forEach(s => s.update(this.canvas.height, timeScale, this.bgTheme.starSpeed));

    this.bullets.forEach(b => {
      if (b.active) b.update(timeScale);
      if (b.y < -50 || b.y > this.canvas.height + 50) b.active = false;
    });

    this.powerups.forEach(p => p.update(timeScale));
    this.powerups = this.powerups.filter(p => p.y < this.canvas.height + 50 && p.active);

    this.particles.forEach(p => { if(p.alpha > 0) p.update(timeScale); });

    this.enemies.forEach(e => {
      if (!e.active) return;
      e.update(deltaTime, this.canvas.width, timeScale);
      if (e.fireRate > 0) {
        e.lastShotTime += deltaTime;
        if (e.lastShotTime >= e.fireRate) {
          e.lastShotTime = 0;
          this.playSound('shoot');
          
          if (e.type === 3) {
            for(let i = -2; i <= 2; i++) {
              const angle = Math.atan2(this.player.y - e.y, this.player.x - e.x) + (i * 0.2);
              const speed = 4;
              this.spawnBullet(
                e.x, e.y, 
                Math.cos(angle) * speed, Math.sin(angle) * speed, 
                '#ef4444', true, 8
              );
            }
          } else if (e.type === 2) {
            const speed = 4;
            this.spawnBullet(e.x - 15, e.y + e.radius/2, 0, speed, '#a855f7', true, 7);
            this.spawnBullet(e.x + 15, e.y + e.radius/2, 0, speed, '#a855f7', true, 7);
          } else {
            const angle = Math.atan2(this.player.y - e.y, this.player.x - e.x);
            const speed = 5;
            this.spawnBullet(
              e.x, e.y + e.radius/2, 
              Math.cos(angle) * speed, Math.sin(angle) * speed, 
              '#eab308', true, 5
            );
          }
        }
      }
    });

    this.enemies = this.enemies.filter(e => e.y < this.canvas.height + 100 && e.active);

    this.blackHoles.forEach(bh => {
      if (!bh.active) return;
      bh.update(deltaTime);
      
      this.enemies.forEach(e => {
        if (!e.active) return;
        const dx = bh.x - e.x;
        const dy = bh.y - e.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < bh.radius) {
           e.x += (dx / dist) * bh.power * timeScale * 10;
           e.y += (dy / dist) * bh.power * timeScale * 10;
           
           e.x += (dy / dist) * bh.power * timeScale * 5;
           e.y -= (dx / dist) * bh.power * timeScale * 5;
           
           if (dist < 30) {
              e.active = false;
              this.playSound('explosion');
              this.createExplosion(e.x, e.y, e.color, 30);
              this.shake(8, 200);
              this.score += e.type === 3 ? 500 : e.type === 2 ? 50 : e.type === 1 ? 20 : 10;
              this.opts.onScoreUpdate(this.score);
              if (Math.random() > 0.8) {
                const types = ['shield', 'weapon', 'heal'];
                this.powerups.push(new PowerUp(e.x, e.y, types[Math.floor(Math.random() * types.length)]));
              }
           }
        }
      });
    });
    this.blackHoles = this.blackHoles.filter(bh => bh.active);

    this.checkCollisions();
  }

  checkCollisions() {
    for (let b of this.bullets) {
      if (b.isEnemy || !b.active) continue;
      for (let e of this.enemies) {
        if (!e.active) continue;
        const dx = b.x - e.x;
        const dy = b.y - e.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < e.radius + b.radius) {
          b.active = false;
          e.hp -= 20; 
          e.hitFlashTime = 100;
          this.playSound('hit');
          
          this.createExplosion(b.x, b.y, '#22d3ee', 5);
          
          if (e.hp <= 0) {
            e.active = false;
            this.playSound('explosion');
            this.createExplosion(e.x, e.y, e.color, 30);
            this.shake(5, 200);
            this.score += e.type === 3 ? 500 : e.type === 2 ? 50 : e.type === 1 ? 20 : 10;
            this.opts.onScoreUpdate(this.score);
            
            if (Math.random() > 0.8) {
              const types = ['shield', 'weapon', 'heal'];
              this.powerups.push(new PowerUp(e.x, e.y, types[Math.floor(Math.random() * types.length)]));
            }
          }
          break; 
        }
      }
    }

    if (this.player.active) {
      for (let b of this.bullets) {
        if (!b.isEnemy || !b.active) continue;
        const dx = b.x - this.player.x;
        const dy = b.y - this.player.y;
        if (Math.abs(dx) < this.player.width/2 && Math.abs(dy) < this.player.height/2) {
          b.active = false;
          this.damagePlayer(15);
        }
      }
      
      for (let e of this.enemies) {
        if (!e.active) continue;
        const dx = e.x - this.player.x;
        const dy = e.y - this.player.y;
        if (Math.abs(dx) < this.player.width/2 + e.radius && Math.abs(dy) < this.player.height/2 + e.radius) {
          e.active = false;
          this.playSound('explosion');
          this.createExplosion(e.x, e.y, e.color, 30);
          this.damagePlayer(30);
        }
      }

      for (let p of this.powerups) {
        if (!p.active) continue;
        const dx = p.x - this.player.x;
        const dy = p.y - this.player.y;
        if (Math.abs(dx) < this.player.width/2 + p.radius && Math.abs(dy) < this.player.height/2 + p.radius) {
          p.active = false;
          this.collectPowerUp(p.type);
        }
      }
    }
  }

  damagePlayer(amount) {
    if (this.player.hitFlashTime > 0) return; 
    
    this.playSound('hit');
    this.createExplosion(this.player.x, this.player.y, '#ef4444', 20);
    this.shake(10, 300);
    this.player.hitFlashTime = 200;

    if (this.player.hasShield) {
      this.player.hasShield = false;
      return;
    }

    this.player.hp -= amount;
    this.opts.onHpUpdate(this.player.hp);
    
    if (this.player.weaponLevel > 1) this.player.weaponLevel--;
    
    if (this.player.hp <= 0) {
      this.player.active = false;
      this.opts.onGameOver();
    }
  }

  collectPowerUp(type) {
    this.playSound('powerup');
    if (type === 'heal') {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 30);
      this.opts.onHpUpdate(this.player.hp);
    } else if (type === 'shield') {
      this.player.hasShield = true;
    } else if (type === 'weapon') {
      this.player.weaponLevel = Math.min(3, this.player.weaponLevel + 1);
    }
    this.createExplosion(this.player.x, this.player.y, '#10b981', 15);
  }

  draw() {
    const { r, g, b } = this.bgTheme;
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    this.ctx.globalCompositeOperation = 'source-over';
    
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
       this.ctx.fillStyle = '#050505';
    } else {
       this.ctx.fillStyle = `rgb(${Math.max(0, Math.round(r))}, ${Math.max(0, Math.round(g))}, ${Math.max(0, Math.round(b))})`;
    }
    this.ctx.fillRect(0, 0, w, h);

    this.ctx.save();
    if (this.shakeTime > 0) {
      const dx = (Math.random() - 0.5) * this.shakeMagnitude;
      const dy = (Math.random() - 0.5) * this.shakeMagnitude;
      this.ctx.translate(dx, dy);
    }

    this.ctx.globalCompositeOperation = 'lighter';
    
    this.stars.forEach(s => s.draw(this.ctx));
    this.powerups.forEach(p => p.draw(this.ctx));
    this.blackHoles.forEach(bh => { if (bh.active) bh.draw(this.ctx); });
    this.bullets.forEach(b => { if (b.active) b.draw(this.ctx); });
    this.enemies.forEach(e => { if (e.active) e.draw(this.ctx); });
    this.particles.forEach(p => { if (p.alpha > 0) p.draw(this.ctx); });
    this.player.draw(this.ctx);

    this.ctx.restore();
  }
  
  useBlackHole(level = 1) {
    if (!this.player.active) return;
    
    this.playSound('explosion'); 
    this.shake(5, 500);
    const targetY = Math.max(100, this.player.y - 300);
    this.blackHoles.push(new BlackHole(this.player.x, targetY, level));
  }

  loop(timestamp) {
    if (!this.running) return;

    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(Math.min(deltaTime, 50));
    this.draw();

    this.animFrameId = requestAnimationFrame((t) => this.loop(t));
  }
}
