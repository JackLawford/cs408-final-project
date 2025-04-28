const tree = document.getElementById("tree");
const timer = document.getElementById("timer");
const menu = document.getElementById("menu");
const startButton = document.getElementById("startButton");
const leaderboardButton = document.getElementById("leaderboardButton");
const gameCanvas = document.getElementById("gameCanvas");
const backgroundLayer = document.getElementById("backgroundLayer");

let gameStarted = false;
let greenTime = 0;
let reactionTime = null;
let raceTime = 0;
let jumped = false;

// Start the game (initial menu)
function startGame() {
  resetGame();
  backgroundLayer.style.display = "block;";
  menu.style.paddingBottom = "0";
  showMenu("ClickRacer", "Click play to begin!", "Play", startTreeSequence);
}

// Start the tree sequence
function startTreeSequence() {
  raceTime = 0;
  jumped = false;
  backgroundLayer.style.display = "none";
  menu.style.display = "none";
  gameStarted = true;
  timer.textContent = "--.--s";
  tree.src = "img/tree-01.png";

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

// Handle clicking during gameplay
gameCanvas.addEventListener("mousedown", () => {
  if (!gameStarted) return;
  if (reactionTime !== null) return;

  const now = performance.now();

  if (greenTime === 0) {
    jumpedStart();
    tree.src = "img/red_tree-01.png";
  } else {
    reactionTime = (now - greenTime) / 1000;
    launchCarAndDisplayTime(reactionTime);
  }
});

// Animate the car shrinking and driving away
function launchCarAndDisplayTime(reactionTime) {
  const car = document.getElementById("car");

  // Reset any previous animation
  car.style.transition = "none";
  car.style.transform = "translateX(-50%) translateY(0px) scale(1)";
  
  void car.offsetWidth;

  raceTime = 10 + reactionTime;
  car.style.transition = `transform ${raceTime}s cubic-bezier(0.01, 0.8, 0.6, 1)`;
  car.style.transform = "translateX(-57%) translateY(-52%) scale(0.01)";

  setTimeout(() => {
    timer.textContent = `${raceTime.toFixed(2)}s`;
    raceDone(raceTime);
  }, raceTime * 1000);
}

// Handle false start (jumped the light)
function jumpedStart() {
  jumped = true;
  resetGame();
  timer.textContent = "DNF";
  showMenu("Not so fast!", "You have to wait for the light to turn green, hotshot!", "Restart", startGame, "", "none");
}

// Handle race finish
function raceDone(raceTime) {
  resetGame();

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

  setTimeout(() => { // slight delay to ensure elements exist
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

async function fetchLeaderboard() {
  try {
    const response = await fetch('https://d5tedw0pz6.execute-api.us-east-2.amazonaws.com/leaderboard');
    const leaderboard = await response.json();
    console.log('Fetched leaderboard:', leaderboard);
    return leaderboard;
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
}

// Helper function to show the dynamic menu
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
  gameStarted = false;
  greenTime = 0;
  reactionTime = null;
  tree.src = "img/tree-01.png";

  const car = document.getElementById("car");
  car.style.transition = "none";
  car.style.transform = "translateX(-50%) translateY(0px) scale(1)";
}

// Start the game once page fully loads
window.addEventListener("load", startGame);
