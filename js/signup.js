/*********************************
 * SAHAL JAMB PRACTICE – SIGNUP
 *********************************/

// Get the container for subject checkboxes
const subjectContainer = document.getElementById("subject-checkboxes");

// Function to load available subjects dynamically
async function loadAvailableSubjects() {
  try {
    // Assuming all subject JSON files are in ./data/
    const files = await fetch("./data/subjects.json").then((res) => res.json());

    // Example format: ["Mathematics", "English", "Biology", ...]
    const availableSubjects = files;

    subjectContainer.innerHTML = "";

    availableSubjects.forEach((subject) => {
      const label = document.createElement("label");
      label.className = "subject-label";

      label.innerHTML = `
        <input type="checkbox" name="subject" value="${subject}">
        <span>${subject}</span>
      `;
      subjectContainer.appendChild(label);
    });
  } catch (error) {
    console.error("Error loading subjects:", error);
    alert("Error loading subjects. Please refresh the page.");
  }
}

// Call function to populate subjects
loadAvailableSubjects();

/* ===== SIGNUP FORM ===== */
const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const password = document.getElementById("password").value;
  const licenseCode = document.getElementById("license-code").value.trim();

  const subjects = Array.from(
    document.querySelectorAll("input[name='subject']:checked"),
  ).map((input) => input.value);

  if (!fullname || !password || !licenseCode) {
    alert("Please fill all fields.");
    return;
  }

  if (subjects.length === 0) {
    alert("Please select at least one subject.");
    return;
  }

  if (subjects.length > 4) {
    alert("Please select a maximum of 4 subjects.");
    return;
  }

  // Save current user for the quiz
  const newUser = { fullname, password, licenseCode, subjects };
  localStorage.setItem("jambUser", JSON.stringify(newUser));

  alert("Signup successful! Redirecting to practice page...");
  window.location.href = "practice.html";
});
