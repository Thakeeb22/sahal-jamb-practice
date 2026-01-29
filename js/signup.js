/* ===== LOAD SUBJECTS FROM JSON ===== */
fetch("../data/questions.json")
  .then((res) => res.json())
  .then((data) => {
    const subjectContainer = document.getElementById("subject-checkboxes");
    subjectContainer.innerHTML = "";

    data.forEach((item) => {
      const label = document.createElement("label");
      label.className = "subject-label";

      label.innerHTML = `
        <input type="checkbox" name="subject" value="${item.subject}">
        <span>${item.subject}</span>
      `;

      subjectContainer.appendChild(label);
    });
  })
  .catch((error) => {
    console.error("Error loading subjects:", error);
    alert("Error loading subjects. Please refresh the page.");
  });

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

  // Get existing users from localStorage
  let users = JSON.parse(localStorage.getItem("jambUsers") || "[]");

  // Check if user already exists
  const userExists = users.some((u) => u.fullname === fullname);
  if (userExists) {
    alert("User with this name already exists. Please choose another.");
    return;
  }

  // Create new user object
  const newUser = {
    fullname,
    password,
    subjects,
  };

  // Save to localStorage
  users.push(newUser);
  localStorage.setItem("jambUsers", JSON.stringify(users));

  // Also save current user for the quiz
  localStorage.setItem("jambUser", JSON.stringify(newUser));

  alert("Signup successful! Redirecting to practice page...");
  window.location.href = "practice.html";
});
