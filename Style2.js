let notebooks = 0;
let notebooksPerClick = 1;
let multiplier = 1;
let notebooksPerSecond = 0;

let clickCost = 15;
let multCost = 100;
let auto1Cost = 50;
let auto2Cost = 250;

const baldiFacts = [
    "Fact: The original game was made in just a few days for a game jam!",
    "Fact: Arts and Crafters is the shy sock puppet who attacks if you look at him too long.",
    "Fact: The Principal of the Thing will send you to detention if he catches you running.",
    "Fact: Baldi's favorite food is crunchy quarters... just kidding, he likes notebooks!",
    "Fact: Playtime just wants to jump rope with you. Five times!",
    "Fact: If you click so fast on baldi duddy and Mike(Michael) will appear!"
    "dad meet baldi baldi baldi baldi ba- ba- baldi"
];

const randomFact = baldiFacts[Math.floor(Math.random() * baldiFacts.length)];
document.getElementById('fact-display').textContent = randomFact;

setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none';
}, 3000);

let clickTimes = [];
const SPAM_THRESHOLD = 7; 
let firstVideoStarted = false;
let transitionsToLoop = false;

const firstVideo = document.getElementById('first-clip');
const secondVideo = document.getElementById('second-clip');

// 1. When the first video naturally ends, transition to the second looping video
firstVideo.addEventListener('ended', () => {
    if (clickTimes.length >= SPAM_THRESHOLD) {
        firstVideo.style.display = 'none';
        secondVideo.style.display = 'block';
        secondVideo.loop = true; // Hard-coded insurance policy to make it loop!
        secondVideo.play().catch(err => console.log("Audio playback waiting for click:", err));
        transitionsToLoop = true;
    } else {
        resetVideos();
    }
});

// 2. Track click speed
function checkSpamSpeed() {
    const now = Date.now();
    clickTimes.push(now);
    clickTimes = clickTimes.filter(time => now - time < 1000);

    if (clickTimes.length >= SPAM_THRESHOLD) {
        if (!firstVideoStarted) {
            firstVideoStarted = true;
            firstVideo.style.display = 'block';
            firstVideo.play().catch(err => console.log("Video playback waiting for click:", err));
        }
        // If we are already on the second video, DO NOT call play() again 
        // because calling play() repeatedly stops it from looping naturally!
    }
}

// 3. Clear everything when clicking stops completely
function resetVideos() {
    firstVideo.pause(); 
    firstVideo.currentTime = 0; 
    firstVideo.style.display = 'none';
    
    secondVideo.pause(); 
    secondVideo.currentTime = 0; 
    secondVideo.style.display = 'none';
    
    firstVideoStarted = false;
    transitionsToLoop = false;
}

// Monitor for inactivity (player stopped clicking)
setInterval(() => {
    const now = Date.now();
    clickTimes = clickTimes.filter(time => now - time < 1000);

    if (clickTimes.length === 0) {
        resetVideos();
    }
}, 800);

const notebookDisplay = document.getElementById('notebook-count');
const npsDisplay = document.getElementById('nps-count');
const baldiBtn = document.getElementById('baldi-btn');

function updateUI() {
    notebookDisplay.textContent = Math.floor(notebooks);
    npsDisplay.textContent = notebooksPerSecond;
    
    document.getElementById('click-cost').textContent = clickCost;
    document.getElementById('mult-cost').textContent = multCost;
    document.getElementById('auto1-cost').textContent = auto1Cost;
    document.getElementById('auto2-cost').textContent = auto2Cost;

    document.getElementById('upgrade-click').disabled = notebooks < clickCost;
    document.getElementById('upgrade-multiplier').disabled = notebooks < multCost;
    document.getElementById('upgrade-auto1').disabled = notebooks < auto1Cost;
    document.getElementById('upgrade-auto2').disabled = notebooks < auto2Cost;
}

baldiBtn.addEventListener('keydown', (e) => {
    if (e.repeat) { e.preventDefault(); return; }
});

baldiBtn.addEventListener('mousedown', () => {
    notebooks += (notebooksPerClick * multiplier);
    updateUI();
    checkSpamSpeed();
});

document.getElementById('upgrade-click').addEventListener('click', () => {
    if (notebooks >= clickCost) { notebooks -= clickCost; notebooksPerClick += 1; clickCost = Math.round(clickCost * 1.5); updateUI(); }
});
document.getElementById('upgrade-multiplier').addEventListener('click', () => {
    if (notebooks >= multCost) { notebooks -= multCost; multiplier *= 2; multCost = Math.round(multCost * 2.5); updateUI(); }
});
document.getElementById('upgrade-auto1').addEventListener('click', () => {
    if (notebooks >= auto1Cost) { notebooks -= auto1Cost; notebooksPerSecond += 1; auto1Cost = Math.round(auto1Cost * 1.6); updateUI(); }
});
document.getElementById('upgrade-auto2').addEventListener('click', () => {
    if (notebooks >= auto2Cost) { notebooks -= auto2Cost; notebooksPerSecond += 5; auto2Cost = Math.round(auto2Cost * 1.7); updateUI(); }
});

setInterval(() => {
    if (notebooksPerSecond > 0) { notebooks += (notebooksPerSecond / 10); updateUI(); }
}, 100);

updateUI();
