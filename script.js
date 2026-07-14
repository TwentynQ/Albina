(function() {
    var slides = document.querySelectorAll('.slide');
    var audio = document.getElementById('audio');
    var playBtn = document.getElementById('playBtn');
    var replayBtn = document.getElementById('replayBtn');
    var progressContainer = document.getElementById('progressContainer');
    var progressFill = document.getElementById('progressFill');
    var currentTimeEl = document.getElementById('currentTime');
    var durationEl = document.getElementById('duration');

    var currentSlide = 0;
    var isPlaying = false;
    var touchStartY = 0;
    var audioReady = false;

    // Fullscreen API
    function enterFullscreen() {
        var elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }

    function showSlide(index) {
        slides.forEach(function(slide, i) {
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
        e.preventDefault();
        e.stopPropagation();
        initAudio();
        if (audio.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    }

    function handleReplayClick(e) {
        e.preventDefault();
        e.stopPropagation();
        resetSlides();
    }

    // Try enter fullscreen on first interaction
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        initAudio();
        enterFullscreen();
    }, {passive: true});

    document.addEventListener('touchend', function(e) {
        var diff = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
        }
    }, {passive: true});

    var wheelTimeout;
    document.addEventListener('wheel', function(e) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(function() {
            e.deltaY > 0 ? nextSlide() : prevSlide();
        }, 50);
    }, {passive: true});

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        }
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', function() {
        isPlaying = false;
        playBtn.querySelector('.btn-text').textContent = 'Послушать';
        playBtn.classList.remove('playing');
    });
    audio.addEventListener('loadedmetadata', function() {
        durationEl.textContent = formatTime(audio.duration);
    });

    playBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handlePlayClick(e);
    }, {passive: false});

    playBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handlePlayClick(e);
    });

    replayBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleReplayClick(e);
    }, {passive: false});

    replayBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleReplayClick(e);
    });

    document.body.addEventListener('touchstart', function firstTouch() {
        initAudio();
        document.body.removeEventListener('touchstart', firstTouch);
    }, {once: true});

    showSlide(0);

})();
