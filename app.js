// ===== ELEMENTEN =====

const chapterSelect = document.getElementById("chapterSelect");
const chapterTileGrid = document.getElementById("chapterTileGrid");
const startButton = document.getElementById("startButton");
const quizArea = document.getElementById("quizArea");
const termDisplay = document.getElementById("termDisplay");
const questionLabel = document.getElementById("questionLabel");
const answersContainer = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("nextButton");
const stopButton = document.getElementById("stopButton");
const quizSessionTitle = document.getElementById("quizSessionTitle");
const quizSessionMode = document.getElementById("quizSessionMode");

const endScreen = document.getElementById("endScreen");
const wrongCountText = document.getElementById("wrongCountText");
const finalScoreText = document.getElementById("finalScoreText");
const finalStars = document.getElementById("finalStars");
const restartButton = document.getElementById("restartButton");
const retryWrongButton = document.getElementById("retryWrongButton");
const modeSelect = document.getElementById("modeSelect");

const scoreCorrectEl = document.getElementById("scoreCorrect");
const scoreTotalEl = document.getElementById("scoreTotal");
const starsFill = document.getElementById("starsFill");

const questionNumberEl = document.getElementById("questionNumber");
const questionTotalEl = document.getElementById("questionTotal");
const progressFill = document.getElementById("progressFill");


// ===== STATUS =====

let currentChapterIds = [];
let currentChapterItems = [];
let remainingQuestions = [];
let currentQuestion = null;
let answered = false;


let scoreCorrect = 0;
let scoreTotal = 0;

// Fouten-trainer (alleen huidige sessie, geen opslag)
let wrongItems = [];

// quizmodi:
// "term-to-answer" = begrip -> kies beschrijving
// "answer-to-term" = beschrijving -> kies begrip
let quizMode = "answer-to-term";

