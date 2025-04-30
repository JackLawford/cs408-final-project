const tree = document.getElementById("tree");
const timer = document.getElementById("timer");
const menu = document.getElementById("menu");
const car = document.getElementById("car");
const startButton = document.getElementById("startButton");
const leaderboardButton = document.getElementById("leaderboardButton");
const gameCanvas = document.getElementById("gameCanvas");
const backgroundLayer = document.getElementById("backgroundLayer");
const needle = document.getElementById('needle');
const wheel = document.getElementById('wheel');

const launchSound = new Audio('sounds/launch.mp3');
const revSound = new Audio('sounds/rev.mp3');
const idleSound = new Audio('sounds/idle.mp3');

let gameState = "MENU"; // Possible states: MENU, RACE, BURNOUT
let gameStarted = false;
let greenTime = 0;
let reactionTime = null;
let raceTime = 0;
let jumped = false;
let burnoutNeedleAngle = 0; // degrees
let isThrottleHeld = false;
let burnoutGreenZoneTop = 65; // tweak based on real graphics
let burnoutGreenZoneBottom = 35;
let burnoutGreenZoneTime = 0; // how much time in green
let burnoutStartTime = 0; // when burnout started
let burnoutSessionDuration = 10.0; // in seconds
let burnoutBonusMultiplier = 1.0; // multiplier for burnout time
let wheelSpeed = 0; // speed of the wheel rotation
let burnoutActive = false;
let volume = 0; // volume for sound effects

// start the game (initial menu)
function startGame() {
  resetGame();
  gameState = "MENU";

  backgroundLayer.style.background = "url('../img/load-01.png') no-repeat center center";
  backgroundLayer.style.display = "block";
  backgroundLayer.style.backgroundSize = "120% 110%";
  menu.style.display = "none";
  menu.style.paddingBottom = "0";
  
  console.log(menu);

  showMenu("ClickRacer", "Click play to begin!", "Play", startBurnoutPhase);
}

function startBurnoutPhase() {
  gameState = "BURNOUT"; 
  gameCanvas.style.background = "url('../img/burnout-pit.png') no-repeat center center";
  gameCanvas.style.backgroundSize = "cover";
  menu.style.display = "none";
  menu.style.paddingBottom = "0";
  needle.style.display = "block";
  needle.style.transformOrigin = "center 100%";

  car.src = "img/vettestill.png";
  car.style.top = "30%";
  car.style.width = "60%";

  timer.style.fontSize = "4em";
  timer.style.top = "5%";
  timer.style.left = "80%";
  timer.innerText = "BURNOUT!";

  tree.src = "img/gauge.png";
  tree.style.width = "30%";
  tree.style.top = "65%";
  tree.style.left = "-5.1%";

  idleSound.volume = 0.1;

  setTimeout(() => {
  backgroundLayer.style.display = "none";
  startBurnoutLogic();
  }, 100);
}

function startBurnoutLogic() {
  burnoutNeedleAngle = 0;
  isThrottleHeld = false;
  burnoutGreenZoneTime = 0;
  burnoutActive = false; // wait for warmup
  burnoutStartTime = 0;

  setTimeout(() => {
    burnoutActive = true;
    burnoutStartTime = performance.now();
  }, 1500);

  requestAnimationFrame(updateBurnoutNeedle);
}


