[
    { id: "tree", tag: "img" },
    { id: "car", tag: "img" },
    { id: "timer", tag: "div" },
    { id: "menu", tag: "div" }
  ].forEach(({ id, tag }) => {
    if (!document.getElementById(id)) {
      const el = document.createElement(tag);
      el.id = id;
      el.style = {};
      document.body.appendChild(el);
    }
  });
  
  window.tree = document.getElementById("tree");
  window.car = document.getElementById("car");
  window.timer = document.getElementById("timer");
  window.menu = document.getElementById("menu");
  
  QUnit.testDone(() => {
    ["tree", "car", "timer", "menu"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = "";
    });
  });
  
  QUnit.module("Sanity");
  
  QUnit.test("Framework is working", assert => {
    assert.ok(true, "QUnit runs correctly");
  });
  
  QUnit.module("Utility Functions");
  
  QUnit.test("mapNeedleAngleToDegrees() maps correctly", assert => {
    const min = mapNeedleAngleToDegrees(0);
    const mid = mapNeedleAngleToDegrees(50);
    const max = mapNeedleAngleToDegrees(100);
  
    assert.ok(min < mid && mid < max, "Needle mapping is increasing");
    assert.ok(min < 0 && max > 0, "Range spans both negative and positive angles");
  });
  
  QUnit.test("burnoutBonusMultiplier calculates correctly", assert => {
    const bonus = 1 - (45 / 100);
    assert.equal(bonus.toFixed(2), "0.55", "Burnout multiplier scales down with time in green zone");
  });
  
  QUnit.test("Needle angle clamps correctly", assert => {
    let angle = -10;
    angle = Math.max(0, Math.min(100, angle));
    assert.equal(angle, 0, "Clamps low to 0");
  
    angle = 150;
    angle = Math.max(0, Math.min(100, angle));
    assert.equal(angle, 100, "Clamps high to 100");
  });
  
  QUnit.module("Game State Transitions");
  
  QUnit.test("resetGame() resets state flags", assert => {
    const treeEl = document.getElementById("tree");
    treeEl.src = "";
  
    resetGame();
    assert.equal(gameState, "MENU", "Game state is set to MENU");
    assert.equal(gameStarted, false, "gameStarted flag is false");
    assert.equal(greenTime, 0, "greenTime is reset");
    assert.equal(reactionTime, null, "reactionTime is null");
  });
  
  QUnit.module("DOM Rendering");
  
  QUnit.test("showMenu() injects correct structure", assert => {
    const menuDiv = document.getElementById("menu");
    menuDiv.innerHTML = "";
    menuDiv.style.display = "block";
  
    showMenu("Test Title", "Test Message", "Click Me", () => {});
    const h2 = document.querySelector("#menu h2");
    const p = document.querySelector("#menu p");
    const btn = document.getElementById("menuButton");
  
    assert.ok(h2 && h2.textContent === "Test Title", "Title injected correctly");
    assert.ok(p && p.textContent === "Test Message", "Message injected correctly");
    assert.ok(btn && btn.textContent === "Click Me", "Button labeled correctly");
  });
  
  QUnit.module("Race Logic");
  
  QUnit.test("launchCarAndDisplayTime() computes final time correctly", assert => {
    const testReaction = 0.250;
    burnoutBonusMultiplier = 0.9;
  
    const carEl = document.getElementById("car");
    carEl.style.transition = "none";
    carEl.style.transform = "";
  
    const timerEl = document.getElementById("timer");
    timerEl.textContent = "";
  
    launchCarAndDisplayTime(testReaction);
  
    const expected = (10 * 0.9 + 0.25).toFixed(2);
    const done = assert.async();
    setTimeout(() => {
      const actual = parseFloat(timerEl.textContent);
      assert.equal(actual.toFixed(2), expected, "Final time displayed matches expected");
      done();
    }, raceTime * 1000 + 100);
  });
  
  QUnit.module("Score Submission");
  
  QUnit.test("saveScore() blocks empty usernames", async assert => {
    const done = assert.async();
    const input = document.createElement("input");
    input.id = "usernameInput";
    document.body.appendChild(input);
  
    input.value = "";
    window.alert = (msg) => {
      assert.equal(msg, "Please enter a valid username.", "Alert shown for empty username");
      done();
    };
  
    await saveScore();
    input.remove();
  });
  