/*
KennisSprint dataset
© Joas de Wit
2026
*/
import { courseCatalog, activeCourse } from "./data.js";

const supabase = window.supabaseClient;

async function requireAuth() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    window.location.href = "login.html";
    return null;
  }

  return data.user;
}

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



const pageHeading = document.getElementById("pageHeading");
const pageIntro = document.getElementById("pageIntro");

const subjectSelect = document.getElementById("subjectSelect");
const levelSelect = document.getElementById("levelSelect");
const gradeSelect = document.getElementById("gradeSelect");

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

function getCourseTerms(course) {
  if (course?.datasets?.terms) return course.datasets.terms;
  return course?.items || [];
}

function getCourseYears(course) {
  if (course?.datasets?.years) return course.datasets.years;
  return course?.years || [];
}

function getModeConfig(modeId) {
  const courseMode = activeCourse?.modes?.find((mode) => mode.id === modeId);

  if (courseMode) {
    return {
      questionLabel: courseMode.questionLabel || "Vraag",
      sessionModeLabel: courseMode.sessionModeLabel || courseMode.label || modeId,
      questionField: courseMode.questionField,
      answerField: courseMode.answerField,
      dataset: courseMode.dataset
    };
  }

  const fallbackConfigs = {
    "term-to-answer": {
      questionLabel: "Begrip",
      sessionModeLabel: "Begrip → beschrijving",
      questionField: "prompt",
      answerField: "answer",
      dataset: "terms"
    },
    "answer-to-term": {
      questionLabel: "Beschrijving",
      sessionModeLabel: "Beschrijving → begrip",
      questionField: "answer",
      answerField: "prompt",
      dataset: "terms"
    },
    "years": {
      questionLabel: "Jaartal",
      sessionModeLabel: "Jaartal → gebeurtenis",
      questionField: "prompt",
      answerField: "answer",
      dataset: "years"
    },
    "event-years": {
      questionLabel: "Gebeurtenis",
      sessionModeLabel: "Gebeurtenis → jaartal",
      questionField: "answer",
      answerField: "prompt",
      dataset: "years"
    },
    "person-to-description": {
      questionLabel: "Persoon",
      sessionModeLabel: "Persoon → beschrijving",
      questionField: "name",
      answerField: "description",
      dataset: "persons"
    },
    "description-to-person": {
      questionLabel: "Beschrijving",
      sessionModeLabel: "Beschrijving → persoon",
      questionField: "description",
      answerField: "name",
      dataset: "persons"
    }
  };

  return fallbackConfigs[modeId] || {
    questionLabel: "Vraag",
    sessionModeLabel: modeId,
    questionField: "prompt",
    answerField: "answer",
    dataset: "terms"
  };
}
function getQuestionParts(correctItem, quizMode, currentChapterItems) {
  const config = getModeConfig(quizMode);

  const questionField = config.questionField || "prompt";
  const answerField = config.answerField || "answer";

  const questionText = correctItem[questionField];
  const correctOptionText = correctItem[answerField];

  const wrongOptionPool = currentChapterItems
    .filter((item) => item.id !== correctItem.id)
    .map((item) => item[answerField])
    .filter((value) => value !== undefined && value !== correctOptionText);

  return {
    questionText,
    correctOptionText,
    wrongOptionPool
  };
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
  const activeMode = activeCourse.modes.find((mode) => mode.id === quizMode);

  if (!activeMode) {
    return [];
  }

  const datasetName = activeMode.dataset;
  const dataset = activeCourse.datasets?.[datasetName] || [];

  if (datasetName === "years") {
    return dataset
      .filter((item) => chapterIds.includes(item.chapterId))
      .map((item) => ({
        id: item.id,
        chapterId: item.chapterId,
        prompt: item.year,
        answer: item.event
      }));
  }

  if (datasetName === "terms") {
    return dataset.filter((item) => {
      return chapterIds.includes(item.chapterId) && item.type === "begrip";
    });
  }

  return dataset.filter((item) => chapterIds.includes(item.chapterId));
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

activeCourse.chapters.forEach((chapter) => {
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
  chapterSelect.dispatchEvent(new Event("change"));
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

   if (questionLabel) {
    questionLabel.textContent = getModeConfig(quizMode).questionLabel;
  }

  const {
    questionText,
    correctOptionText,
    wrongOptionPool
  } = getQuestionParts(correctItem, quizMode, currentChapterItems);
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

function updateStartButtonState() {
  if (!startButton) return;

  const selectedChapterIds = Array.from(chapterSelect.selectedOptions).map(
    (option) => option.value
  );

  if (selectedChapterIds.length === 0) {
    startButton.disabled = false;
    startButton.textContent = "Start oefenen";
    return;
  }

  const currentModeId = modeSelect ? modeSelect.value : quizMode;
  const activeMode = activeCourse.modes.find((mode) => mode.id === currentModeId);

  if (!activeMode) {
    startButton.disabled = true;
    startButton.textContent = "Geen oefenvorm beschikbaar";
    return;
  }

  const datasetName = activeMode.dataset;
  const dataset = activeCourse.datasets?.[datasetName] || [];

  let questionCount = 0;

  if (datasetName === "terms") {
    questionCount = dataset.filter((item) => {
      return selectedChapterIds.includes(item.chapterId) && item.type === "begrip";
    }).length;
  } else {
    questionCount = dataset.filter((item) => {
      return selectedChapterIds.includes(item.chapterId);
    }).length;
  }

  if (questionCount < 4) {
    startButton.disabled = true;
    startButton.textContent = "Nog geen vragen beschikbaar";
    return;
  }

  startButton.disabled = false;
  startButton.textContent = "Start oefenen";
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

const selectedChapters = activeCourse.chapters.filter((chapter) =>
  currentChapterIds.includes(chapter.id)
);

  quizSessionTitle.textContent =
    selectedChapters.length === 1
      ? selectedChapters[0].title
      : `${selectedChapters.length} hoofdstukken geselecteerd`;

quizSessionMode.textContent = getModeConfig(quizMode).sessionModeLabel;

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

function applyActiveCourseToPage() {
  if (pageHeading) {
    pageHeading.textContent = activeCourse.title;
  }

  document.title = `${activeCourse.title} | KennisSprint`;

  if (pageIntro) {
    pageIntro.textContent = `Oefen ${activeCourse.subject} voor ${activeCourse.level} ${activeCourse.grade} per hoofdstuk met multiple choice.`;
  }
}

function getUniqueValues(key, courses = courseCatalog) {
  const values = courses.map((course) => course[key]);
  return [...new Set(values)];
}

function populateSelect(selectElement, values, selectedValue = "") {
  if (!selectElement) return;

  const placeholderText = selectElement.dataset.placeholder || "Kies";
  selectElement.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = placeholderText;
  selectElement.appendChild(placeholderOption);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;

    if (value === selectedValue) {
      option.selected = true;
    }

    selectElement.appendChild(option);
  });
}

function getCoursesBySubject(subject) {
  return courseCatalog.filter((course) => course.subject === subject);
}

function getCoursesBySubjectAndLevel(subject, level) {
  return courseCatalog.filter(
    (course) => course.subject === subject && course.level === level
  );
}

function findCourse(subject, level, grade) {
  return courseCatalog.find(
    (course) =>
      course.subject === subject &&
      course.level === level &&
      course.grade === grade
  );
}

function initCourseSelectors() {
  populateSelect(subjectSelect, getUniqueValues("subject"), activeCourse.subject);

  const coursesForSubject = getCoursesBySubject(activeCourse.subject);
  populateSelect(levelSelect, getUniqueValues("level", coursesForSubject), activeCourse.level);

  const coursesForSubjectAndLevel = getCoursesBySubjectAndLevel(
    activeCourse.subject,
    activeCourse.level
  );
  populateSelect(
    gradeSelect,
    getUniqueValues("grade", coursesForSubjectAndLevel),
    activeCourse.grade
  );
}

function refreshLevelSelect() {
  const selectedSubject = subjectSelect.value;
  const coursesForSubject = getCoursesBySubject(selectedSubject);
  const availableLevels = getUniqueValues("level", coursesForSubject);

  populateSelect(levelSelect, availableLevels);
  populateSelect(gradeSelect, []);
}

function refreshGradeSelect() {
  const selectedSubject = subjectSelect.value;
  const selectedLevel = levelSelect.value;

  if (!selectedSubject || !selectedLevel) {
    populateSelect(gradeSelect, []);
    return;
  }

  const coursesForSubjectAndLevel = getCoursesBySubjectAndLevel(
    selectedSubject,
    selectedLevel
  );
  const availableGrades = getUniqueValues("grade", coursesForSubjectAndLevel);

  populateSelect(gradeSelect, availableGrades);
}

function bindCourseSelectors() {
  if (subjectSelect) {
    subjectSelect.addEventListener("change", () => {
      refreshLevelSelect();
    });
  }

if (levelSelect) {
  levelSelect.addEventListener("change", () => {
    refreshGradeSelect();
  });
}

if (gradeSelect) {
  gradeSelect.addEventListener("change", () => {
    const subject = subjectSelect.value;
    const level = levelSelect.value;
    const grade = gradeSelect.value;

    if (!subject || !level || !grade) return;

    const course = findCourse(subject, level, grade);

    if (!course) return;

    const newUrl =
      window.location.pathname +
      "?course=" +
      encodeURIComponent(course.id);

    window.location.href = newUrl;
  });
}
}



function populateModeSelect() {
  if (!modeSelect) return;

  modeSelect.innerHTML = "";

  activeCourse.modes.forEach((mode) => {
    const option = document.createElement("option");
    option.value = mode.id;
    option.textContent = mode.label;
    modeSelect.appendChild(option);
  });
}

const currentUser = await requireAuth();

if (currentUser) {
  applyActiveCourseToPage();
  populateModeSelect();
  initCourseSelectors();
  bindCourseSelectors();
  loadChapters();
  updateScoreDisplay();
  updateStartButtonState();

  chapterSelect.addEventListener("change", updateStartButtonState);
  modeSelect.addEventListener("change", updateStartButtonState);
}
