/*********************************
 * SAHAL JAMB PRACTICE – SIGNUP
 *********************************/

const signupForm = document.getElementById("signup-form");
const subjectContainer = document.getElementById("subject-checkboxes");

/* ===== LOAD SUBJECTS FROM DATA FOLDER ===== */
async function loadSubjects() {
  const files = [
    "english.json",
    "mathematics.json",
    "biology.json",
    "chemistry.json",
    "physics.json",
    "government.json",
    "literature-in-english.json",
    "economics.json",
    "commerce.json",
    "principles_of_accounts.json",
  ];

  subjectContainer.innerHTML = "";

  files.forEach((file) => {
    const value = file.replace(".json", ""); // SAFE VALUE
    const labelText = value
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()); // Pretty label

    const label = document.createElement("label");
    label.className = "subject-label";
    label.innerHTML = `
      <input type="checkbox" name="subject" value="${value}">
      <span>${labelText}</span>
    `;
    subjectContainer.appendChild(label);
  });
}

/* ===== HANDLE SIGNUP ===== */
signupForm.addEventListener("submit", async (e) => {
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

  if (subjects.length === 0 || subjects.length > 4) {
    alert("Please select between 1 and 4 subjects.");
    return;
  }

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, password, licenseCode }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    // Save JWT and user info + selected subjects
    localStorage.setItem("jambUser", JSON.stringify({ fullname, subjects }));
    localStorage.setItem("jambToken", data.token);

    alert("Signup successful! Redirecting to practice page...");
    window.location.href = "practice.html";
  } catch (err) {
    console.error(err);
    alert("An error occurred during signup. Please try again.");
  }
});

/* ===== INIT ===== */
loadSubjects();
