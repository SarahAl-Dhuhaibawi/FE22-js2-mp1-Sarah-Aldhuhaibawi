let getUserName = document.querySelector("#name-button");
let computerPoints = document.querySelector("#computer-points");
let winnerName = document.querySelector("#winner-name");
let showComputerChoice = document.querySelector("#computer-choice");

let userData = {
  name: "",
  score: 0,
};

const input = document.querySelector("#name-input");
const div1 = document.querySelectorAll(".button");
input.value = "";
let userName = "";
const section = document.querySelector("#section");
let highscoreDiv = document.querySelector("#highscore-Div");

const baseUrl = `https://test-mp1-js2-default-rtdb.europe-west1.firebasedatabase.app/userList`;

input.addEventListener("change", (e) => {
  userName = e.target.value;
});

function displayUserName() {
  let userNameText = document.querySelector("#username-text");
  userNameText.innerText = `Choose an option, ${input.value}`;
  input.value = "";
}

getUserName.addEventListener("click", (e) => {
  e.preventDefault();
  if (input.value === "") {
    alert("Please write your name first");
  } else {
    displayUserName();
    showHighscore();
    userData.name = userName;
    document.body.style.backgroundColor = "rgb(153, 146, 225)";
    section.style.display = "block";
    highscoreDiv.style.display = "block";
  }
});

let userCounter = 0;

let userPoints = document.querySelector("#user-points");
userPoints.innerText = `Player: ${userCounter}`;

let roundCounter = document.querySelector("#round-counter");
const userChoices = document.querySelectorAll("#user-btn");

for (let i = 0; i < userChoices.length; i++) {
  userChoices[i].addEventListener("click", playGame);
}

function playGame(event) {
  let computerChoice = Math.floor(Math.random() * 3);

  showComputerChoice = document.querySelector("#computer-choice");
  if (computerChoice == 0) {
    showComputerChoice.innerText = "Computer chose: rock";
  } else if (computerChoice == 1) {
    showComputerChoice.innerText = "Computer chose: paper";
  } else {
    showComputerChoice.innerText = "Computer chose: scissors";
  }

  let showUserChoices = document.querySelector("#user-choices");
  if (event.target == userChoices[0]) {
    showUserChoices.innerText = "You chose: rock";
  } else if (event.target == userChoices[1]) {
    showUserChoices.innerText = "You chose: paper";
  } else {
    showUserChoices.innerText = "You chose: scissors";
  }

  if (
    (computerChoice == 0 && event.target == userChoices[0]) ||
    (computerChoice == 1 && event.target == userChoices[1]) ||
    (computerChoice == 2 && event.target == userChoices[2])
  ) {
    roundCounter.innerText = "Tie!";
  } else if (
    (computerChoice == 0 && event.target == userChoices[1]) ||
    (computerChoice == 1 && event.target == userChoices[2]) ||
    (computerChoice == 2 && event.target == userChoices[0])
  ) {
    userCounter++;
    roundCounter.innerText = "You win!";
    userPoints.innerText = `Player: ${userCounter}`;
    userData.score = userCounter;
    showHighscore();
  }

  if (
    (computerChoice == 0 && event.target == userChoices[2]) ||
    (computerChoice == 1 && event.target == userChoices[0]) ||
    (computerChoice == 2 && event.target == userChoices[1])
  ) {
    roundCounter.innerText = "Computer won!";
    post(userData);
    userCounter = 0;
    userPoints.innerText = `Player: ${userCounter}`;
    showHighscore();
  }

  showHighscore();
}

// hämtar data från databasen
async function getData() {
  const url = baseUrl + ".json";

  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// skickar in objekt till databasen på bestämt index
async function post(obj, index) {
  const url = `${baseUrl}.json`;

  const init = {
    method: "POST",
    body: JSON.stringify(obj, index),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };

  const response = await fetch(url, init);
  const data = await response.json();
  return data;
}

function compare(a, b) {
  if (a.score < b.score) {
    return 1;
  }
  if (a.score > b.score) {
    return -1;
  }
  return 0;
}

// skriver ut topplista

async function showHighscore() {
  const info = await getData();

  if (info) {
    const newData = Object.values(info);

    if (newData.length > 0) {
      highscoreDiv.innerHTML = "";

      const h3 = document.createElement("h3");
      highscoreDiv.append(h3);
      h3.innerText = "Top five players";
      h3.style.color = "#08ff00";

      // Data ska vara listad i ordning och hämtar bara 5 användare efter det visar upp dem
      newData.sort(compare).slice(0, 5).map((user, i) => {
          const p = document.createElement("p");
          highscoreDiv.append(p);
          p.innerText = `${1 + i}. ${user.name}: Score: ${user.score}`;
        });
    }
  }
}
