/**
 * Hero Section Component
 */
class HeroSection {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.particles = [];
        this.animationId = null;
        
        if (this.canvas) {
            this.init();
        }
    }
    
    init() {
        this.setupCanvas();
        this.createParticles();
        this.animate();
        this.setupFloatingElements();
        
        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupCanvas() {
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }
    
    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    setupFloatingElements() {
        const floatingContainer = document.querySelector('.floating-elements');
        if (!floatingContainer) return;
        
        const elements = ['👑', '💎', '✨', '🏆', '🌟'];
        
        elements.forEach((emoji, index) => {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.textContent = emoji;
            element.style.left = Math.random() * 100 + '%';
            element.style.top = Math.random() * 100 + '%';
            element.style.animationDelay = index * 0.5 + 's';
            element.style.animation = `floatRandom 6s ease-in-out infinite`;
            
            floatingContainer.appendChild(element);
        });
    }
    
    handleResize() {
        this.resizeCanvas();
        
        // Recreate particles for new canvas size
        this.particles = [];
        this.createParticles();
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around edges
        if (this.x > this.canvasWidth) this.x = 0;
        if (this.x < 0) this.x = this.canvasWidth;
        if (this.y > this.canvasHeight) this.y = 0;
        if (this.y < 0) this.y = this.canvasHeight;
        
        // Pulse opacity
        this.opacity += Math.sin(Date.now() * 0.001) * 0.01;
        this.opacity = Math.max(0.1, Math.min(0.7, this.opacity));
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
