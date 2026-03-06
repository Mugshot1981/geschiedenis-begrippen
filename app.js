// ===== ELEMENTEN =====

const chapterSelect = document.getElementById("chapterSelect");
const startButton = document.getElementById("startButton");
const quizArea = document.getElementById("quizArea");
const termDisplay = document.getElementById("termDisplay");
const answersContainer = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("nextButton");

let currentChapterItems = [];
let currentQuestion = null;
let answered = false;


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

  const correctItem = getRandomItem(currentChapterItems);

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

  if (selectedOption.isCorrect) {
    feedback.textContent = "Goed.";
  } else {
    clickedButton.classList.add("wrong");
    feedback.textContent = "Fout.";
  }

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

  quizArea.classList.remove("hidden");
  buildQuestion();
});


// ===== VOLGENDE VRAAG =====

nextButton.addEventListener("click", () => {
  buildQuestion();
});


// ===== INIT =====

loadChapters();
