/**
 * Performance Monitor Utility
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            memoryUsage: 0,
            loadTime: 0,
            renderTime: 0
        };
        
        this.fpsHistory = [];
        this.isMonitoring = false;
        
        this.init();
    }
    
    init() {
        this.detectDeviceCapabilities();
        this.optimizeForDevice();
        this.startMonitoring();
        this.setupMemoryMonitoring();
        this.handleBatteryStatus();
    }
    
    detectDeviceCapabilities() {
        const capabilities = {
            cores: navigator.hardwareConcurrency || 1,
            memory: navigator.deviceMemory || 1,
            connection: this.getConnectionInfo(),
            isMobile: this.isMobileDevice(),
            isLowEnd: this.isLowEndDevice()
        };
        
        this.deviceCapabilities = capabilities;
        console.log('🔧 Device Capabilities:', capabilities);
        
        return capabilities;
    }
    
    getConnectionInfo() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }
        return null;
    }
    
    isMobileDevice() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    isLowEndDevice() {
        const cores = navigator.hardwareConcurrency || 1;
        const memory = navigator.deviceMemory || 1;
        
        return cores < 4 || memory < 4 || this.isMobileDevice();
    }
    
    optimizeForDevice() {
        const { isLowEnd, isMobile } = this.deviceCapabilities;
        
        if (isLowEnd) {
            this.applyLowEndOptimizations();
        }
        
        if (isMobile) {
            this.applyMobileOptimizations();
        }
        
        // Apply connection-based optimizations
        const connection = this.deviceCapabilities.connection;
        if (connection && (connection.saveData || connection.effectiveType === 'slow-2g')) {
            this.applyDataSaverOptimizations();
        }
    }
    
    applyLowEndOptimizations() {
        console.log('🔧 Applying low-end device optimizations...');
        
        // Reduce animation complexity
        document.documentElement.style.setProperty('--transition-normal', '0.15s ease');
        document.documentElement.style.setProperty('--transition-slow', '0.25s ease');
        
        // Disable some visual effects
        document.body.classList.add('performance-mode');
        
        // Reduce particle count
        const particleCanvas = document.getElementById('particleCanvas');
        if (particleCanvas) {
            particleCanvas.style.display = 'none';
        }
        
        // Simplify floating elements
        this.simplifyAnimations();
    }
    
    applyMobileOptimizations() {
        console.log('📱 Applying mobile optimizations...');
        
        // Optimize touch interactions
        document.body.style.touchAction = 'manipulation';
        
        // Reduce shadow complexity
        document.documentElement.style.setProperty('--shadow-lg', 'var(--shadow-md)');
        document.documentElement.style.setProperty('--shadow-xl', 'var(--shadow-lg)');
        
        // Optimize images loading
        this.optimizeImageLoading();
    }
    
    applyDataSaverOptimizations() {
        console.log('💾 Applying data saver optimizations...');
        
        // Disable autoplay videos
        document.querySelectorAll('video[autoplay]').forEach(video => {
            video.removeAttribute('autoplay');
        });
        
        // Lazy load all images
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
        
        // Reduce background image quality
        document.body.classList.add('data-saver-mode');
    }
    
    simplifyAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .performance-mode * {
                animation-duration: 0.2s !important;
                transition-duration: 0.2s !important;
            }
            .performance-mode .floating-element {
                display: none !important;
            }
            .performance-mode .hero-background::before {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    optimizeImageLoading() {
        // Intersection Observer for lazy loading
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    startMonitoring() {
        this.isMonitoring = true;
        this.monitorFPS();
        
        // Log performance metrics every 10 seconds in development
        if (window.location.hostname === 'localhost') {
            setInterval(() => {
                console.log('📊 Performance Metrics:', this.getMetrics());
            }, 10000);
        }
    }
    
    monitorFPS() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                this.metrics.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.fpsHistory.push(this.metrics.fps);
                
                // Keep only last 10 readings
                if (this.fpsHistory.length > 10) {
                    this.fpsHistory.shift();
                }
                
                // Apply optimizations based on FPS
                if (this.metrics.fps < 20) {
                    this.handleLowFPS();
                } else if (this.metrics.fps > 50) {
                    this.handleHighFPS();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            if (this.isMonitoring) {
                requestAnimationFrame(measureFPS);
            }
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    handleLowFPS() {
        if (!document.body.classList.contains('low-fps-mode')) {
            console.warn('⚠️ Low FPS detected, applying performance optimizations...');
            document.body.classList.add('low-fps-mode');
            this.applyLowEndOptimizations();
        }
    }
    
    handleHighFPS() {
        if (document.body.classList.contains('low-fps-mode') && this.getAverageFPS() > 45) {
            console.log('✅ FPS improved, removing performance restrictions...');
            document.body.classList.remove('low-fps-mode');
        }
    }
    
            // Public method to get performance recommendations
    getRecommendations() {
        const recommendations = [];
        
        if (this.metrics.fps < 30) {
            recommendations.push('Consider reducing visual effects for better performance');
        }
        
        if (this.metrics.memoryUsage > 150) {
            recommendations.push('High memory usage detected, consider closing other tabs');
        }
        
        if (this.deviceCapabilities.connection?.effectiveType === 'slow-2g') {
            recommendations.push('Slow connection detected, enable data saver mode');
        }
        
        if (this.deviceCapabilities.isLowEnd) {
            recommendations.push('Device optimization mode is recommended');
        }
        
        return recommendations;
    }
    
    // Method to manually trigger optimizations
    optimizeNow() {
        console.log('🚀 Manual optimization triggered...');
        
        this.applyLowEndOptimizations();
        this.applyMemoryOptimizations();
        this.clearUnusedImages();
        
        // Force garbage collection if available (Chrome DevTools)
        if (window.gc) {
            window.gc();
        }
        
        return this.getMetrics();
    }
    
    // Stop monitoring (cleanup)
    stopMonitoring() {
        this.isMonitoring = false;
        console.log('📊 Performance monitoring stopped');
    }
}
