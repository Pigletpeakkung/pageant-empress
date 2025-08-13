/**
 * Pageant Empress - Main Application
 * Created by Thanattsitt S
 */

class PageantEmpressApp {
    constructor() {
        this.isLoading = true;
        this.components = {};
        this.utils = {};
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Pageant Empress...');
        
        // Initialize utilities
        this.utils.performance = new PerformanceMonitor();
        this.utils.analytics = new AnalyticsTracker();
        
        // Initialize components
        this.components.navigation = new Navigation();
        this.components.hero = new HeroSection();
        this.components.carousel = new FeaturedCarousel();
        this.components.counters = new AnimatedCounters();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load dynamic content
        await this.loadContent();
        
        // Initialize animations
        this.initializeAnimations();
        
        // Hide loading screen
        this.hideLoadingScreen();
        
        console.log('✅ Pageant Empress initialized successfully!');
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('load', () => this.onWindowLoad());
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('scroll', () => this.onWindowScroll());
        
        // Navigation events
        document.addEventListener('click', (e) => this.handleGlobalClick(e));
        
        // Form events
        document.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    async loadContent() {
        try {
            // Load news content
            const newsData = await this.fetchJSON('./data/news.json');
            this.renderNews(newsData);
            
            // Load video content
            const videosData = await this.fetchJSON('./data/videos.json');
            this.renderVideos(videosData);
            
            // Load gallery content
            const galleryData = await this.fetchJSON('./data/gallery.json');
            this.renderGallery(galleryData);
            
            // Load events content
            const eventsData = await this.fetchJSON('./data/events.json');
            this.renderEvents(eventsData);
            
            // Load carousel content
            const carouselData = await this.fetchJSON('./data/carousel.json');
            this.components.carousel.updateContent(carouselData);
            
        } catch (error) {
            console.error('❌ Error loading content:', error);
            this.showErrorNotification('Failed to load some content. Please refresh the page.');
        }
    }

    async fetchJSON(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return response.json();
    }

    renderNews(newsData) {
        const newsGrid = document.getElementById('newsGrid');
        if (!newsGrid || !newsData.articles) return;
        
        newsGrid.innerHTML = newsData.articles.map(article => `
            <article class="card fade-in-up">
                <img src="${article.image}" alt="${article.title}" class="card-image" loading="lazy">
                <div class="card-content">
                    <h3 class="card-title">${article.title}</h3>
                    <p class="card-text">${article.excerpt}</p>
                    <div class="card-meta">
                        <span>${article.date}</span>
                        <span>${article.category}</span>
                    </div>
                    <a href="${article.url}" class="btn btn-outline">Read More</a>
                </div>
            </article>
        `).join('');
    }

    renderVideos(videosData) {
        const videoGrid = document.getElementById('videoGrid');
        if (!videoGrid || !videosData.videos) return;
        
        videoGrid.innerHTML = videosData.videos.map(video => `
            <div class="card fade-in-up">
                <div class="video-thumbnail" data-video-id="${video.id}">
                    <img src="${video.thumbnail}" alt="${video.title}" class="card-image" loading="lazy">
                    <div class="video-play-btn">▶️</div>
                    <div class="video-duration">${video.duration}</div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${video.title}</h3>
                    <p class="card-text">${video.description}</p>
                    <div class="card-meta">
                        <span>${video.views} views</span>
                        <span>${video.date}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderGallery(galleryData) {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid || !galleryData.images) return;
        
        galleryGrid.innerHTML = galleryData.images.map(image => `
            <div class="gallery-item fade-in-up" data-category="${image.category}">
                <img src="${image.thumbnail}" alt="${image.title}" class="gallery-image" loading="lazy">
                <div class="gallery-overlay">
                    <h4 class="gallery-title">${image.title}</h4>
                    <p class="gallery-description">${image.description}</p>
                    <button class="gallery-view-btn" data-image="${image.full}">View Full</button>
                </div>
            </div>
        `).join('');
    }

    renderEvents(eventsData) {
        const eventsGrid = document.getElementById('eventsGrid');
        if (!eventsGrid || !eventsData.events) return;
        
        eventsGrid.innerHTML = eventsData.events.map(event => `
            <div class="card fade-in-up">
                <img src="${event.image}" alt="${event.title}" class="card-image" loading="lazy">
                <div class="card-content">
                    <div class="event-date">
                        <span class="event-day">${event.day}</span>
                        <span class="event-month">${event.month}</span>
                    </div>
                    <h3 class="card-title">${event.title}</h3>
                    <p class="card-text">${event.description}</p>
                    <div class="event-details">
                        <span class="event-location">📍 ${event.location}</span>
                        <span class="event-time">🕒 ${event.time}</span>
                    </div>
                    <a href="${event.url}" class="btn btn-primary">Get Details</a>
                </div>
            </div>
        `).join('');
    }

    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all elements with fade-in classes
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 2000);
    }

    onWindowLoad() {
        this.utils.analytics.trackEvent('page_load', {
            loadTime: performance.now()
        });
    }

    onWindowResize() {
        this.components.hero.handleResize();
        this.components.carousel.handleResize();
    }

    onWindowScroll() {
        this.components.navigation.handleScroll();
        this.updateScrollProgress();
    }

    updateScrollProgress() {
        const scrollProgress = document.getElementById('scrollProgress');
        if (!scrollProgress) return;
        
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.transform = `scaleX(${scrollPercent / 100})`;
    }

    handleGlobalClick(e) {
        // Handle smooth scrolling for anchor links
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                this.utils.analytics.trackEvent('navigation_click', {
                    target: targetId
                });
            }
        }
        
        // Handle video play buttons
        if (e.target.matches('.video-play-btn, .video-thumbnail')) {
            const videoId = e.target.closest('[data-video-id]').dataset.videoId;
            this.playVideo(videoId);
        }
        
        // Handle gallery view buttons
        if (e.target.matches('.gallery-view-btn')) {
            const imageUrl = e.target.dataset.image;
            this.openImageModal(imageUrl);
        }
    }

    handleFormSubmit(e) {
        if (e.target.matches('#newsletterForm')) {
            e.preventDefault();
            this.handleNewsletterSubmit(e.target);
        }
    }

    handleKeyDown(e) {
        // Handle escape key to close modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
        
        // Handle keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    this.openSearchModal();
                    break;
            }
        }
    }

    playVideo(videoId) {
        // Implementation for video modal
        console.log('Playing video:', videoId);
        this.utils.analytics.trackEvent('video_play', { videoId });
    }

    openImageModal(imageUrl) {
        // Implementation for image modal
        console.log('Opening image modal:', imageUrl);
        this.utils.analytics.trackEvent('image_view', { imageUrl });
    }

    openSearchModal() {
        // Implementation for search modal
        console.log('Opening search modal');
    }

    closeAllModals() {
        // Implementation to close all open modals
        console.log('Closing all modals');
    }

        handleNewsletterSubmit(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        // Basic email validation
        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span> Subscribing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.showNotification('🎉 Successfully subscribed to Pageant Empress newsletter!', 'success');
            form.reset();
            
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Track subscription
            this.utils.analytics.trackEvent('newsletter_subscribe', { email });
        }, 2000);
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('notification-exit');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('notification-exit');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    showErrorNotification(message) {
        this.showNotification(message, 'error');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PageantEmpressApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageantEmpressApp;
}
