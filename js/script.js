/*********************************
 * SAHAL JAMB PRACTICE – CBT MVP
 *********************************/

let questions = {};
let subjects = [];
let currentSubjectIndex = 0;
let currentQuestionIndex = 0;
let answers = {};

/* ===== DOM ===== */
const questionCountEl = document.getElementById("question-count");
const questionTextEl = document.getElementById("question-text");
const optionListEl = document.getElementById("option-list");
const paletteEl = document.getElementById("palette");

/* ===== LOAD QUESTIONS FROM JSON ===== */
fetch("./data/questions.json")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => {
      questions[item.subject] = item.questions;
    });

    const user = JSON.parse(localStorage.getItem("jambUser"));
    subjects = user.subjects; // selected subjects

    // INIT ANSWERS
    subjects.forEach((subject) => {
      answers[subject] = new Array(questions[subject].length).fill(null);
    });

    // CREATE SUBJECT TABS ✅ (INSIDE FETCH)
    const tabContainer = document.getElementById("subject-tab");
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

    loadQuestion();
  });

/* ===== LOAD QUESTION ===== */
function loadQuestion() {
  const subject = subjects[currentSubjectIndex];
  const q = questions[subject][currentQuestionIndex];

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
  if (
    currentQuestionIndex <
    questions[subjects[currentSubjectIndex]].length - 1
  ) {
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
    if (i === currentSubjectIndex) {
      tab.classList.add("active");
    }
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
  const confirmSubmit = confirm(
    "Are you sure you want to submit? You cannot change your answers after submission.",
  );

  if (confirmSubmit) {
    submitExam();
  }
};
function calculateScore() {
  let total = 0;

  subjects.forEach((subject) => {
    questions[subject].forEach((q, i) => {
      if (answers[subject][i] === q.answer) total++;
    });
  });

  return total;
}

/* ===== SUBMIT ===== */
function submitExam() {
  clearInterval(timerInterval);

  const result = {};
  let totalScore = 0;

  subjects.forEach((subject) => {
    let score = 0;

    questions[subject].forEach((q, i) => {
      if (answers[subject][i] === q.answer) {
        score++;
      }
    });

    result[subject] = score;
    totalScore += score;
  });

  // SAVE IN THE FORMAT RESULT PAGE EXPECTS
  localStorage.setItem(
    "jambResult",
    JSON.stringify({
      subjects: result,
      totalScore: totalScore,
    }),
  );

  window.location.href = "results.html";
}

/* ===== CALCULATOR ===== */
document.querySelector(".btn-calc").onclick = () => {
  alert("Calculator coming next.");
};
// Calculator Modal
const calcModal = document.getElementById("calc-modal");
const calcDisplay = document.getElementById("calc-display");
const calcButtons = document.querySelectorAll(".calc-buttons button");
const calcOpenBtn = document.querySelector(".btn-calc");
const calcClose = document.querySelector(".close");

let currentInput = "";

// Open modal
calcOpenBtn.onclick = () => {
  calcModal.style.display = "flex";
};

// Close modal
calcClose.onclick = () => {
  calcModal.style.display = "none";
  currentInput = "";
  calcDisplay.value = "";
};

// Click outside to close
window.onclick = (e) => {
  if (e.target === calcModal) {
    calcModal.style.display = "none";
    currentInput = "";
    calcDisplay.value = "";
  }
};

// Calculator logic
calcButtons.forEach((btn) => {
  btn.onclick = () => {
    const val = btn.textContent;

    if (val === "C") {
      currentInput = "";
    } else if (val === "=") {
      try {
        currentInput = eval(currentInput).toString();
      } catch {
        currentInput = "Error";
      }
    } else {
      currentInput += val;
    }

    calcDisplay.value = currentInput;
  };
});