// ===== HULPFUNCTIES =====
function getTileTitle(title) {

  let cleaned = title;

  // "Hoofdstuk X – " verwijderen
  cleaned = cleaned.replace(/^Hoofdstuk\s+\d+\s+–\s+/i, "");

  // jaartallen verwijderen
  cleaned = cleaned.replace(/\d{4}\s*-\s*\d{4}/g, "");
  cleaned = cleaned.replace(/\d{4}\s*-\s*nu/g, "");

  // "en dekolonisatie" inkorten
  cleaned = cleaned.replace(/\sen\sdekolonisatie/i, "");

  // spaties opschonen
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

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

  if (scoreCorrectEl) scoreCorrectEl.textContent = scoreCorrect;
  if (scoreTotalEl) scoreTotalEl.textContent = scoreTotal;

  const totalQuestions = currentChapterItems.length || 1;

  // sterren progress
  const starProgress = scoreCorrect / totalQuestions;
  if (starsFill) starsFill.style.width = `${starProgress * 100}%`;

  // vraagnummer
  if (questionNumberEl) questionNumberEl.textContent = scoreTotal;
  if (questionTotalEl) questionTotalEl.textContent = totalQuestions;

  // progressbar
  const percent = scoreTotal / totalQuestions;
  if (progressFill) progressFill.style.width = `${percent * 100}%`;

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

function getItemsForChapters(chapterIds) {

  // JAARTALLEN QUIZES
  if (quizMode === "years" || quizMode === "event-years") {

    return historyYears
      .filter(item => chapterIds.includes(item.chapterId))
      .map(item => ({
        id: item.id,
        chapterId: item.chapterId,
        prompt: item.year,
        answer: item.event
      }));

  }

  // NORMALE BEGRIPPEN QUIZ
  return items.filter((item) => {
    return chapterIds.includes(item.chapterId) && item.type === "begrip";
  });

}


// ===== HOOFDSTUKKEN LADEN =====

function syncChapterTilesFromSelect() {
  const selectedIds = Array.from(chapterSelect.selectedOptions).map(
    (option) => option.value
  );

  Array.from(chapterTileGrid.children).forEach((tile) => {
    tile.classList.toggle("selected", selectedIds.includes(tile.dataset.chapterId));
  });
}

function loadChapters() {
  chapterSelect.innerHTML = "";
  chapterTileGrid.innerHTML = "";

  chapters.forEach((chapter) => {
    const option = document.createElement("option");
    option.value = chapter.id;
    option.textContent = chapter.title;
    chapterSelect.appendChild(option);

    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "chapter-tile";
    tile.dataset.chapterId = chapter.id;
    tile.textContent = getTileTitle(chapter.title);

    tile.addEventListener("click", () => {
      const optionToToggle = Array.from(chapterSelect.options).find(
        (option) => option.value === chapter.id
      );

      if (!optionToToggle) return;

      optionToToggle.selected = !optionToToggle.selected;
      syncChapterTilesFromSelect();
    });

    chapterTileGrid.appendChild(tile);
  });

  syncChapterTilesFromSelect();
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

  let questionText = "";
  let correctOptionText = "";
  let wrongOptionPool = [];
if (questionLabel) {
  if (quizMode === "term-to-answer") questionLabel.textContent = "Begrip";
  else if (quizMode === "answer-to-term") questionLabel.textContent = "Beschrijving";
  else if (quizMode === "years") questionLabel.textContent = "Jaartal";
  else if (quizMode === "event-years") questionLabel.textContent = "Gebeurtenis";
}
 if (quizMode === "term-to-answer") {

  questionText = correctItem.prompt;
  correctOptionText = correctItem.answer;

  wrongOptionPool = currentChapterItems
    .filter((item) => item.id !== correctItem.id)
    .map((item) => item.answer);

}
else if (quizMode === "answer-to-term") {

  questionText = correctItem.answer;
  correctOptionText = correctItem.prompt;

  wrongOptionPool = currentChapterItems
    .filter((item) => item.id !== correctItem.id)
    .map((item) => item.prompt);

}
else if (quizMode === "years") {

  questionText = correctItem.prompt;     // jaartal
  correctOptionText = correctItem.answer; // gebeurtenis

  wrongOptionPool = currentChapterItems
    .filter((item) => item.id !== correctItem.id)
    .map((item) => item.answer);

}
else if (quizMode === "event-years") {

  questionText = correctItem.answer;      // gebeurtenis
  correctOptionText = correctItem.prompt; // jaartal

  wrongOptionPool = [...new Set(
    historyYears.map((item) => item.year)
  )].filter((year) => year !== correctOptionText);

}
  const uniqueWrongOptions = [...new Set(wrongOptionPool)];
  const shuffledWrongOptions = shuffleArray(uniqueWrongOptions).slice(0, 3);

  const options = shuffleArray([
    {
      text: correctOptionText,
      isCorrect: true
    },
    ...shuffledWrongOptions.map((optionText) => ({
      text: optionText,
      isCorrect: false
    }))
  ]);

  currentQuestion = {
    id: correctItem.id,
    prompt: questionText,
    answer: correctItem.answer,
    correctTerm: correctItem.prompt,
    correctAnswer: correctItem.answer,
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
  const selectedChapterIds = Array.from(chapterSelect.selectedOptions).map(
    (option) => option.value
  );

  if (selectedChapterIds.length === 0) {
    alert("Kies eerst één of meer hoofdstukken");
    return;
  }

  currentChapterIds = selectedChapterIds;
  quizMode = modeSelect.value;
  currentChapterItems = getItemsForChapters(currentChapterIds);

  const selectedChapters = chapters.filter((chapter) =>
    currentChapterIds.includes(chapter.id)
  );

  quizSessionTitle.textContent =
    selectedChapters.length === 1
      ? selectedChapters[0].title
      : `${selectedChapters.length} hoofdstukken geselecteerd`;

if (quizMode === "term-to-answer") {
  quizSessionMode.textContent = "Begrip → beschrijving";
} else if (quizMode === "answer-to-term") {
  quizSessionMode.textContent = "Beschrijving → begrip";
} else if (quizMode === "years") {
  quizSessionMode.textContent = "Jaartal → gebeurtenis";
} else if (quizMode === "event-years") {
  quizSessionMode.textContent = "Gebeurtenis → jaartal";
}

 if (!currentChapterItems || currentChapterItems.length < 4) {
  alert("De selectie moet minimaal 4 vragen bevatten.");
  return;
}
  remainingQuestions = shuffleArray([...currentChapterItems]);
  scoreCorrect = 0;
  scoreTotal = 0;
  wrongItems = [];
  updateScoreDisplay();

  endScreen.classList.add("hidden");
  quizArea.classList.remove("hidden");
  document.body.classList.add("quiz-active");
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
    currentChapterItems = getItemsForChapters(currentChapterIds);
    remainingQuestions = shuffleArray([...currentChapterItems]);
    scoreCorrect = 0;
    scoreTotal = 0;
    wrongItems = [];
    updateScoreDisplay();

    endScreen.classList.add("hidden");
    buildQuestion();
  });
}

if (stopButton) {
  stopButton.addEventListener("click", () => {
    document.body.classList.remove("quiz-active");

    quizArea.classList.add("hidden");
    endScreen.classList.add("hidden");

    answersContainer.innerHTML = "";
    feedback.textContent = "";
    feedback.className = "feedback";
    feedback.style.display = "none";

    const backdrop = document.getElementById("feedbackBackdrop");
    if (backdrop) backdrop.remove();
  });
}

// ===== INIT =====

loadChapters();
updateScoreDisplay();
