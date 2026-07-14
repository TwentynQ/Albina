* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

html, body {
    height: 100%;
    height: -webkit-fill-available;
    overflow: hidden;
    background: #000;
    color: #f5f0e8;
    font-family: 'Caveat', cursive;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
}

/* Fullscreen on iOS Safari */
body {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
}

.slides-container {
    height: 100%;
    height: -webkit-fill-available;
    position: relative;
}

.slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    height: -webkit-fill-available;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 30px;
    padding-top: max(60px, env(safe-area-inset-top));
    padding-bottom: max(60px, env(safe-area-inset-bottom));
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.8s ease;
    z-index: 1;
}

.slide.active {
    opacity: 1;
    pointer-events: auto;
    z-index: 2;
}

.content {
    text-align: center;
    max-width: 360px;
}

.text {
    font-size: clamp(1.8rem, 6vw, 2.4rem);
    line-height: 1.5;
    margin: 6px 0;
    opacity: 0;
    transform: translateY(15px);
    transition: all 0.6s ease;
}

.dots {
    font-size: clamp(3rem, 10vw, 5rem);
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.3em;
    opacity: 0;
    transition: opacity 0.8s ease;
}

.slide.active .dots {
    opacity: 1;
}

.slide.active .text {
    opacity: 1;
    transform: translateY(0);
}

.slide.active .text:nth-child(1) { transition-delay: 0.1s; }
.slide.active .text:nth-child(2) { transition-delay: 0.25s; }
.slide.active .text:nth-child(3) { transition-delay: 0.4s; }
.slide.active .text:nth-child(4) { transition-delay: 0.55s; }
.slide.active .text:nth-child(5) { transition-delay: 0.7s; }

.number {
    font-size: clamp(7rem, 22vw, 10rem);
    font-weight: 400;
    line-height: 1;
    margin: 20px 0;
    color: #d4af37;
    opacity: 0;
    transform: translateY(15px);
    transition: all 0.8s ease 0.2s;
}

.slide.active .number {
    opacity: 1;
    transform: translateY(0);
}

.highlight {
    color: #d4af37;
    font-style: italic;
}

.final {
    color: #d4af37;
    font-weight: 500;
}

/* Buttons */
.btn-play {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #f5f0e8;
    padding: 20px 44px;
    font-size: 1.6rem;
    font-family: 'Caveat', cursive;
    font-weight: 500;
    cursor: pointer;
    border-radius: 100px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    -webkit-appearance: none;
    opacity: 0;
    transform: translateY(15px);
    transition: all 0.6s ease 0.3s;
}

.slide.active .btn-play {
    opacity: 1;
    transform: translateY(0);
}

.btn-play:active {
    background: rgba(255, 255, 255, 0.12);
    transform: scale(0.97);
}

.btn-play.playing {
    background: rgba(212, 175, 55, 0.12);
    border-color: rgba(212, 175, 55, 0.3);
}

.btn-icon {
    font-size: 0.8rem;
    opacity: 0.6;
}

.btn-replay {
    background: transparent;
    border: 1px solid rgba(212, 175, 55, 0.4);
    color: #d4af37;
    padding: 14px 32px;
    font-size: 1.4rem;
    font-family: 'Caveat', cursive;
    font-weight: 500;
    cursor: pointer;
    border-radius: 100px;
    transition: all 0.3s ease;
    -webkit-appearance: none;
    margin-top: 30px;
    opacity: 0;
    transform: translateY(15px);
    transition: all 0.6s ease;
}

.slide.active .btn-replay {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.8s;
}

.btn-replay:active {
    background: rgba(212, 175, 55, 0.1);
    transform: scale(0.97);
}

/* Progress */
.progress-container {
    margin-top: 25px;
    opacity: 0;
    transition: opacity 0.5s ease;
}

.progress-container.visible {
    opacity: 1;
}

.progress-bar {
    width: 220px;
    height: 2px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 1px;
    margin: 0 auto;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: rgba(255, 255, 255, 0.4);
    width: 0%;
    transition: width 0.3s linear;
}

.time {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.3);
}
