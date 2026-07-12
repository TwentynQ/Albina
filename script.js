(function() {
    'use strict';

    var container = document.getElementById('slidesContainer');
    var slides = document.querySelectorAll('.slide');
    var progressBar = document.getElementById('progressBar');
    var playBtn = document.getElementById('playBtn');
    var inlineReplayBtn = document.getElementById('inlineReplayBtn');
    var audio = document.getElementById('bgAudio');

    var totalSlides = slides.length;
    var currentSlide = 0;
    var isAnimating = false;
    var touchStartY = 0;
    var touchEndY = 0;
    var musicStarted = false;
    var slideHeight = 0;

    // Create scroll hint
    var scrollHint = document.createElement('div');
    scrollHint.className = 'scroll-hint';
    document.querySelector('.viewport').appendChild(scrollHint);

    // Create audio indicator
    var audioIndicator = document.createElement('div');
    audioIndicator.className = 'audio-indicator';
    audioIndicator.innerHTML = '<span></span><span></span><span></span><span></span>';
    document.querySelector('.viewport').appendChild(audioIndicator);

    // Measure slide height
    function updateSlideHeight() {
        slideHeight = window.innerHeight;
    }
    updateSlideHeight();
    window.addEventListener('resize', updateSlideHeight);

    // Show lines with stagger
    function showLines(slide, delay) {
        delay = delay || 0;
        var lines = slide.querySelectorAll('.line, .play-btn, .inline-btn');
        lines.forEach(function(line, index) {
            setTimeout(function() {
                line.classList.add('visible');
            }, delay + (index * 180));
        });
    }

    // Hide all lines
    function hideAllLines() {
        document.querySelectorAll('.line, .play-btn, .inline-btn').forEach(function(el) {
            el.classList.remove('visible');
        });
    }

    // Update progress bar
    function updateProgress() {
        var progress = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = progress + '%';
    }

    // Go to slide — use px instead of vh for transform
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides || isAnimating) return;
        isAnimating = true;

        currentSlide = index;
        var offset = -(index * slideHeight);
        container.style.transform = 'translateY(' + offset + 'px)';

        updateProgress();
        hideAllLines();

        setTimeout(function() {
            var slide = slides[index];
            var content = slide.querySelector('.slide-content');
            content.classList.add('visible');
            showLines(slide, 300);
            isAnimating = false;
        }, 500);

        slides.forEach(function(slide, i) {
            if (i !== index) {
                slide.querySelector('.slide-content').classList.remove('visible');
            }
        });

        if (index > 0) {
            scrollHint.style.opacity = '0';
            scrollHint.style.transition = 'opacity 0.5s ease';
        }
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    function handleSwipe() {
        var diff = touchStartY - touchEndY;
        var threshold = 50;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    var wheelTimeout;
    document.addEventListener('wheel', function(e) {
        if (wheelTimeout) return;
        wheelTimeout = setTimeout(function() {
            wheelTimeout = null;
        }, 800);
        if (e.deltaY > 0) {
            nextSlide();
        } else if (e.deltaY < 0) {
            prevSlide();
        }
    }, { passive: true });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        }
    });

    // ===== AUDIO: iOS Safari compatible =====

    // Warm up audio context on first user interaction
    var audioContext = null;
    function warmUpAudio() {
        if (audioContext) return;
        try {
            var AC = window.AudioContext || window.webkitAudioContext;
            if (AC) {
                audioContext = new AC();
                // Create and play silent buffer to unlock
                var buffer = audioContext.createBuffer(1, 1, 22050);
                var source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                if (source.start) {
                    source.start(0);
                } else if (source.noteOn) {
                    source.noteOn(0);
                }
            }
        } catch (e) {
            // AudioContext not available
        }
    }

    // Play audio — must be called from user gesture
    function playAudio() {
        // iOS: need to warm up on first interaction
        warmUpAudio();

        // Reset and play
        audio.currentTime = 0;

        // For iOS: set muted false explicitly
        audio.muted = false;

        var promise = audio.play();
        if (promise !== undefined) {
            promise.then(function() {
                audioIndicator.classList.add('active');
            }).catch(function(err) {
                console.log('Audio play error:', err);
                // Try once more after a tick
                setTimeout(function() {
                    audio.play().then(function() {
                        audioIndicator.classList.add('active');
                    }).catch(function(err2) {
                        console.log('Audio retry failed:', err2);
                    });
                }, 50);
            });
        } else {
            audioIndicator.classList.add('active');
        }
    }

    // Play button click
    playBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!musicStarted) {
            musicStarted = true;
            playAudio();
        }
        nextSlide();
    });

    // Also warm up on any touch anywhere (before play button)
    var warmedUp = false;
    function warmUpOnce() {
        if (warmedUp) return;
        warmedUp = true;
        warmUpAudio();
        // Also try to load metadata
        audio.load();
    }
    document.addEventListener('touchstart', warmUpOnce, { passive: true, once: true });
    document.addEventListener('click', warmUpOnce, { once: true });

    // Inline replay button
    inlineReplayBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        // Reset and play audio
        audio.currentTime = 0;
        audio.muted = false;
        audio.play().catch(function() {});
        audioIndicator.classList.add('active');

        // Reset slides
        hideAllLines();
        currentSlide = 0;
        var offset = 0;
        container.style.transform = 'translateY(' + offset + 'px)';
        updateProgress();

        setTimeout(function() {
            var firstSlide = slides[0];
            firstSlide.querySelector('.slide-content').classList.add('visible');
            showLines(firstSlide, 300);
            isAnimating = false;
        }, 600);
    });

    // Prevent pull-to-refresh on iOS
    document.body.addEventListener('touchmove', function(e) {
        if (e.target === document.body || e.target === container) {
            e.preventDefault();
        }
    }, { passive: false });

    // Initialize
    function init() {
        updateSlideHeight();
        var firstSlide = slides[0];
        firstSlide.querySelector('.slide-content').classList.add('visible');
        showLines(firstSlide, 600);
        updateProgress();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
