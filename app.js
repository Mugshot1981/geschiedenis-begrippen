// ===== ELEMENTEN =====

const chapterSelect = document.getElementById("chapterSelect");
const startButton = document.getElementById("startButton");
const quizArea = document.getElementById("quizArea");
const termDisplay = document.getElementById("termDisplay");
const answersContainer = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("nextButton");

const endScreen = document.getElementById("endScreen");
const finalScoreText = document.getElementById("finalScoreText");
const finalStars = document.getElementById("finalStars");
const restartButton = document.getElementById("restartButton");

let currentChapterItems = [];
let remainingQuestions = [];
let currentQuestion = null;
let answered = false;

let scoreCorrect = 0;
let scoreTotal = 0;

const scoreCorrectEl = document.getElementById("scoreCorrect");
const scoreTotalEl = document.getElementById("scoreTotal");
const scoreStarsEl = document.getElementById("scoreStars");
const questionCurrentEl = document.getElementById("questionCurrent");
const questionTotalEl = document.getElementById("questionTotal");


// ===== HULPFUNCTIES =====

function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getStarsText() {
  if (scoreTotal === 0) {
    return "☆☆☆☆☆";
  }

  const percent = scoreCorrect / scoreTotal;

  let stars = 0;

  if (percent >= 0.9) stars = 5;
  else if (percent >= 0.75) stars = 4;
  else if (percent >= 0.6) stars = 3;
  else if (percent >= 0.4) stars = 2;
  else if (percent >= 0.2) stars = 1;
  else stars = 0;

  return "★★★★★".slice(0, stars) + "☆☆☆☆☆".slice(0, 5 - stars);
}

function updateScoreDisplay() {
  scoreCorrectEl.textContent = scoreCorrect;
  scoreTotalEl.textContent = scoreTotal;
  scoreStarsEl.textContent = getStarsText();

  questionCurrentEl.textContent = scoreTotal;
  questionTotalEl.textContent = currentChapterItems.length;
}

function showEndScreen() {
  answersContainer.innerHTML = "";
  feedback.textContent = "";
  nextButton.classList.add("hidden");

  finalScoreText.textContent = `${scoreCorrect} / ${scoreTotal}`;
  finalStars.textContent = getStarsText();

  endScreen.classList.remove("hidden");
}

// ===== HOOFDSTUKKEN LADEN =====

function loadChapters() {
  const chapterNames = Object.keys(chapters);

  chapterNames.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    chapterSelect.appendChild(option);
  });
}


// ===== VRAAG OPBOUWEN =====

function buildQuestion() {
  feedback.textContent = "";
  answersContainer.innerHTML = "";
  nextButton.classList.add("hidden");
  answered = false;

if (remainingQuestions.length === 0) {
  showEndScreen();
  return;
}



const correctItem = remainingQuestions.pop();
  const wrongDescriptions = currentChapterItems
    .filter((item) => item.term !== correctItem.term)
    .map((item) => item.description);

  const shuffledWrongDescriptions = shuffleArray(wrongDescriptions).slice(0, 3);

  const options = shuffleArray([
    {
      text: correctItem.description,
      isCorrect: true
    },
    ...shuffledWrongDescriptions.map((description) => ({
      text: description,
      isCorrect: false
    }))
  ]);

  currentQuestion = {
    term: correctItem.term,
    correctDescription: correctItem.description,
    options: options
  };

  renderQuestion();
}


// ===== VRAAG TONEN =====

function renderQuestion() {
  termDisplay.textContent = currentQuestion.term;

  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = option.text;

    button.addEventListener("click", () => handleAnswer(button, option));

    answersContainer.appendChild(button);
  });
}


// ===== ANTWOORD AFHANDELEN =====

function handleAnswer(clickedButton, selectedOption) {
  if (answered) {
    return;
  }

  answered = true;

  const allButtons = document.querySelectorAll(".answer");

  allButtons.forEach((button, index) => {
    const option = currentQuestion.options[index];

    button.disabled = true;

    if (option.isCorrect) {
      button.classList.add("correct");
    }
  });

 scoreTotal++;

if (selectedOption.isCorrect) {
  scoreCorrect++;
  feedback.textContent = "Goed.";
} else {
  clickedButton.classList.add("wrong");
  feedback.textContent = "Fout.";
}

updateScoreDisplay();

  nextButton.classList.remove("hidden");
}


// ===== QUIZ STARTEN =====

startButton.addEventListener("click", () => {
  const selectedChapter = chapterSelect.value;

  if (!selectedChapter) {
    alert("Kies eerst een hoofdstuk");
    return;
  }

currentChapterItems = chapters[selectedChapter];

if (!currentChapterItems || currentChapterItems.length < 4) {
  alert("Dit hoofdstuk heeft minimaal 4 begrippen nodig.");
  return;
}

remainingQuestions = shuffleArray([...currentChapterItems]);
scoreCorrect = 0;
scoreTotal = 0;
updateScoreDisplay();

endScreen.classList.add("hidden");
quizArea.classList.remove("hidden");
buildQuestion();
});


// ===== VOLGENDE VRAAG =====

nextButton.addEventListener("click", () => {
  buildQuestion();
});


// ===== INIT =====
restartButton.addEventListener("click", () => {
  remainingQuestions = shuffleArray([...currentChapterItems]);
  scoreCorrect = 0;
  scoreTotal = 0;
  updateScoreDisplay();

  endScreen.classList.add("hidden");
  buildQuestion();
});
loadChapters();
