/**
 * ==========================================================================
 * EVP TRADE & CONVENTION CENTRE — VIP HOLOGRAPHIC RFID LOADER
 * 3D Pointer & Gyro Physics | Synthesized VIP Chime | Audio Autoplay Bridge
 * ==========================================================================
 */

(function (window, document) {
  'use strict';

  var EVPLoader = {
    options: {
      mode: 'standalone', // 'standalone' | 'tour'
      autoProgress: true,
      duration: 3200,     // Time for full asset telemetry check
      autoRemove: false,  // Remove from DOM on exit
      directToTour: true, // Navigate directly to Tour project on enter
      tourUrl: '../Tour/index.htm',
      onEnter: null       // Callback function({ audio: boolean })
    },

    state: {
      isReady: false,
      isDismissed: false,
      progress: 0,
      currentTiltX: 0,
      currentTiltY: 0,
      targetTiltX: 0,
      targetTiltY: 0,
      audioUnlocked: false,
      hasGyro: false
    },

    elements: {},
    rafId: null,
    audioCtx: null,

    /**
     * Initialize the loader
     */
    init: function (userOptions) {
      if (userOptions) {
        for (var key in userOptions) {
          if (userOptions.hasOwnProperty(key)) {
            this.options[key] = userOptions[key];
          }
        }
      }

      this.cacheElements();
      if (!this.elements.stage) {
        console.warn('[EVPLoader] Stage element not found in DOM.');
        return;
      }

      this.bindEvents();
      this.startPhysicsLoop();

      if (this.options.autoProgress) {
        this.runTelemetrySequence();
      }
    },

    /**
     * Cache DOM references
     */
    cacheElements: function () {
      this.elements.stage = document.getElementById('evp-loader-stage');
      this.elements.cardContainer = document.querySelector('.evp-card-container');
      this.elements.cardBody = document.querySelector('.evp-card-body');
      this.elements.sheen = document.querySelector('.evp-holographic-sheen');
      this.elements.progressBar = document.getElementById('evp-progress-bar');
      this.elements.telemetryText = document.getElementById('evp-telemetry-status');
      this.elements.enterBtn = document.getElementById('evp-enter-btn');
      this.elements.silentLink = document.getElementById('evp-silent-link');
      this.elements.hanger = document.querySelector('.evp-lanyard-hanger');
    },

    /**
     * Bind pointer, gyro, and click event listeners
     */
    bindEvents: function () {
      var self = this;

      // Desktop Pointer Tracking
      window.addEventListener('mousemove', function (e) {
        self.handleMouseMove(e);
      }, { passive: true });

      // Reset tilt on mouse leave
      window.addEventListener('mouseleave', function () {
        self.state.targetTiltX = 0;
        self.state.targetTiltY = 0;
      });

      // Mobile Device Orientation (Gyroscope)
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function (e) {
          self.handleDeviceOrientation(e);
        }, { passive: true });
      }

      // Enter With Audio (Primary Action)
      if (this.elements.enterBtn) {
        this.elements.enterBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          self.enterVenue(true);
        });
      }

      // Card Tap also triggers Enter once ready
      if (this.elements.cardContainer) {
        this.elements.cardContainer.addEventListener('click', function () {
          if (self.state.isReady && !self.state.isDismissed) {
            self.enterVenue(true);
          }
        });
      }

      // Explore in Silence (Secondary Action)
      if (this.elements.silentLink) {
        this.elements.silentLink.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          self.enterVenue(false);
        });
      }
    },

    /**
     * Handle mouse coordinates for 3D tilt
     */
    handleMouseMove: function (e) {
      if (this.state.isDismissed) return;

      var cx = window.innerWidth / 2;
      var cy = window.innerHeight / 2;
      var dx = (e.clientX - cx) / cx; // -1 to 1
      var dy = (e.clientY - cy) / cy; // -1 to 1

      // Max tilt: 14 degrees
      this.state.targetTiltY = dx * 14;
      this.state.targetTiltX = -dy * 12;

      // Calculate dynamic sheen reflection angle
      var angleDeg = Math.round(Math.atan2(dy, dx) * (180 / Math.PI) + 180);
      if (this.elements.cardBody) {
        this.elements.cardBody.style.setProperty('--sheen-angle', angleDeg + 'deg');
        var opacity = 0.45 + (Math.abs(dx) + Math.abs(dy)) * 0.25;
        this.elements.cardBody.style.setProperty('--sheen-opacity', Math.min(opacity, 0.95));
      }
    },

    /**
     * Handle mobile gyroscope orientation
     */
    handleDeviceOrientation: function (e) {
      if (this.state.isDismissed || !e.gamma) return;
      this.state.hasGyro = true;

      // Gamma: Left/Right tilt (-90 to 90). Clamped to [-30, 30]
      var gamma = Math.max(-30, Math.min(30, e.gamma));
      // Beta: Front/Back tilt (-180 to 180). Clamped around standard 50deg viewing angle
      var beta = Math.max(20, Math.min(80, e.beta || 50)) - 50;

      this.state.targetTiltY = (gamma / 30) * 14;
      this.state.targetTiltX = -(beta / 30) * 12;

      var angleDeg = Math.round((gamma + 30) * 3);
      if (this.elements.cardBody) {
        this.elements.cardBody.style.setProperty('--sheen-angle', angleDeg + 'deg');
        this.elements.cardBody.style.setProperty('--sheen-opacity', '0.75');
      }
    },

    /**
     * Spring-damping physics loop for ultra-smooth 60fps tilt
     */
    startPhysicsLoop: function () {
      var self = this;
      var lerp = function (start, end, factor) {
        return start + (end - start) * factor;
      };

      var loop = function () {
        if (!self.state.isDismissed) {
          // Smooth inertia easing factor: 0.09
          self.state.currentTiltX = lerp(self.state.currentTiltX, self.state.targetTiltX, 0.09);
          self.state.currentTiltY = lerp(self.state.currentTiltY, self.state.targetTiltY, 0.09);

          if (self.elements.cardContainer) {
            self.elements.cardContainer.style.transform = 
              'rotateX(' + self.state.currentTiltX.toFixed(2) + 'deg) ' +
              'rotateY(' + self.state.currentTiltY.toFixed(2) + 'deg)';
          }

          if (self.elements.hanger) {
            // Slight counter-sway on the lanyard hanger
            self.elements.hanger.style.transform = 
              'rotateZ(' + (-self.state.currentTiltY * 0.15).toFixed(2) + 'deg)';
          }
        }
        self.rafId = requestAnimationFrame(loop);
      };

      this.rafId = requestAnimationFrame(loop);
    },

    /**
     * Telemetry sequence (simulates venue calibration & decrypt)
     */
    runTelemetrySequence: function () {
      var self = this;
      var steps = [
        { progress: 25, delay: 400, text: '<i class="fi fi-rr-eye"></i> Calibrating 24 Campus Perspectives...' },
        { progress: 55, delay: 1200, text: '<i class="fi fi-rr-volume"></i> Synchronizing Spatial Acoustic Engine...' },
        { progress: 85, delay: 2000, text: '<i class="fi fi-rr-key"></i> Verifying VIP All-Access Security Token...' },
        { progress: 100, delay: 2800, text: '<i class="fi fi-rr-shield-check"></i> VIP CLEARANCE VERIFIED • READY' }
      ];

      steps.forEach(function (step) {
        setTimeout(function () {
          self.setProgress(step.progress, step.text);
        }, step.delay);
      });

      setTimeout(function () {
        self.setReady();
      }, this.options.duration);
    },

    /**
     * Set progress manually or via sequence
     */
    setProgress: function (pct, text) {
      this.state.progress = pct;
      if (this.elements.progressBar) {
        this.elements.progressBar.style.width = pct + '%';
      }
      if (this.elements.telemetryText && text) {
        this.elements.telemetryText.innerHTML = text;
      }
    },

    /**
     * Mark loader as fully verified and unlock button
     */
    setReady: function () {
      this.state.isReady = true;
      if (this.elements.enterBtn) {
        this.elements.enterBtn.innerHTML = '<i class="fi fi-rr-sparkles"></i> TAP PASS TO ENTER VENUE';
        this.elements.enterBtn.classList.add('ready-pulse');
      }
    },

    /**
     * Synthesize high-end VIP Crystal Access Chime via Web Audio API
     * (Zero external MP3 dependencies, works 100% offline and instant)
     */
    playVipChime: function () {
      try {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        if (!this.audioCtx) {
          this.audioCtx = new AudioContext();
        }

        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        var ctx = this.audioCtx;
        var now = ctx.currentTime;

        // Harmonic frequencies: E6 (1318.5Hz) & B6 (1975.5Hz) crystal bell
        var freqs = [1318.5, 1975.5, 2637.0];
        freqs.forEach(function (freq, index) {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + (index * 0.04));

          // Soft exponential decay
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(0.12 / (index + 1), now + (index * 0.04) + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.00001, now + (index * 0.04) + 1.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + (index * 0.04));
          osc.stop(now + (index * 0.04) + 1.5);
        });

        this.state.audioUnlocked = true;
      } catch (err) {
        console.warn('[EVPLoader] Audio synthesis failed:', err);
      }
    },

    /**
     * Unlock and enter the venue (Direct to Tour project)
     */
    enterVenue: function (withAudio) {
      var self = this;
      if (this.state.isDismissed) return;
      this.state.isDismissed = true;

      // Unlock AudioContext via the physical touch/click gesture
      if (withAudio) {
        this.playVipChime();
      }

      // Store audio preference in sessionStorage for Tour audio continuity
      try {
        sessionStorage.setItem('evp_audio_consent', withAudio ? 'yes' : 'no');
      } catch (err) {}

      // Add dismissal transition
      if (this.elements.stage) {
        this.elements.stage.classList.add('evp-loader-dismissed');
      }

      // Invoke external hook if provided
      if (typeof this.options.onEnter === 'function') {
        try {
          this.options.onEnter({ audio: withAudio });
        } catch (e) {
          console.error('[EVPLoader] Error in onEnter callback:', e);
        }
      }

      // Direct handoff to Tour project if enabled
      if (this.options.directToTour) {
        setTimeout(function () {
          var target = self.options.tourUrl + (withAudio ? '?audio=1' : '?audio=0');
          window.location.href = target;
        }, 500);
        return;
      }

      // Cleanup
      setTimeout(function () {
        if (self.options.autoRemove && self.elements.stage) {
          self.elements.stage.remove();
        }
        if (self.rafId) {
          cancelAnimationFrame(self.rafId);
        }
      }, 900);
    },

    /**
     * Reset loader state (useful for sandbox preview testing)
     */
    reset: function () {
      this.state.isDismissed = false;
      this.state.isReady = false;
      this.state.progress = 0;
      this.state.currentTiltX = 0;
      this.state.currentTiltY = 0;
      this.state.targetTiltX = 0;
      this.state.targetTiltY = 0;

      if (this.elements.stage) {
        this.elements.stage.classList.remove('evp-loader-dismissed');
      }
      if (this.elements.enterBtn) {
        this.elements.enterBtn.innerHTML = '<i class="fi fi-rr-shield-check"></i> INITIALIZING CREDENTIALS...';
        this.elements.enterBtn.classList.remove('ready-pulse');
      }
      if (this.elements.progressBar) {
        this.elements.progressBar.style.width = '15%';
      }
      if (this.elements.telemetryText) {
        this.elements.telemetryText.innerHTML = '<i class="fi fi-rr-eye"></i> Calibrating 24 Campus Perspectives...';
      }

      this.startPhysicsLoop();
      this.runTelemetrySequence();
    }
  };

  window.EVPLoader = EVPLoader;

})(window, document);
