(function() {
    'use strict';

    var container = document.getElementById('slidesContainer');
    var slides = document.querySelectorAll('.slide');
    var progressBar = document.getElementById('progressBar');
    var playBtn = document.getElementById('playBtn');
    var inlineReplayBtn = document.getElementById('inlineReplayBtn');
    var audioError = document.getElementById('audioError');

    var totalSlides = slides.length;
    var currentSlide = 0;
    var isAnimating = false;
    var touchStartY = 0;
    var touchEndY = 0;
    var slideHeight = 0;

    var audioCtx = null;
    var audioBuffer = null;
    var currentSource = null;
    var isPlaying = false;

    var audioIndicator = document.createElement('div');
    audioIndicator.className = 'audio-indicator';
    audioIndicator.innerHTML = '<span></span><span></span><span></span><span></span>';
    document.querySelector('.viewport').appendChild(audioIndicator);

    var scrollHint = document.createElement('div');
    scrollHint.className = 'scroll-hint';
    document.querySelector('.viewport').appendChild(scrollHint);

    function updateSlideHeight() {
        slideHeight = window.innerHeight;
    }
    updateSlideHeight();
    window.addEventListener('resize', updateSlideHeight);

    function showLines(slide, delay) {
        delay = delay || 0;
        var lines = slide.querySelectorAll('.line, .play-btn, .inline-btn');
        lines.forEach(function(line, index) {
            setTimeout(function() {
                line.classList.add('visible');
            }, delay + (index * 180));
        });
    }

    function hideAllLines() {
        document.querySelectorAll('.line, .play-btn, .inline-btn').forEach(function(el) {
            el.classList.remove('visible');
        });
    }

    function updateProgress() {
        var progress = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = progress + '%';
    }

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
        if (Math.abs(diff) > 50) {
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

    // ===== WEB AUDIO API =====

    function initAudioContext() {
        if (audioCtx) return true;
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            console.log('Web Audio API not supported');
            return false;
        }
        audioCtx = new AudioContext();
        return true;
    }

    function loadAudio() {
        if (audioBuffer) {
            return Promise.resolve(audioBuffer);
        }
        
        return fetch('./audio/song.mp3')
            .then(function(response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.arrayBuffer();
            })
            .then(function(arrayBuffer) {
                if (!audioCtx) initAudioContext();
                return audioCtx.decodeAudioData(arrayBuffer);
            })
            .then(function(decodedBuffer) {
                audioBuffer = decodedBuffer;
                if (audioError) audioError.style.display = 'none';
                return audioBuffer;
            })
            .catch(function(error) {
                console.log('Audio load failed:', error.message);
                if (audioError) {
                    audioError.textContent = 'Ошибка загрузки: ' + error.message;
                    audioError.style.display = 'block';
                }
                throw error;
            });
    }

    function playAudio() {
        if (!audioCtx) {
            return;
        }
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (currentSource) {
            try { currentSource.stop(); } catch(e) {}
            currentSource = null;
        }

        currentSource = audioCtx.createBufferSource();
        currentSource.buffer = audioBuffer;
        currentSource.loop = true;
        currentSource.connect(audioCtx.destination);
        
        currentSource.start(0);
        isPlaying = true;
        audioIndicator.classList.add('active');
    }

    function restartAudio() {
        if (audioBuffer) {
            playAudio();
        } else {
            loadAudio().then(function() {
                playAudio();
            }).catch(function() {});
        }
    }

    // Preload on first interaction
    var preloaded = false;
    function preloadOnce() {
        if (preloaded) return;
        preloaded = true;
        initAudioContext();
        loadAudio().catch(function() {});
    }
    document.addEventListener('touchstart', preloadOnce, { passive: true, once: true });
    document.addEventListener('click', preloadOnce, { once: true });

    // Play button
    playBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        if (audioBuffer) {
            playAudio();
            nextSlide();
        } else {
            loadAudio().then(function() {
                playAudio();
                nextSlide();
            }).catch(function() {
                nextSlide();
            });
        }
    });

    // Replay button
    inlineReplayBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        restartAudio();

        hideAllLines();
        currentSlide = 0;
        container.style.transform = 'translateY(0px)';
        updateProgress();

        setTimeout(function() {
            var firstSlide = slides[0];
            firstSlide.querySelector('.slide-content').classList.add('visible');
            showLines(firstSlide, 300);
            isAnimating = false;
        }, 600);
    });

    // Prevent pull-to-refresh
    document.body.addEventListener('touchmove', function(e) {
        if (e.target === document.body || e.target === container) {
            e.preventDefault();
        }
    }, { passive: false });

    // Init
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
