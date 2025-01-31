const techniques = {
    'wim-hof': {
        phases: [
            {duration: 1.5, action: 'Breathe In', scale: 1.5},
            {duration: 1, action: 'Hold', scale: 1.2},
            {duration: 1.5, action: 'Breathe Out', scale: 1},
        ],
        cycles: 30,
        recovery: 90,
        instructions: '30 deep breaths followed by breath retention'
    },
    '4-7-8': {
        phases: [
            {duration: 4, action: 'Breathe In', scale: 1.4},
            {duration: 7, action: 'Hold', scale: 1.4},
            {duration: 8, action: 'Breathe Out', scale: 1}
        ],
        cycles: 4,
        instructions: 'Inhale 4s, Hold 7s, Exhale 8s'
    },
    'box': {
        phases: [
            {duration: 4, action: 'Breathe In', scale: 1.4},
            {duration: 4, action: 'Hold', scale: 1.4},
            {duration: 4, action: 'Breathe Out', scale: 1},
            {duration: 4, action: 'Hold', scale: 1}
        ],
        cycles: 6,
        instructions: '4s In, 4s Hold, 4s Out, 4s Hold'
    }
};

let currentTechnique = null;
let isRunning = false;
let currentCycle = 0;
let currentPhase = 0;
let timeLeft = 0;
let timer = null;
const circle = document.querySelector('.breathing-circle');
const phaseDisplay = document.querySelector('.phase-display');
const timerDisplay = document.querySelector('.timer-display');
const instructions = document.getElementById('current-instructions');

document.querySelectorAll('.technique-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.technique-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTechnique = btn.dataset.technique;
        instructions.textContent = techniques[currentTechnique].instructions;
        resetSession();
    });
});

document.getElementById('start-btn').addEventListener('click', () => {
    if (!isRunning) {
        startSession();
    }
});

document.getElementById('reset-btn').addEventListener('click', resetSession);

function startSession() {
    if (!currentTechnique) return;
    isRunning = true;
    currentCycle = 0;
    currentPhase = 0;
    startPhase();
}

function startPhase() {
    const technique = techniques[currentTechnique];
    const phase = technique.phases[currentPhase % technique.phases.length];
    timeLeft = phase.duration;
    
    circle.style.transform = `translate(-50%, -50%) scale(${phase.scale})`;
    phaseDisplay.textContent = phase.action;
    
    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            currentPhase++;
            
            if (currentPhase >= technique.phases.length * technique.cycles) {
                completeSession();
            } else {
                startPhase();
            }
        }
    }, 1000);
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function completeSession() {
    if (currentTechnique === 'wim-hof') {
        timeLeft = techniques[currentTechnique].recovery;
        phaseDisplay.textContent = 'Recovery Breath Hold';
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                resetSession();
            }
        }, 1000);
    } else {
        resetSession();
    }
}

function resetSession() {
    clearInterval(timer);
    isRunning = false;
    currentCycle = 0;
    currentPhase = 0;
    timeLeft = 0;
    timerDisplay.textContent = '00:00';
    phaseDisplay.textContent = '';
    circle.style.transform = 'translate(-50%, -50%) scale(1)';
}
