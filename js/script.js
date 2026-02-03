/*********************************
 * SAHAL JAMB PRACTICE – CBT SERVERLESS
 *********************************/
const EXAM_STATE_KEY = "jambExamState";

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
const passageContainer = document.getElementById("passage-container");
const passageTextEl = document.getElementById("passage-text");
const questionImageContainer = document.getElementById(
  "question-image-container",
);
const questionImageEl = document.getElementById("question-image");

/* ===== LOAD QUESTIONS FOR SELECTED SUBJECTS ===== */
async function loadAllQuestions() {
  const profile = JSON.parse(localStorage.getItem("jambProfile"));

  if (!profile || !profile.subjects || profile.subjects.length === 0) {
    alert("No subjects found. Please login again.");
    window.location.href = "login.html";
    return;
  }

  subjects = profile.subjects;

  for (const subject of subjects) {
    try {
      // 1️⃣ Check localStorage first
      let storedQuestions = localStorage.getItem(`questions-${subject}`);
      let questionArray;

      if (storedQuestions) {
        questionArray = JSON.parse(storedQuestions);
        console.log(`Loaded ${subject} questions from localStorage`);
      } else {
        // 2️⃣ Fetch from server / data folder
        const res = await fetch(`/data/${subject}.json`);
        if (!res.ok) throw new Error(`Cannot load ${subject}.json`);

        const data = await res.json();

        if (data.sections) {
          // ✅ ENGLISH STYLE (sections-based)
          questionArray = [];

          data.sections.forEach((section) => {
            section.questions.forEach((q) => {
              questionArray.push({
                ...q,
                section: section.section,
                instruction: section.instruction,
                passage: section.passage || null,
              });
            });
          });
        } else {
          // ✅ OTHER SUBJECTS (flat)
          questionArray = Array.isArray(data) ? data : data.questions;
        }

        // 3️⃣ Save to localStorage for offline use
        localStorage.setItem(
          `questions-${subject}`,
          JSON.stringify(questionArray),
        );
        console.log(`Fetched and saved ${subject} questions`);
      }

      // 4️⃣ Map questions as before
      questions[subject] = questionArray.map((q) => {
        const options = Array.isArray(q.options)
          ? q.options
          : Object.values(q.options);
        const answerKey = q.answer;
        const answerValue = Array.isArray(q.options)
          ? options[answerKey.charCodeAt(0) - 65]
          : q.options[answerKey];

        return {
          question: q.question || q.q,
          options: options,
          answer: answerValue,
          image: q.image,
          imageDescription: q.imageDescription,
          hasImage: q.hasImage,
          passage: q.passage,
          instruction: q.instruction,
        };
      });
    } catch (err) {
      console.error(err);
      questions[subject] = [];
    }
  }

  // Initialize answers array
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
      saveExamState();
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
  // ===== QUESTION TEXT LOGIC (JAMB SAFE) =====
  let questionText = "";

  if (q.question) {
    questionText = q.question;
  } else if (q.q) {
    questionText = q.q;
  } else if (!q.passage && q.instruction) {
    // English questions without passage use instruction as the question
    questionText = q.instruction;
  }

  questionTextEl.textContent = questionText;

  optionListEl.innerHTML = "";

  // Show image if hasImage is true
  if (q.hasImage) {
    questionImageEl.src = q.image;
    questionImageEl.alt = q.imageDescription || "Question Image";
    questionImageContainer.style.display = "block";
  } else {
    questionImageContainer.style.display = "none";
  }

  // ===== PASSAGE & INSTRUCTION (offline-safe) =====
  const storedQuestions = localStorage.getItem(`questions-${subject}`);
  let passage = q.passage || "";
  let instruction = q.instruction || "";

  if (storedQuestions) {
    const questionList = JSON.parse(storedQuestions);
    const currentQ = questionList[currentQuestionIndex];
    if (currentQ) {
      passage = currentQ.passage || passage;
      instruction = currentQ.instruction || instruction;
    }
  }

  if (passage) {
    passageContainer.style.display = "block";
    passageTextEl.textContent = passage;
  } else {
    passageContainer.style.display = "none";
  }
  if (instruction) {
    const instructionEl = document.getElementById("section-instruction");
    if (instructionEl) {
      instructionEl.textContent = instruction;
      instructionEl.style.display = instruction ? "block" : "none";
    }
  } else {
    const instructionEl = document.getElementById("section-instruction");
    if (instructionEl) instructionEl.style.display = "none";
  }

  // ===== LOAD OPTIONS =====
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
      saveExamState();
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
  const subject = subjects[currentSubjectIndex];
  if (currentQuestionIndex < questions[subject].length - 1) {
    currentQuestionIndex++;
    loadQuestion();
    saveExamState();
  }
};
document.querySelector(".btn-prev").onclick = () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
    saveExamState();
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
  localStorage.removeItem(EXAM_STATE_KEY);

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

function restoreExamState() {
  const saved = localStorage.getItem(EXAM_STATE_KEY);
  if (!saved) return false;

  try {
    const state = JSON.parse(saved);

    subjects = state.subjects;
    currentSubjectIndex = state.currentSubjectIndex;
    currentQuestionIndex = state.currentQuestionIndex;
    answers = state.answers;
    timeLeft = state.timeLeft;

    return true;
  } catch {
    return false;
  }
}

function saveExamState() {
  const state = {
    subjects,
    currentSubjectIndex,
    currentQuestionIndex,
    answers,
    timeLeft,
    timestamp: Date.now(),
  };

  localStorage.setItem(EXAM_STATE_KEY, JSON.stringify(state));
}

/* ===== INIT ===== */
(async function initExam() {
  await loadAllQuestions();

  const resumed = restoreExamState();

  if (resumed) {
    createSubjectTabs();
    loadQuestion();
  }
})();
