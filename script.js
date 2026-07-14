(function() {
    const slides = document.querySelectorAll('.slide');
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('playBtn');
    const replayBtn = document.getElementById('replayBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');

    let currentSlide = 0;
    let isPlaying = false;
    let hasStarted = false;
    let touchStartY = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    }

    function resetSlides() {
        showSlide(0);
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    function updateProgress() {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = percent + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
            durationEl.textContent = formatTime(audio.duration);
        }
    }

    function playAudio() {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                hasStarted = true;
                playBtn.querySelector('.btn-text').textContent = 'Пауза';
                playBtn.classList.add('playing');
                progressContainer.classList.add('visible');
            }).catch(err => {
                console.log('Play error:', err);
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
        if (!hasStarted) {
            audio.load();
            playAudio();
        } else if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }

    function handleReplayClick(e) {
        e.stopPropagation();
        resetSlides();
    }

    // Swipe
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, {passive: true});

    document.addEventListener('touchend', function(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }, {passive: true});

    // Wheel
    let wheelTimeout;
    document.addEventListener('wheel', function(e) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }, 50);
    }, {passive: true});

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
    audio.addEventListener('ended', () => {
        isPlaying = false;
        playBtn.querySelector('.btn-text').textContent = 'Послушать';
        playBtn.classList.remove('playing');
        hasStarted = false;
    });
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    // Buttons
    playBtn.addEventListener('click', handlePlayClick);
    replayBtn.addEventListener('click', handleReplayClick);

    // iOS init
    document.body.addEventListener('touchstart', function initAudio() {
        audio.load();
        document.body.removeEventListener('touchstart', initAudio);
    }, {once: true});

    // Start
    showSlide(0);

})();
