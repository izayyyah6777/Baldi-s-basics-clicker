let notebooks = 0;
let notebooksPerClick = 1;
let multiplier = 1;
let notebooksPerSecond = 0;

// Base upgrade costs matching your large panel requirements
let clickCost = 15;
let multCost = 100;
let ropeCost = 1000;
let rulerCost = 1000000;

let auto1Cost = 50;
let auto2Cost = 250;
let whistleCost = 1500;
let craftersCost = 10000;
let detentionCost = 150000;

const baldiFacts = [
    "Fact: The original game was made in just a few days for a game jam!",
    "Fact: Arts and Crafters is the shy sock puppet who attacks if you look at him too long.",
    "Fact: The Principal of the Thing will send you to detention if he catches you running.",
    "Fact: Baldi's favorite food is crunchy quarters... just kidding, he likes notebooks!",
    "Fact: Playtime just wants to jump rope with you. Five times!",
    "Fact: If you click so fast on baldi duddy and Mike(Michael) will appear!"
    "dad meet baldi baldi baldi ba- ba- baldi"
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

firstVideo.addEventListener('ended', () => {
    if (clickTimes.length >= SPAM_THRESHOLD) {
        firstVideo.style.display = 'none';
        secondVideo.style.display = 'block';
        secondVideo.loop = true;
        secondVideo.play().catch(err => console.log("Audio target interaction ready", err));
        transitionsToLoop = true;
    } else {
        resetVideos();
    }
});

function checkSpamSpeed() {
    const now = Date.now();
    clickTimes.push(now);
    clickTimes = clickTimes.filter(time => now - time < 1000);

    if (clickTimes.length >= SPAM_THRESHOLD) {
        if (!firstVideoStarted) {
            firstVideoStarted = true;
            firstVideo.style.display = 'block';
            firstVideo.play().catch(err => console.log("Audio target interaction ready", err));
        }
    }
}

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

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateUI() {
    notebookDisplay.textContent = formatNumber(Math.floor(notebooks));
    npsDisplay.textContent = formatNumber(notebooksPerSecond);
    
    document.getElementById('click-cost').textContent = formatNumber(clickCost);
    document.getElementById('mult-cost').textContent = formatNumber(multCost);
    document.getElementById('rope-cost').textContent = formatNumber(ropeCost);
    document.getElementById('ruler-cost').textContent = formatNumber(rulerCost);

    document.getElementById('auto1-cost').textContent = formatNumber(auto1Cost);
    document.getElementById('auto2-cost').textContent = formatNumber(auto2Cost);
    document.getElementById('whistle-cost').textContent = formatNumber(whistleCost);
    document.getElementById('crafters-cost').textContent = formatNumber(craftersCost);
    document.getElementById('detention-cost').textContent = formatNumber(detentionCost);

    document.getElementById('upgrade-click').disabled = notebooks < clickCost;
    document.getElementById('upgrade-multiplier').disabled = notebooks < multCost;
    document.getElementById('upgrade-rope').disabled = notebooks < ropeCost;
    document.getElementById('upgrade-ruler').disabled = notebooks < rulerCost;

    document.getElementById('upgrade-auto1').disabled = notebooks < auto1Cost;
    document.getElementById('upgrade-auto2').disabled = notebooks < auto2Cost;
    document.getElementById('upgrade-whistle').disabled = notebooks < whistleCost;
    document.getElementById('upgrade-crafters').disabled = notebooks < craftersCost;
    document.getElementById('upgrade-detention').disabled = notebooks < detentionCost;
}

baldiBtn.addEventListener('keydown', (e) => {
    if (e.repeat) { e.preventDefault(); return; }
});

baldiBtn.addEventListener('mousedown', () => {
    notebooks += (notebooksPerClick * multiplier);
    updateUI();
    checkSpamSpeed();
});

// Click Upgrades Logic
document.getElementById('upgrade-click').addEventListener('click', () => {
    if (notebooks >= clickCost) { notebooks -= clickCost; notebooksPerClick += 1; clickCost = Math.round(clickCost * 1.5); updateUI(); }
});
document.getElementById('upgrade-multiplier').addEventListener('click', () => {
    if (notebooks >= multCost) { notebooks -= multCost; multiplier *= 2; multCost = Math.round(multCost * 2.5); updateUI(); }
});
document.getElementById('upgrade-rope').addEventListener('click', () => {
    if (notebooks >= ropeCost) { notebooks -= ropeCost; notebooksPerClick += 10; ropeCost = Math.round(ropeCost * 1.8); updateUI(); }
});
document.getElementById('upgrade-ruler').addEventListener('click', () => {
    if (notebooks >= rulerCost) { notebooks -= rulerCost; multiplier *= 5; rulerCost = Math.round(rulerCost * 4); updateUI(); }
});

// NPS Upgrades Logic
document.getElementById('upgrade-auto1').addEventListener('click', () => {
    if (notebooks >= auto1Cost) { notebooks -= auto1Cost; notebooksPerSecond += 1; auto1Cost = Math.round(auto1Cost * 1.6); updateUI(); }
});
document.getElementById('upgrade-auto2').addEventListener('click', () => {
    if (notebooks >= auto2Cost) { notebooks -= auto2Cost; notebooksPerSecond += 5; auto2Cost = Math.round(auto2Cost * 1.7); updateUI(); }
});
document.getElementById('upgrade-whistle').addEventListener('click', () => {
    if (notebooks >= whistleCost) { notebooks -= whistleCost; notebooksPerSecond += 25; whistleCost = Math.round(whistleCost * 1.7); updateUI(); }
});
document.getElementById('upgrade-crafters').addEventListener('click', () => {
    if (notebooks >= craftersCost) { notebooks -= craftersCost; notebooksPerSecond += 150; craftersCost = Math.round(craftersCost * 1.8); updateUI(); }
});
document.getElementById('upgrade-detention').addEventListener('click', () => {
    if (notebooks >= detentionCost) { notebooks -= detentionCost; notebooksPerSecond += 1000; detentionCost = Math.round(detentionCost * 2); updateUI(); }
});

setInterval(() => {
    if (notebooksPerSecond > 0) { notebooks += (notebooksPerSecond / 10); updateUI(); }
}, 100);

updateUI();
