(function() {
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('playBtn');
    const replayBtn = document.getElementById('replayBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const notes = document.getElementById('notes');
    const finalMessage = document.getElementById('finalMessage');

    let isPlaying = false;
    let hasStarted = false;

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
                playBtn.textContent = '❚❚ Пауза';
                playBtn.classList.add('playing');
                progressContainer.classList.add('visible');
                notes.classList.add('active');
            }).catch(err => {
                console.log('Ошибка воспроизведения:', err);
                playBtn.textContent = '▶ Послушать';
            });
        }
    }

    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        playBtn.textContent = '▶ Продолжить';
        playBtn.classList.remove('playing');
        notes.classList.remove('active');
    }

    function handlePlayClick(e) {
        e.preventDefault();
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
        e.preventDefault();
        e.stopPropagation();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    audio.addEventListener('timeupdate', updateProgress);
    
    audio.addEventListener('ended', () => {
        isPlaying = false;
        playBtn.textContent = '▶ Послушать';
        playBtn.classList.remove('playing');
        notes.classList.remove('active');
        finalMessage.classList.add('show');
        replayBtn.classList.add('visible');
        hasStarted = false;
    });

    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    playBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        handlePlayClick(e);
    }, {passive: false});

    playBtn.addEventListener('click', handlePlayClick);

    replayBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        handleReplayClick(e);
    }, {passive: false});

    replayBtn.addEventListener('click', handleReplayClick);

    document.body.addEventListener('touchstart', function initAudio() {
        audio.load();
        document.body.removeEventListener('touchstart', initAudio);
    }, {once: true});

    playBtn.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, {passive: false});

    replayBtn.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, {passive: false});

})();
