/*********************************
 * SAHAL JAMB PRACTICE – SIGNUP
 *********************************/

const signupForm = document.getElementById("signup-form");
const subjectContainer = document.getElementById("subject-checkboxes");

/* ===== LOAD SUBJECTS DYNAMICALLY ===== */
async function loadSubjects() {
  try {
    const res = await fetch("/api/subjects");
    if (!res.ok) throw new Error("Failed to fetch subjects");
    const subjects = await res.json();

    subjectContainer.innerHTML = "";
    subjects.forEach((subject) => {
      const label = document.createElement("label");
      label.className = "subject-label";

      label.innerHTML = `
        <input type="checkbox" name="subject" value="${subject}">
        <span>${subject}</span>
      `;

      subjectContainer.appendChild(label);
    });
  } catch (err) {
    console.error(err);
    alert("Error loading subjects. Please refresh the page.");
  }
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

  if (subjects.length === 0) {
    alert("Please select at least one subject.");
    return;
  }

  if (subjects.length > 4) {
    alert("Please select a maximum of 4 subjects.");
    return;
  }

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, password, licenseCode, subjects }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    // Save JWT and user info in localStorage
    localStorage.setItem("jambToken", data.token);
    localStorage.setItem("jambUser", JSON.stringify({ fullname, subjects }));

    alert("Signup successful! Redirecting to practice page...");
    window.location.href = "practice.html";
  } catch (err) {
    console.error(err);
    alert("An error occurred during signup. Please try again.");
  }
});

/* ===== INIT ===== */
loadSubjects();
