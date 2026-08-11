// ============================================
// SCREEN MANAGEMENT
// ============================================

let currentScreen = 'loaderScreen';
let candleLit = false;
let confettiInterval = null;

function startSurprise() {
    const music = document.getElementById('bgMusic');
    music.volume = 0.5;
    music.play();

    goToScreen('cakeScreen');
}

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // Show target screen
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        // Re-trigger animation
        screen.style.animation = 'none';
        requestAnimationFrame(() => {
            screen.style.animation = 'fadeIn 0.8s ease';
        });
    }
    currentScreen = screenId;
}

function goToScreen(screenId) {
    showScreen(screenId);

    // Trigger specific actions based on screen
    if (screenId === 'celebrationScreen') {
        startCelebration();
    }
}

// ============================================
// LOADER
// ============================================

let count = 3;
const loaderNumber = document.getElementById('loaderNumber');

const loaderInterval = setInterval(() => {
    count--;
    if (count > 0) {
        loaderNumber.textContent = count;
        // Re-trigger pulse animation
        loaderNumber.style.animation = 'none';
        requestAnimationFrame(() => {
            loaderNumber.style.animation = 'pulse 0.5s ease';
        });
    } else {
        clearInterval(loaderInterval);
        loaderNumber.textContent = '🎉';
        setTimeout(() => {
            showScreen('introScreen');
        }, 500);
    }
}, 900);

// ============================================
// CAKE
// ============================================

function renderCake() {
    const container = document.getElementById('cakeContainer');
    container.innerHTML = `
        <div class="plate"></div>
        <div class="cake-layer cake-layer-bottom"></div>
        <div class="cake-layer cake-layer-middle"></div>
        <div class="cake-layer cake-layer-top"></div>
        <div class="cake-icing"></div>
        <div class="drip drip-1"></div>
        <div class="drip drip-2"></div>
        <div class="drip drip-3"></div>
        <div class="candle">
            <div class="flame" id="flame"></div>
        </div>
    `;
}

function lightCandle() {
    if (candleLit) return;
    candleLit = true;

    const flame = document.getElementById('flame');
    if (flame) {
        flame.classList.add('lit');
    }

    // Show birthday message
    document.getElementById('birthdayMessage').classList.remove('hidden');

    // Show next button, hide candle button
    document.getElementById('candleBtn').classList.add('hidden');
    document.getElementById('nextBtn').classList.remove('hidden');

    // Trigger confetti bursts
    setTimeout(() => burstConfetti(), 300);
    setTimeout(() => burstConfetti(), 800);
    setTimeout(() => burstConfetti(), 1300);
}

function burstConfetti() {
    const colors = ['#FF3CAC', '#F687B3', '#D8B4FE', '#C084FC', '#F472B6', '#FB7185', '#A78BFA'];

    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            confetti({
                particleCount: 80,
                spread: 100,
                origin: { y: 0.6, x: Math.random() * 0.8 + 0.1 },
                colors: colors,
                startVelocity: 20 + Math.random() * 20,
            });
        }, i * 200);
    }
}

// ============================================
// PHOTOS - CARD FLIP
// ============================================

function flipCard(cardElement) {
    cardElement.classList.toggle('flipped');
}

// ============================================
// CELEBRATION - HEART RAIN & CONFETTI
// ============================================

function celebrate() {
    showScreen('celebrationScreen');
}

function startCelebration() {
    // Create heart rain
    createHeartRain();

    // Continuous confetti
    if (confettiInterval) clearInterval(confettiInterval);
    confettiInterval = setInterval(() => {
        burstConfetti();
    }, 800);

    // Heavy confetti burst on arrival
    setTimeout(() => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => burstConfetti(), i * 300);
        }
    }, 500);
}

function createHeartRain() {
    const container = document.getElementById('heartRain');
    container.innerHTML = '';

    const hearts = ['💖', '❤️', '💕', '💗', '💝', '✨', '🎉', '🎊', '💘', '♥️'];

    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (1 + Math.random() * 2) + 'rem';
        heart.style.animationDuration = (3 + Math.random() * 4) + 's';
        heart.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(heart);
    }
}

// ============================================
// RESTART
// ============================================

function restart() {
    if (confettiInterval) {
        clearInterval(confettiInterval);
        confettiInterval = null;
    }
    candleLit = false;
    document.getElementById('candleBtn').classList.remove('hidden');
    document.getElementById('nextBtn').classList.add('hidden');
    document.getElementById('birthdayMessage').classList.add('hidden');
    document.getElementById('heartRain').innerHTML = '';
    showScreen('introScreen');
}

// ============================================
// CONFETTI POLYFILL (if needed)
// ============================================

// Simple confetti implementation (no external library needed)
const confetti = {
    particleCount: 0,
    spread: 0,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#FF3CAC', '#F687B3', '#D8B4FE', '#C084FC', '#F472B6'],
    startVelocity: 30,

    fire: function (options) {
        const count = options.particleCount || 80;
        const spread = options.spread || 100;
        const originX = options.origin?.x || 0.5;
        const originY = options.origin?.y || 0.5;
        const colors = options.colors || this.colors;
        const startVelocity = options.startVelocity || 30;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: ${6 + Math.random() * 8}px;
                height: ${6 + Math.random() * 8}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${originX * window.innerWidth}px;
                top: ${originY * window.innerHeight}px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                pointer-events: none;
                z-index: 9999;
                opacity: 1;
                transform: rotate(${Math.random() * 360}deg);
            `;
            document.body.appendChild(particle);

            const angle = (Math.random() - 0.5) * spread;
            const velocity = startVelocity * (0.6 + Math.random() * 0.8);
            const vx = Math.sin(angle) * velocity;
            const vy = -Math.cos(angle) * velocity - 50;

            let x = originX * window.innerWidth;
            let y = originY * window.innerHeight;
            let opacity = 1;
            let rotation = 0;

            const animate = () => {
                x += vx * 0.02;
                y += vy * 0.02 + 0.5;
                opacity -= 0.005;
                rotation += 2;

                if (opacity <= 0) {
                    particle.remove();
                    return;
                }

                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.opacity = opacity;
                particle.style.transform = `rotate(${rotation}deg)`;

                requestAnimationFrame(animate);
            };

            animate();
        }
    }
};

// Override burstConfetti to use our custom confetti
const originalBurst = burstConfetti;
burstConfetti = function () {
    const colors = ['#FF3CAC', '#F687B3', '#D8B4FE', '#C084FC', '#F472B6', '#FB7185', '#A78BFA'];
    confetti.fire({
        particleCount: 50 + Math.floor(Math.random() * 50),
        spread: 80 + Math.random() * 60,
        origin: { y: 0.5 + Math.random() * 0.2, x: 0.1 + Math.random() * 0.8 },
        colors: colors,
        startVelocity: 20 + Math.random() * 20,
    });
};

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    renderCake();
    showScreen('loaderScreen');
});