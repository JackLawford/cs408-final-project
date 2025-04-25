const tree = document.getElementById("tree");
const timer = document.getElementById("timer");
let gameStarted = false;
let greenTime = 0;
let reactionTime = null;

function startTreeSequence() {
  gameStarted = true;
  timer.textContent = "--.--s";
  tree.src = "img/tree-01.png";

  setTimeout(() => {
    tree.src = "img/stage_tree-01.png";
    setTimeout(() => {
      tree.src = "img/yellow_tree-01.png";
      setTimeout(() => {
        tree.src = "img/green_tree-01.png";
        greenTime = performance.now();
      }, 500);
    }, 500);
  }, 1000);
}

document.getElementById("gameCanvas").addEventListener("mousedown", () => {
  if (!gameStarted) return;

  const now = performance.now();

  if (greenTime === 0) {
    setTimeout(() => {
        tree.src = "img/red_tree-01.png";
    }, 500);
    resetGame();
  } else {
    reactionTime = (now - greenTime) / 1000;
    launchCarAndDisplayTime(reactionTime);
  }
});

function launchCarAndDisplayTime(reactionTime) {
  const car = document.getElementById("car");

  // Reset any previous animation
  car.style.transition = "none";
  car.style.transform = "translateX(-50%) translateY(0px) scale(1)";
  
  // Force reflow to apply the above instantly
  void car.offsetWidth;

  // Set animation duration
  const raceTime = 10 + reactionTime;
  car.style.transition = `transform ${raceTime}s ease-out`;

  // Combine all transforms in one line
  car.style.transform = "translateX(-57%) translateY(-52%) scale(0.01)";

  // Show timer after raceTime
  setTimeout(() => {
    timer.textContent = (10 + reactionTime).toFixed(2) + "s";
    resetGame();
  }, raceTime * 1000);
}

function resetGame() {
  gameStarted = false;
  greenTime = 0;
  reactionTime = null;
  tree.src = "img/tree-01.png";
}

// Automatically start on load for now
window.addEventListener("load", startTreeSequence);
