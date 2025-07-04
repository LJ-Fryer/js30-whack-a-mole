const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const levels = document.querySelector("#levels");
const progress = document.querySelector(".progress");
const bar = document.querySelector(".progress-bar");
const leaderBoard = document.getElementById("leader-board");

let lastHole, timeUp, timerInterval;

let score = 0;
let minimum = 200,
  maximum = 1500;

let playerName, playerScore, playerlevel;

let players = [
  { name: "player1", score: "7" },
  { name: "player2", score: "9" },
  { name: "player3", score: "6" },
]; //array of objects
players
  .sort((a, b) => b.score - a.score)
  .forEach((player, index) => {
    const enterPlayer = document.createElement("div");
    enterPlayer.classList.add("rank");
    let medals = ["🥇", "🥈", "🥉"];
    let medal = medals[index];
    // let rank = index + 1,
    playerName = player.name;
    playerScore = player.score;
    enterPlayer.innerHTML = `
  <span class="player-rank">${medal}</span> 
  <span class="player-name">${playerName}</span> 
  <span class="player-score">${playerScore}</span>`;
    leaderBoard.appendChild(enterPlayer);
  });

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const index = Math.floor(Math.random() * holes.length);
  const hole = holes[index];

  if (lastHole === hole) {
    return randomHole(holes); // console.log("Aah, snap. Same one");
  }
  lastHole = hole;
  return hole;
}

function changeLevel(e) {
  const [min, max] = e.target.value.split(",").map(Number);
  if (!isNaN(min) && !isNaN(max)) {
    minimum = min;
    maximum = max;
  }
}

function popUp() {
  const time = randomTime(minimum, maximum);
  const hole = randomHole(holes);
  hole.classList.add("up");
  setTimeout(() => {
    hole.classList.remove("up");
    if (!timeUp) popUp();
  }, time);
}

function startTimer() {
  const start = Date.now();
  const max = 10000;
  setInterval(() => {
    const elapsed = Date.now() - start;
    const percentage = (elapsed / max) * 100;
    bar.style.width = percentage + "%";
    // console.log("s:", seconds, "%", percentage);
    if (elapsed >= max) {
      clearInterval(timerInterval);
      bar.style.width = "0%";
    }
  }, 10);
}

function startGame() {
  clearInterval(timerInterval);
  bar.style.backgroundColor = "hsl(211, 52%, 50%)";
  bar.style.width = "0%";
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;
  startTimer();
  popUp();
  setTimeout(() => (timeUp = true), 10000);
  levels.value = "default"; // resets to default levels on start
}

function bonk(e) {
  if (!e.isTrusted) return; // ensures its a pointer/mouse event
  score++;
  this.parentNode.classList.remove("up");
  scoreBoard.textContent = score;
  // move score into localStorage
  latestScore = score;
  console.log("latest score = ", latestScore);
}

moles.forEach((mole) => mole.addEventListener("click", bonk));
levels.addEventListener("change", changeLevel);
