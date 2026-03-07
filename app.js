// ===== ELEMENTEN =====

const chapterSelect = document.getElementById("chapterSelect");
const startButton = document.getElementById("startButton");
const quizArea = document.getElementById("quizArea");
const termDisplay = document.getElementById("termDisplay");
const answersContainer = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("nextButton");

const endScreen = document.getElementById("endScreen");
const wrongCountText = document.getElementById("wrongCountText");
const finalScoreText = document.getElementById("finalScoreText");
const finalStars = document.getElementById("finalStars");
const restartButton = document.getElementById("restartButton");
const retryWrongButton = document.getElementById("retryWrongButton");


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
  feedback.className = "feedback";
  feedback.style.display = "none";
  nextButton.classList.add("hidden");

  finalScoreText.textContent = `${scoreCorrect} / ${scoreTotal}`;
  finalStars.textContent = getStarsText();

  if (wrongItems.length > 0) {
    wrongCountText.textContent = `Je had ${wrongItems.length} fout${wrongItems.length === 1 ? "" : "en"}.`;
    retryWrongButton.classList.remove("hidden");
  } else {
    wrongCountText.textContent = "Alles goed gemaakt.";
    retryWrongButton.classList.add("hidden");
  }

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
  feedback.className = "feedback";
  feedback.style.display = "none";
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

  allButtons.forEach((button) => {
    button.disabled = true;
  });

   if (selectedOption.isCorrect) {
    clickedButton.classList.add("correct");
    scoreCorrect++;
    feedback.textContent = "GOED!";
    feedback.className = "feedback show good";
    feedback.style.display = "block";

    updateScoreDisplay();

    setTimeout(() => {
      buildQuestion();
    }, 700);

  } else {
    clickedButton.classList.add("wrong");

    allButtons.forEach((button, index) => {
      const option = currentQuestion.options[index];
      if (option.isCorrect) {
        button.classList.add("correct");
      }
    });

feedback.innerHTML = `
  <div class="feedback-title">FOUT</div>
  <div class="feedback-term">${currentQuestion.prompt}</div>
  <div class="feedback-answer-box">${currentQuestion.answer}</div>
  <button id="feedbackContinueButton" class="feedback-continue-button">Verder</button>
`;
    feedback.className = "feedback show bad";
feedback.style.display = "block";

// backdrop toevoegen
const backdrop = document.createElement("div");
backdrop.className = "modal-backdrop";
backdrop.id = "feedbackBackdrop";
document.body.appendChild(backdrop);
    feedback.style.display = "block";

    const wrongItem = currentChapterItems.find((item) => item.id === currentQuestion.id);

    if (wrongItem && !wrongItems.some((item) => item.id === wrongItem.id)) {
      wrongItems.push(wrongItem);
    }

    updateScoreDisplay();
  }
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

// ===== VERDER-KNOP IN FOUTPOPUP =====

feedback.addEventListener("click", (event) => {
  if (event.target && event.target.id === "feedbackContinueButton") {
  document.body.classList.remove("blur-background");
  // backdrop verwijderen
const backdrop = document.getElementById("feedbackBackdrop");
if (backdrop) backdrop.remove();

buildQuestion();
}
});


// ===== FOUTEN OPNIEUW OEFENEN =====

if (retryWrongButton) {
  retryWrongButton.addEventListener("click", () => {
    currentChapterItems = [...wrongItems];
    remainingQuestions = shuffleArray([...wrongItems]);
    scoreCorrect = 0;
    scoreTotal = 0;
    wrongItems = [];
    updateScoreDisplay();

    endScreen.classList.add("hidden");
    buildQuestion();
  });
}

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