function updateBurnoutNeedle() {
  if (gameState !== "BURNOUT") return;

  const now = performance.now();
  let elapsed = 0;

  if (burnoutActive) {
    elapsed = (now - burnoutStartTime) / 1000;
    timer.innerText = `${(10 - elapsed).toFixed(2)}s`;
  } else {
    timer.style.left = "20%";
    timer.innerText = "DO A BURNOUT!!!";
  }

  if (elapsed >= burnoutSessionDuration) {
    endBurnoutPhase();
    return;
  }

  // move needle
  if (isThrottleHeld) {
    burnoutNeedleAngle += 2;
  } else {
    burnoutNeedleAngle -= 1.5;
  }

  burnoutNeedleAngle = Math.max(0, Math.min(100, burnoutNeedleAngle));
  needle.style.transform = `translate(-50%, -50%) rotate(${mapNeedleAngleToDegrees(burnoutNeedleAngle)}deg)`;

  // animate wheel spin
  if (burnoutNeedleAngle > 5) {
    wheel.style.display = "block";
    car.src = "img/vette.png";

    wheelSpeed = Math.abs(burnoutNeedleAngle * 100);

    if (revSound.paused) {
      revSound.volume = 0;
      revSound.play();
      revSound.loop = true;

      let fadeInterval = setInterval(() => {
        if (revSound.volume < 0.5) {
          revSound.volume = Math.min(revSound.volume + 0.1, 1);
        } else {
          clearInterval(fadeInterval);
        }
      }, 100);
    }
  } else {
    wheel.style.display = "none";
    car.src = "img/vettestill.png";

    wheelSpeed = 0;

    revSound.pause();
    revSound.currentTime = 0;
    
    idleSound.loop = true;
    idleSound.play();
  }
  wheel.style.transform = `translate(-50%, -50%) rotate(${wheelSpeed}deg)`;
  wheel.style.transition = "transform 0.1s linear";

  // Only count green zone time if burnout is active
  if (burnoutActive && burnoutNeedleAngle >= burnoutGreenZoneBottom && burnoutNeedleAngle <= burnoutGreenZoneTop) {
    burnoutGreenZoneTime += 1 / 60;
  }

  burnoutBonusMultiplier = 1 - (burnoutGreenZoneTime / 100);

  requestAnimationFrame(updateBurnoutNeedle);
}

function endBurnoutPhase() {
  backgroundLayer.style.display = "block";
  isThrottleHeld = false;
  gameCanvas.style.background = "url('../img/strip-01.png') no-repeat center center";
  gameCanvas.style.backgroundSize = "cover";

  car.src = "img/vetterear.png";

  needle.style.display = "none";

  wheel.style.removeProperty("display");

  timer.textContent = "--.--s";
  tree.src = "img/tree-01.png";
  tree.style.removeProperty("top");
  tree.style.removeProperty("left");
  tree.style.removeProperty("width"); 

  car.style.removeProperty("top");
  car.style.removeProperty("width");

  timer.style.removeProperty("font-size");
  timer.style.removeProperty("top");
  timer.style.removeProperty("left");

  idleSound.pause();
  revSound.pause();

  showMenu( burnoutGreenZoneTime.toFixed(2) + "/10s", "Now you're ready to race!", "Race", startTreeSequence, "", "none" );
}

// this is what REALLY starts the race
function startTreeSequence() {
  menu.style.display = "none";
  backgroundLayer.style.display = "none";
  gameState = "RACE";
  raceTime = 0;
  jumped = false;
  gameStarted = true;
  tree.src = "img/tree-01.png";
  idleSound.play();

  setTimeout(() => {
    if (jumped) return;
    tree.src = "img/stage_tree-01.png";
    setTimeout(() => {
      if (jumped) return;
      tree.src = "img/yellow_tree-01.png";
      setTimeout(() => {
        if (jumped) return;
        tree.src = "img/green_tree-01.png";
        greenTime = performance.now();
      }, 500);
    }, 500);
  }, 1000);
}

gameCanvas.addEventListener("mousedown", () => {
  //console.log("Mouse down event triggered with gamestate = " + gameState);
  if (gameState === "BURNOUT") {
    isThrottleHeld = true;
  } else if (gameState === "RACE") {
    if (reactionTime !== null) return; // only launch once
    handleRaceClick();
  }
});

gameCanvas.addEventListener("mouseup", () => {
  if (gameState === "BURNOUT") {
    isThrottleHeld = false;
  }
});

function handleRaceClick() {
  const now = performance.now();
  idleSound.pause();
  launchSound.currentTime = 1;
  launchSound.volume = 0.5;
  launchSound.play();
  if (greenTime === 0) {
    jumpedStart();
    tree.src = "img/red_tree-01.png";
  } else {
    reactionTime = (now - greenTime) / 1000;
    launchCarAndDisplayTime(reactionTime);
  }
}

