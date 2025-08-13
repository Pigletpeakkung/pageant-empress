/**
 * Analytics Tracker Utility
 */
class AnalyticsTracker {
    constructor() {
        this.events = [];
        this.sessionStart = Date.now();
        this.pageViews = 0;
        
        this.init();
    }
    
    init() {
        this.trackPageView();
        this.setupEventTracking();
        this.setupPerformanceTracking();
        
        // Send data before page unload
        window.addEventListener('beforeunload', () => this.sendData());
    }
    
    trackEvent(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties: {
                ...properties,
                timestamp: Date.now(),
                url: window.location.href,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                sessionId: this.getSessionId()
            }
        };
        
        this.events.push(event);
        
        // Log to console in development
        if (window.location.hostname === 'localhost') {
            console.log('📊 Analytics Event:', event);
        }
        
        // Send to analytics service (replace with your actual service)
        this.sendEventToService(event);
    }
    
    trackPageView() {
        this.pageViews++;
        this.trackEvent('page_view', {
            pageTitle: document.title,
            pageViews: this.pageViews
        });
    }
    
    setupEventTracking() {
        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            // Track button clicks
            if (e.target.matches('button, .btn')) {
                this.trackEvent('button_click', {
                    buttonText: e.target.textContent?.trim() || '',
                    buttonClass: e.target.className
                });
            }
            
            // Track external links
            if (e.target.matches('a[href^="http"]')) {
                this.trackEvent('external_link_click', {
                    url: e.target.href,
                    text: e.target.textContent?.trim() || ''
                });
            }
            
            // Track social media clicks
            if (e.target.matches('.social-link')) {
                this.trackEvent('social_click', {
                    platform: this.getSocialPlatform(e.target.href),
                    url: e.target.href
                });
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackEvent('form_submit', {
                formId: e.target.id || '',
                formClass: e.target.className
            });
        });
        
        // Track scroll depth
        this.setupScrollTracking();
    }
    
    setupScrollTracking() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 100];
        const reached = new Set();
        
        const trackScroll = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            maxScroll = Math.max(maxScroll, scrollPercent);
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !reached.has(milestone)) {
                    reached.add(milestone);
                    this.trackEvent('scroll_milestone', {
                        milestone: milestone,
                        scrollPercent: scrollPercent
                    });
                }
            });
        };
        
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    trackScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    setupPerformanceTracking() {
        // Track page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.trackEvent('page_load_complete', {
                loadTime: Math.round(loadTime),
                domContentLoaded: this.getDOMLoadTime()
            });
        });
        
        // Track Core Web Vitals if supported
        if ('web-vital' in window) {
            this.trackWebVitals();
        }
    }
    
    trackWebVitals() {
        // This would integrate with web-vitals library
        // For now, we'll just track basic timing
        setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                this.trackEvent('web_vitals', {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    firstPaint: this.getFirstPaintTime(),
                    firstContentfulPaint: this.getFirstContentfulPaintTime()
                });
            }
        }, 1000);
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('pageant_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('pageant_session_id', sessionId);
        }
        return sessionId;
    }
    
    getSocialPlatform(url) {
        if (url.includes('youtube.com')) return 'YouTube';
        if (url.includes('instagram.com')) return 'Instagram';
        if (url.includes('tiktok.com')) return 'TikTok';
        if (url.includes('linkedin.com')) return 'LinkedIn';
        if (url.includes('twitter.com')) return 'Twitter';
        if (url.includes('facebook.com')) return 'Facebook';
        if (url.includes('mailto:')) return 'Email';
        return 'Unknown';
    }
    
    getDOMLoadTime() {
        const navigation = performance.getEntriesByType('navigation')[0];
        return navigation ? 
            navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0;
    }
    
    getFirstPaintTime() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : 0;
    }
    
    getFirstContentfulPaintTime() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
    }
    
    sendEventToService(event) {
        // Replace this with your actual analytics service
        // Examples: Google Analytics, Mixpanel, Amplitude, etc.
        
        // Google Analytics 4 example
        if (typeof gtag !== 'undefined') {
            gtag('event', event.name, event.properties);
        }
        
        // Custom analytics endpoint example
        if (window.ANALYTICS_ENDPOINT) {
            fetch(window.ANALYTICS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event)
            }).catch(err => console.warn('Analytics failed:', err));
        }
    }
    
    sendData() {
        const sessionData = {
            sessionId: this.getSessionId(),
            sessionDuration: Date.now() - this.sessionStart,
            eventCount: this.events.length,
            pageViews: this.pageViews,
            url: window.location.href,
            timestamp: Date.now()
        };
        
        // Use sendBeacon for reliable data sending on page unload
        if (navigator.sendBeacon && window.ANALYTICS_ENDPOINT) {
            navigator.sendBeacon(
                window.ANALYTICS_ENDPOINT + '/session',
                JSON.stringify(sessionData)
            );
        }
    }
    
    // Public method to get analytics summary
    getAnalyticsSummary() {
        return {
            sessionId: this.getSessionId(),
            sessionDuration: Date.now() - this.sessionStart,
            eventCount: this.events.length,
            pageViews: this.pageViews,
            lastEvents: this.events.slice(-10) // Last 10 events
        };
    }
}
