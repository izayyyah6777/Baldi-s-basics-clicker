// --- GAME STATE ---
let notebooks = 0;
let notebooksPerClick = 1;
let notebooksPerSecond = 0;

let clickCost = 15;
let auto1Cost = 50;
let auto2Cost = 250;

// 1. Added your new fact to the list!
const baldiFacts = [
    "Fact: The original game was made in just a few days for a game jam!",
    "Fact: Arts and Crafters is the shy sock puppet who attacks if you look at him too long.",
    "Fact: The Principal of the Thing will send you to detention if he catches you running.",
    "Fact: Baldi's favorite food is crunchy quarters... just kidding, he likes notebooks!",
    "Fact: Playtime just wants to jump rope with you. Five times!",
    "Fact: If you click so fast on baldi duddy and Mike(Michael) will appear!"
];

// Show random loading fact
const randomFact = baldiFacts[Math.floor(Math.random() * baldiFacts.length)];
document.getElementById('fact-display').textContent = randomFact;

// Hide loading screen after 3 seconds
setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none';
}, 3000);

// --- SPAM DETECTOR & EASTER EGG VARIABLES ---
let clickTimes = [];
const SPAM_THRESHOLD = 7; // Number of clicks required in 1 second to trigger
let firstVideoStarted = false;

const firstVideo = document.getElementById('first-clip');
const secondVideo = document.getElementById('second-clip');

// --- DOM ELEMENTS ---
const notebookDisplay = document.getElementById('notebook-count');
const npsDisplay = document.getElementById('nps-count');
const baldiBtn = document.getElementById('baldi-btn');

// --- FUNCTIONS ---
function updateUI() {
    notebookDisplay.textContent = Math.floor(notebooks);
    npsDisplay.textContent = notebooksPerSecond;
    
    document.getElementById('click-cost').textContent = clickCost;
    document.getElementById('auto1-cost').textContent = auto1Cost;
    document.getElementById('auto2-cost').textContent = auto2Cost;

    document.getElementById('upgrade-click').disabled = notebooks < clickCost;
    document.getElementById('upgrade-auto1').disabled = notebooks < auto1Cost;
    document.getElementById('upgrade-auto2').disabled = notebooks < auto2Cost;
}

// Check how fast the player is clicking
function checkSpamSpeed() {
    const now = Date.now();
    clickTimes.push(now);

    // Only keep clicks from the last 1000 milliseconds (1 second)
    clickTimes = clickTimes.filter(time => now - time < 1000);

    // If they clicked enough times in 1 second, activate easter egg
    if (clickTimes.length >= SPAM_THRESHOLD) {
        triggerEasterEgg();
    }
}

function triggerEasterEgg() {
    if (!firstVideoStarted) {
        // Step 1: Play FirstClip.mp4
        firstVideoStarted = true;
        firstVideo.style.display = 'block';
        firstVideo.play();
    } else if (firstVideo.currentTime > 0 && !firstVideo.paused) {
        // Step 2: If they are STILL spamming while FirstClip is playing, switch to SecondClip
        switchToSecondVideo();
    }
}

function switchToSecondVideo() {
    firstVideo.style.display = 'none';
    firstVideo.pause();
    
    secondVideo.style.display = 'block';
    secondVideo.play();
}

// Stop videos when the user stops clicking fast
setInterval(() => {
    const now = Date.now();
    clickTimes = clickTimes.filter(time => now - time < 1000);

    // If clicking speed drops to 0, hide and reset videos
    if (clickTimes.length === 0) {
        firstVideo.pause();
        firstVideo.currentTime = 0;
        firstVideo.style.display = 'none';
        
        secondVideo.pause();
        secondVideo.currentTime = 0;
        secondVideo.style.display = 'none';
        
        firstVideoStarted = false;
    }
}, 800); // Checks every 0.8 seconds if player stopped clicking

// --- ANTI-CHEAT CLICK LISTENER ---
// "keydown" fires repeatedly if someone holds a key. We prevent that here.
baldiBtn.addEventListener('keydown', (e) => {
    if (e.repeat) {
        e.preventDefault(); // Blocks holding down Space/Enter to cheat!
        return;
    }
});

baldiBtn.addEventListener('mousedown', (e) => {
    // Standard click logic
    notebooks += notebooksPerClick;
    updateUI();
    
    // Run speed checker
    checkSpamSpeed();
});

// --- UPGRADE SHOP LISTENERS ---
document.getElementById('upgrade-click').addEventListener('click', () => {
    if (notebooks >= clickCost) { notebooks -= clickCost; notebooksPerClick += 1; clickCost = Math.round(clickCost * 1.5); updateUI(); }
});
document.getElementById('upgrade-auto1').addEventListener('click', () => {
    if (notebooks >= auto1Cost) { notebooks -= auto1Cost; notebooksPerSecond += 1; auto1Cost = Math.round(auto1Cost * 1.6); updateUI(); }
});
document.getElementById('upgrade-auto2').addEventListener('click', () => {
    if (notebooks >= auto2Cost) { notebooks -= auto2Cost; notebooksPerSecond += 5; auto2Cost = Math.round(auto2Cost * 1.7); updateUI(); }
});

// Passive income loop
setInterval(() => {
    if (notebooksPerSecond > 0) { notebooks += (notebooksPerSecond / 10); updateUI(); }
}, 100);

updateUI();
