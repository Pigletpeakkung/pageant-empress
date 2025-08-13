/**
 * Animated Counters Component
 */
class AnimatedCounters {
    constructor() {
        this.counters = document.querySelectorAll('[data-target]');
        this.animated = new Set();
        
        if (this.counters.length) {
            this.init();
        }
    }
    
    init() {
        this.setupObserver();
    }
    
    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = parseInt(element.dataset.duration) || 2000;
        const start = performance.now();
        const startValue = 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (target - startValue) * easeOut);
            
            element.textContent = this.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = this.formatNumber(target);
                this.addCompletionEffect(element);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }
    
    addCompletionEffect(element) {
        element.style.transform = 'scale(1.1)';
        element.style.color = '#d4af37';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 200);
        
        // Add sparkle effect
        this.createSparkles(element);
    }
    
    createSparkles(element) {
        const sparkleCount = 3;
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'counter-sparkle';
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'fixed';
            sparkle.style.left = rect.left + Math.random() * rect.width + 'px';
            sparkle.style.top = rect.top + Math.random() * rect.height + 'px';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.fontSize = '12px';
            sparkle.style.animation = 'sparkleFloat 1s ease-out forwards';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1000);
        }
    }
}