// car shrinks and drives away, score is displayed
function launchCarAndDisplayTime(reactionTime) {
  car.style.transition = "none";
  car.style.transform = "translateX(-50%) translateY(0px) scale(1)";
  
  void car.offsetWidth;

  raceTime = 10 * burnoutBonusMultiplier;
  const finalTime = raceTime + reactionTime;

  //console.log("Final time: " + finalTime.toFixed(2) + "s with burnout bonus: " + burnoutBonusMultiplier.toFixed(2) + "x" + " (reaction time: " + reactionTime.toFixed(2) + "s)");
  
  car.style.transition = `transform ${raceTime}s cubic-bezier(0.01, 0.8, 0.1, 1)`;
  car.style.transform = "translateX(-57%) translateY(-52%) scale(0.01)";
  
  setTimeout(() => {
    timer.textContent = `${finalTime.toFixed(2)}s`;
    setTimeout(() => {
      raceDone(finalTime);
    }, 1000);
  }, raceTime * 1000);
}

function jumpedStart() {
  jumped = true;
  resetGame();
  timer.textContent = "DNF";
  showMenu("Not so fast!", "You have to wait for the light to turn green, hotshot!", "Restart", startGame, "", "none");
}

function raceDone(raceTime) {
  resetGame();
  launchSound.pause();
  backgroundLayer.style.display = "block";
  const extraHTML = `
    <input id="usernameInput" type="text" placeholder="Username" style="margin: 10px 0 10px 5px; padding: 8px; font-size: 1em; border-radius: 5px; ">
    <button id="saveScoreButton" style="margin: 10px; padding: 8px 12px;">Save Time</button><br/>`;
  showMenu(
    `Finished: ${raceTime.toFixed(4)}s`,
    "Save your time or try again!",
    "Try Again",
    startGame,
    extraHTML,
    "none"
  );

  menu.style.paddingBottom = "50px";

  setTimeout(() => { // slight delay to ensure elements exist *****DO NOT REMOVE******
    document.getElementById("saveScoreButton").addEventListener("click", saveScore);
  }, 50);
}

async function saveScore() {
  const usernameInput = document.getElementById("usernameInput");
  const username = usernameInput.value.trim();

  if (username === "") {
    alert("Please enter a valid username.");
    return;
  }

  const score = parseFloat(raceTime.toFixed(4));
  const userid = username;

  await submitScore(userid, score);

  setTimeout(() => {
    startGame();
  }, 100);
}

async function submitScore(userid, score) {
  try {
    const response = await fetch('https://d5tedw0pz6.execute-api.us-east-2.amazonaws.com/score', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid, score })
    });
    const data = await response.json();
    console.log('Score submit response:', data);
  } catch (error) {
    console.error('Failed to submit score:', error);
  }
}

function mapNeedleAngleToDegrees(value) {
  const minDeg = -90;
  const maxDeg = 90;
  return minDeg + (maxDeg - minDeg) * (value / 100);
}

function showMenu(title, message, buttonText, buttonAction, extraHTML = "", leaderboardDisplay = "") {
  menu.style.display = "block";
  menu.innerHTML = `
    <h2>${title}</h2>
    <p>${message}</p>
    ${extraHTML}
    <button id="menuButton">${buttonText}</button>
    <a id="leaderboardButton" href="/leaderboard.html" style="display: ${leaderboardDisplay}; margin-top: 10px;">Leaderboard</a>`;

  const menuButton = document.getElementById("menuButton");
  menuButton.addEventListener("click", buttonAction);
}

function resetGame() {
  gameState = "MENU";
  gameStarted = false;
  greenTime = 0;
  reactionTime = null;
  tree.src = "img/tree-01.png";

  const car = document.getElementById("car");
  car.style.transition = "none";
  car.style.transform = "translateX(-50%) translateY(0px) scale(1)";
}

window.addEventListener("load", startGame);