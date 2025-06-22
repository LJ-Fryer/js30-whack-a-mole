const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const levels = document.querySelector("#levels");

let lastHole;
let timeUp;
let score = 0;
let minimum = 200,
  maximum = 1500;

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

function startGame() {
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;
  popUp();
  setTimeout(() => (timeUp = true), 10000);
  levels.value = "default"; // resets to default levels on start
}

function bonk(e) {
  if (!e.isTrusted) return; // ensures its a pointer/mouse event
  score++;
  this.parentNode.classList.remove("up");
  scoreBoard.textContent = score;
}

moles.forEach((mole) => mole.addEventListener("click", bonk));
levels.addEventListener("change", changeLevel);
