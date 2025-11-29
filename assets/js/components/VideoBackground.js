/* ============================================
   VIDEO BACKGROUND COMPONENT
   ============================================ */

export class VideoBackground {
  constructor(videoElement) {
    this.video = videoElement;
    this.heroSection = document.getElementById('inicio');
    this.fadeInterval = null;
    this.isFading = false;

    if (this.video) {
      this.init();
    }
  }

  init() {
    this.optimizeVideo();
    this.setupFadeLoop();
    this.setupEventListeners();
    this.optimizeForMobile();
  }

  optimizeVideo() {
    const optimizePlayback = () => {
      this.video.load();
      this.video.defaultMuted = true;
      this.video.muted = true;
      this.video.playsInline = true;

      // Reduce quality for mobile
      if (window.innerWidth <= 768) {
        this.video.style.filter = 'brightness(0.6) contrast(1.1) saturate(1.1) blur(2px)';
      }

      this.playVideo();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizePlayback);
    } else {
      optimizePlayback();
    }
  }

  playVideo() {
    const attemptPlay = () => {
      const playPromise = this.video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video background playing smoothly');
            this.video.setAttribute('data-loaded', 'true');
          })
          .catch(error => {
            console.log('Video autoplay prevented:', error);
            this.setupVideoFallback();
          });
      }
    };

    if (this.video.readyState >= 3) {
      attemptPlay();
    } else {
      this.video.addEventListener('canplaythrough', attemptPlay, { once: true });
    }
  }

  setupVideoFallback() {
    const playOnInteraction = () => {
      this.video.play();
      document.removeEventListener('click', playOnInteraction);
      document.removeEventListener('touchstart', playOnInteraction);
      document.removeEventListener('scroll', playOnInteraction);
    };

    document.addEventListener('click', playOnInteraction, { once: true });
    document.addEventListener('touchstart', playOnInteraction, { once: true });
    document.addEventListener('scroll', playOnInteraction, { once: true });
  }

  setupFadeLoop() {
    const fadeDuration = 400;
    const crossfadeThreshold = 0.5;
    let hasTriggeredFade = false;

    const startCrossfade = () => {
      if (this.isFading) return;
      this.isFading = true;

      let opacity = 1;
      const fadeStep = 0.05;
      const stepTime = fadeDuration / (1 / fadeStep);
      let hasRestarted = false;

      if (this.fadeInterval) clearInterval(this.fadeInterval);

      this.fadeInterval = setInterval(() => {
        opacity -= fadeStep;

        if (!hasRestarted && opacity <= crossfadeThreshold) {
          hasRestarted = true;
          this.video.currentTime = 0;

          let newOpacity = crossfadeThreshold;
          if (this.fadeInterval) clearInterval(this.fadeInterval);

          this.fadeInterval = setInterval(() => {
            newOpacity += fadeStep;
            if (newOpacity >= 1) {
              newOpacity = 1;
              clearInterval(this.fadeInterval);
              this.video.style.opacity = '1';
              this.isFading = false;
              hasTriggeredFade = false;
            } else {
              this.video.style.opacity = newOpacity.toString();
            }
          }, stepTime);
        } else if (!hasRestarted) {
          this.video.style.opacity = opacity.toString();
        }
      }, stepTime);
    };

    this.video.addEventListener('timeupdate', () => {
      if (this.isFading || hasTriggeredFade) return;

      const duration = this.video.duration;
      const currentTime = this.video.currentTime;
      const timeRemaining = duration - currentTime;

      if (timeRemaining <= (fadeDuration / 1000) && timeRemaining > 0) {
        hasTriggeredFade = true;
        startCrossfade();
      }
    });

    this.video.addEventListener('ended', () => {
      if (!this.isFading) {
        this.video.currentTime = 0;
        this.video.style.opacity = '1';
        this.video.play();
        hasTriggeredFade = false;
      }
    });

    this.video.style.opacity = '1';
    this.video.style.transition = 'none';
  }

  setupEventListeners() {
    // Prevent unwanted pauses
    this.video.addEventListener('pause', () => {
      if (!document.hidden) {
        this.video.play();
      }
    });

    // Resume when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.video.paused) {
        this.video.play();
      }
    });

    // Scroll optimization
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (this.video.paused && !document.hidden) {
          this.video.play();
        }
      }, 100);
    });

    // Error recovery
    window.addEventListener('error', (e) => {
      if (e.target && e.target.tagName === 'VIDEO') {
        console.warn('Video error detected, attempting recovery...');
        setTimeout(() => {
          this.video.load();
        }, 1000);
      }
    }, true);
  }

  optimizeForMobile() {
    if (window.innerWidth <= 768) {
      this.video.style.transform = 'translate(-50%, -50%)';
      this.video.style.opacity = '1';
    }
  }
}
