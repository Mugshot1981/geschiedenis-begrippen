
// ===== ELEMENTEN =====

const chapterSelect = document.getElementById("chapterSelect");
const startButton = document.getElementById("startButton");
const quizArea = document.getElementById("quizArea");


// ===== HOOFDSTUKKEN LADEN =====

function loadChapters() {

  const chapterNames = Object.keys(chapters);

  chapterNames.forEach(name => {

    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;

    chapterSelect.appendChild(option);

  });

}


// ===== START QUIZ =====

startButton.addEventListener("click", () => {

  const selected = chapterSelect.value;

  if(!selected){
    alert("Kies eerst een hoofdstuk");
    return;
  }

  quizArea.classList.remove("hidden");

});


// ===== INIT =====

loadChapters();
