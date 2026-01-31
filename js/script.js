/*********************************
 * SAHAL JAMB PRACTICE – CBT SERVERLESS
 *********************************/

let questions = {};
let subjects = [];
let currentSubjectIndex = 0;
let currentQuestionIndex = 0;
let answers = {};

/* ===== DOM ELEMENTS ===== */
const questionCountEl = document.getElementById("question-count");
const questionTextEl = document.getElementById("question-text");
const optionListEl = document.getElementById("option-list");
const paletteEl = document.getElementById("palette");
const tabContainer = document.getElementById("subject-tab");

/* ===== LOAD QUESTIONS FOR SELECTED SUBJECTS ===== */
async function loadAllQuestions() {
  const user = JSON.parse(localStorage.getItem("jambUser"));
  if (!user || !user.subjects) {
    alert("No subjects found for this user.");
    return;
  }

  subjects = user.subjects;
  console.log("Subjects:", subjects);

  for (const subject of subjects) {
    try {
      const res = await fetch(`/api/questions/${subject}`);
      if (!res.ok) throw new Error(`Cannot load ${subject}.json`);

      const data = await res.json();
      console.log(`${subject} raw data:`, data);

      const questionArray = Array.isArray(data) ? data : data.questions;

      if (!Array.isArray(questionArray)) {
        throw new Error("Invalid question format");
      }

      questions[subject] = questionArray.map((q) => ({
        question: q.question || q.q,
        options: Array.isArray(q.options)
          ? q.options
          : Object.values(q.options),
        answer: q.answer,
      }));
    } catch (err) {
      console.error(err);
      questions[subject] = [];
    }
  }

  subjects.forEach((subject) => {
    answers[subject] = new Array(questions[subject].length).fill(null);
  });

  createSubjectTabs();
  loadQuestion();
}

/* ===== CREATE SUBJECT TABS ===== */
function createSubjectTabs() {
  tabContainer.innerHTML = "";
  subjects.forEach((subject, i) => {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.textContent = subject;
    btn.onclick = () => {
      currentSubjectIndex = i;
      currentQuestionIndex = 0;
      loadQuestion();
      updateActiveTab();
    };
    tabContainer.appendChild(btn);
  });
  updateActiveTab();
}

/* ===== LOAD QUESTION ===== */
function loadQuestion() {
  const subject = subjects[currentSubjectIndex];
  const q = questions[subject][currentQuestionIndex];

  if (!q) {
    questionTextEl.textContent = "No question found.";
    optionListEl.innerHTML = "";
    return;
  }

  questionCountEl.textContent = `Question ${currentQuestionIndex + 1} of ${questions[subject].length}`;
  questionTextEl.textContent = q.question;
  optionListEl.innerHTML = "";

  q.options.forEach((opt, i) => {
    const label = document.createElement("label");
    label.className = "options";
    label.innerHTML = `
      <input type="radio" name="option"
        ${answers[subject][currentQuestionIndex] === opt ? "checked" : ""}>
      <span class="indicator">${String.fromCharCode(65 + i)}</span>
      <span class="text">${opt}</span>
    `;
    label.onclick = () => {
      answers[subject][currentQuestionIndex] = opt;
      updatePalette();
    };
    optionListEl.appendChild(label);
  });

  updatePalette();
  console.log(
    "Current subject:",
    subjects[currentSubjectIndex],
    "Questions:",
    questions[subjects[currentSubjectIndex]],
  );
}

/* ===== QUESTION PALETTE ===== */
function updatePalette() {
  const subject = subjects[currentSubjectIndex];
  paletteEl.innerHTML = "";

  questions[subject].forEach((_, i) => {
    const box = document.createElement("div");
    box.className = "box";
    if (answers[subject][i] !== null) box.classList.add("answered");
    if (i === currentQuestionIndex) box.classList.add("current");
    box.onclick = () => {
      currentQuestionIndex = i;
      loadQuestion();
    };
    paletteEl.appendChild(box);
  });
}

/* ===== NAVIGATION ===== */
document.querySelector(".btn-next").onclick = () => {
  const subject = subjects[currentSubjectIndex];
  if (currentQuestionIndex < questions[subject].length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  }
};
document.querySelector(".btn-prev").onclick = () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
};

/* ===== SUBJECT SWITCHING ===== */
function updateActiveTab() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab, i) => {
    tab.classList.remove("active");
    if (i === currentSubjectIndex) tab.classList.add("active");
  });
}

/* ===== TIMER (2 HOURS) ===== */
let timeLeft = 2 * 60 * 60;
const timerInterval = setInterval(() => {
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    submitExam();
  }
  timeLeft--;
  const h = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `${h}:${m}:${s}`;
}, 1000);

document.querySelector(".btn-submit").onclick = () => {
  if (
    confirm(
      "Are you sure you want to submit? You cannot change answers after submission.",
    )
  ) {
    submitExam();
  }
};

/* ===== SUBMIT ===== */
function submitExam() {
  clearInterval(timerInterval);

  const result = {};
  let totalScore = 0;

  subjects.forEach((subject) => {
    let score = 0;
    questions[subject].forEach((q, i) => {
      if (answers[subject][i] === q.answer) score++;
    });
    result[subject] = score;
    totalScore += score;
  });

  localStorage.setItem(
    "jambResult",
    JSON.stringify({ subjects: result, totalScore }),
  );
  window.location.href = "results.html";
}

/* ===== CALCULATOR ===== */
const calcModal = document.getElementById("calc-modal");
const calcDisplay = document.getElementById("calc-display");
const calcButtons = document.querySelectorAll(".calc-buttons button");
const calcOpenBtn = document.querySelector(".btn-calc");
const calcClose = document.querySelector(".close");

let currentInput = "";
calcOpenBtn.onclick = () => (calcModal.style.display = "flex");
calcClose.onclick = () => {
  calcModal.style.display = "none";
  currentInput = "";
  calcDisplay.value = "";
};
window.onclick = (e) => {
  if (e.target === calcModal) {
    calcModal.style.display = "none";
    currentInput = "";
    calcDisplay.value = "";
  }
};
calcButtons.forEach((btn) => {
  btn.onclick = () => {
    const val = btn.textContent;
    if (val === "C") currentInput = "";
    else if (val === "=") {
      try {
        currentInput = eval(currentInput).toString();
      } catch {
        currentInput = "Error";
      }
    } else currentInput += val;
    calcDisplay.value = currentInput;
  };
});

/* ===== INIT ===== */
loadAllQuestions();
