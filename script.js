(function() {
    var slides = document.querySelectorAll('.slide');
    var audio = document.getElementById('audio');
    var playBtn = document.getElementById('playBtn');
    var replayBtn = document.getElementById('replayBtn');
    var progressContainer = document.getElementById('progressContainer');
    var progressFill = document.getElementById('progressFill');
    var currentTimeEl = document.getElementById('currentTime');
    var durationEl = document.getElementById('duration');
    var container = document.querySelector('.slides-container');

    var currentSlide = 0;
    var isPlaying = false;
    var touchStartY = 0;
    var touchStartX = 0;
    var audioReady = false;
    var isAnimating = false;

    function showSlide(index) {
        if (index < 0 || index >= slides.length) return;
        slides.forEach(function(slide, i) {
            slide.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1 && !isAnimating) {
            isAnimating = true;
            showSlide(currentSlide + 1);
            setTimeout(function() { isAnimating = false; }, 800);
        }
    }

    function prevSlide() {
        if (currentSlide > 0 && !isAnimating) {
            isAnimating = true;
            showSlide(currentSlide - 1);
            setTimeout(function() { isAnimating = false; }, 800);
        }
    }

    function resetSlides() {
        showSlide(0);
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        var mins = Math.floor(seconds / 60);
        var secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    function updateProgress() {
        if (audio.duration) {
            var percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = percent + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
            durationEl.textContent = formatTime(audio.duration);
        }
    }

    function initAudio() {
        if (!audioReady) {
            audio.load();
            audioReady = true;
        }
    }

    function playAudio() {
        var playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(function() {
                isPlaying = true;
                playBtn.querySelector('.btn-text').textContent = 'Пауза';
                playBtn.classList.add('playing');
                progressContainer.classList.add('visible');
            }).catch(function(err) {
                console.log('Play failed:', err);
            });
        }
    }

    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        playBtn.querySelector('.btn-text').textContent = 'Продолжить';
        playBtn.classList.remove('playing');
    }

    function handlePlayClick(e) {
        e.stopPropagation();
        initAudio();
        if (audio.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    }

    function handleReplayClick(e) {
        e.stopPropagation();
        resetSlides();
    }

    // Swipe on container
    container.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        initAudio();
    }, {passive: true});

    container.addEventListener('touchend', function(e) {
        var touchEndY = e.changedTouches[0].clientY;
        var touchEndX = e.changedTouches[0].clientX;
        var diffY = touchStartY - touchEndY;
        var diffX = touchStartX - touchEndX;
        
        if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
            e.preventDefault();
            if (diffY > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }, {passive: false});

    // Wheel
    var wheelTimeout;
    container.addEventListener('wheel', function(e) {
        e.preventDefault();
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(function() {
            if (e.deltaY > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }, 100);
    }, {passive: false});

    // Keyboard
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        }
    });

    // Audio events
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', function() {
        isPlaying = false;
        playBtn.querySelector('.btn-text').textContent = 'Послушать';
        playBtn.classList.remove('playing');
    });
    audio.addEventListener('loadedmetadata', function() {
        durationEl.textContent = formatTime(audio.duration);
    });

    // Button events
    playBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        handlePlayClick(e);
    });

    replayBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        handleReplayClick(e);
    });

    // Start
    showSlide(0);

})();
