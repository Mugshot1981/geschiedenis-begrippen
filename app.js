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

const scoreCorrectEl = document.getElementById("scoreCorrect");
const scoreTotalEl = document.getElementById("scoreTotal");
const scoreStarsEl = document.getElementById("scoreStars");

const questionNumberEl = document.getElementById("questionNumber");
const questionTotalEl = document.getElementById("questionTotal");
const progressFill = document.getElementById("progressFill");


// ===== STATUS =====

let currentChapterId = null;
let currentChapterItems = [];
let remainingQuestions = [];
let currentQuestion = null;
let answered = false;

let scoreCorrect = 0;
let scoreTotal = 0;

// Fouten-trainer (alleen huidige sessie, geen opslag)
let wrongItems = [];


// ===== HULPFUNCTIES =====

function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
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

  const totalQuestions = currentChapterItems.length || 0;
  questionNumberEl.textContent = scoreTotal;
  questionTotalEl.textContent = totalQuestions;

  const percent = totalQuestions > 0 ? (scoreTotal / totalQuestions) * 100 : 0;
  progressFill.style.width = `${percent}%`;
}

function showEndScreen() {
  answersContainer.innerHTML = "";
  feedback.textContent = "";
  nextButton.classList.add("hidden");

  finalScoreText.textContent = `${scoreCorrect} / ${scoreTotal}`;
  finalStars.textContent = getStarsText();

  endScreen.classList.remove("hidden");
}

function getItemsForChapter(chapterId) {
  return items.filter((item) => {
    return item.chapterId === chapterId && item.type === "begrip";
  });
}


// ===== HOOFDSTUKKEN LADEN =====

function loadChapters() {
  chapterSelect.innerHTML = '<option value="">-- Kies een hoofdstuk --</option>';

  chapters.forEach((chapter) => {
    const option = document.createElement("option");
    option.value = chapter.id;
    option.textContent = chapter.title;
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

  const wrongAnswers = currentChapterItems
    .filter((item) => item.id !== correctItem.id)
    .map((item) => item.answer);

  const uniqueWrongAnswers = [...new Set(wrongAnswers)];
  const shuffledWrongAnswers = shuffleArray(uniqueWrongAnswers).slice(0, 3);

  const options = shuffleArray([
    {
      text: correctItem.answer,
      isCorrect: true
    },
    ...shuffledWrongAnswers.map((answerText) => ({
      text: answerText,
      isCorrect: false
    }))
  ]);

  currentQuestion = {
    id: correctItem.id,
    prompt: correctItem.prompt,
    answer: correctItem.answer,
    options: options
  };

  renderQuestion();
}


// ===== VRAAG TONEN =====

function renderQuestion() {
  termDisplay.textContent = currentQuestion.prompt;

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
  scoreTotal++;

  const allButtons = document.querySelectorAll(".answer");

  allButtons.forEach((button, index) => {
    const option = currentQuestion.options[index];

    button.disabled = true;

    if (option.isCorrect) {
      button.classList.add("correct");
    }
  });

  if (selectedOption.isCorrect) {
    scoreCorrect++;
    feedback.textContent = "Goed.";
  } else {
    clickedButton.classList.add("wrong");
    feedback.textContent = "Fout.";

    const wrongItem = currentChapterItems.find((item) => item.id === currentQuestion.id);

    if (wrongItem && !wrongItems.some((item) => item.id === wrongItem.id)) {
      wrongItems.push(wrongItem);
    }
  }

  updateScoreDisplay();
  nextButton.classList.remove("hidden");
}


// ===== QUIZ STARTEN =====

startButton.addEventListener("click", () => {
  const selectedChapterId = chapterSelect.value;

  if (!selectedChapterId) {
    alert("Kies eerst een hoofdstuk");
    return;
  }

  currentChapterId = selectedChapterId;
  currentChapterItems = getItemsForChapter(currentChapterId);

  if (!currentChapterItems || currentChapterItems.length < 4) {
    alert("Dit hoofdstuk heeft minimaal 4 begrippen nodig.");
    return;
  }

   remainingQuestions = shuffleArray([...currentChapterItems]);
  scoreCorrect = 0;
  scoreTotal = 0;
  wrongItems = [];
  updateScoreDisplay();

  endScreen.classList.add("hidden");
  quizArea.classList.remove("hidden");
  buildQuestion();
});


// ===== VOLGENDE VRAAG =====

nextButton.addEventListener("click", () => {
  buildQuestion();
});


// ===== OPNIEUW OEFENEN =====

if (restartButton) {
  restartButton.addEventListener("click", () => {
    currentChapterItems = getItemsForChapter(currentChapterId);
    remainingQuestions = shuffleArray([...currentChapterItems]);
    scoreCorrect = 0;
    scoreTotal = 0;
    updateScoreDisplay();

    endScreen.classList.add("hidden");
    buildQuestion();
  });
}


// ===== INIT =====

loadChapters();
updateScoreDisplay();
