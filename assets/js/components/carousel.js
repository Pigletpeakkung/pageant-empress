/**
 * Featured Carousel Component
 */
class FeaturedCarousel {
    constructor() {
        this.carousel = document.getElementById('featuredCarousel');
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('carouselPrev');
        this.nextBtn = document.getElementById('carouselNext');
        this.indicators = document.getElementById('carouselIndicators');
        
        this.currentSlide = 0;
        this.slides = [];
        this.autoPlayInterval = null;
        this.isAutoPlaying = true;
        
        if (this.carousel) {
            this.init();
        }
    }
    
    init() {
        this.setupEventListeners();
        this.setupTouchEvents();
        this.startAutoPlay();
    }
    
    updateContent(carouselData) {
        if (!carouselData.featured || !this.track) return;
        
        this.slides = carouselData.featured;
        this.renderSlides();
        this.renderIndicators();
        this.goToSlide(0);
    }
    
    renderSlides() {
        this.track.innerHTML = this.slides.map(slide => `
            <div class="carousel-slide">
                <div class="slide-image">
                    <img src="${slide.image}" alt="${slide.title}" loading="lazy">
                    <div class="slide-overlay"></div>
                </div>
                <div class="slide-content">
                    <div class="slide-category">${slide.category}</div>
                    <h3 class="slide-title">${slide.title}</h3>
                    <p class="slide-description">${slide.description}</p>
                    <div class="slide-meta">
                        <span class="slide-date">${slide.date}</span>
                        <span class="slide-views">${slide.views} views</span>
                    </div>
                    <a href="${slide.url}" class="slide-cta">Read More</a>
                </div>
            </div>
        `).join('');
    }
    
    renderIndicators() {
        this.indicators.innerHTML = this.slides.map((_, index) => `
            <button class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                    data-slide="${index}" 
                    aria-label="Go to slide ${index + 1}">
            </button>
        `).join('');
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Indicators
        this.indicators?.addEventListener('click', (e) => {
            if (e.target.matches('.carousel-indicator')) {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.goToSlide(slideIndex);
            }
        });
        
        // Pause on hover
        this.carousel?.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel?.addEventListener('mouseleave', () => this.resumeAutoPlay());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.carousel?.matches(':hover')) return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });
    }
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        this.carousel?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.pauseAutoPlay();
        }, { passive: true });
        
        this.carousel?.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            this.resumeAutoPlay();
        }, { passive: true });
    }
    
    goToSlide(index) {
        if (!this.track || !this.slides.length) return;
        
        this.currentSlide = index;
        
        // Update track position
        const slideWidth = 100;
        this.track.style.transform = `translateX(-${index * slideWidth}%)`;
        
        // Update indicators
        this.indicators?.querySelectorAll('.carousel-indicator').forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        // Update navigation buttons
        this.prevBtn?.classList.toggle('disabled', index === 0);
        this.nextBtn?.classList.toggle('disabled', index === this.slides.length - 1);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }
    
    startAutoPlay() {
        if (!this.isAutoPlaying) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resumeAutoPlay() {
        if (this.isAutoPlaying && !this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }
    
    handleResize() {
        // Recalculate slide positions if needed
        this.goToSlide(this.currentSlide);
    }
    
    destroy() {
        this.pauseAutoPlay();
    }
}
