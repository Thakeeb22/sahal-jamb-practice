const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  const subjects = Array.from(
    document.querySelectorAll("input[name='subject']:checked"),
  ).map((input) => input.value);

  if (!fullname || !password || !confirmPassword) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (subjects.length === 0) {
    alert("Please select at least one subject.");
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

  alert("Signup successful! Redirecting to login page...");
  window.location.href = "index.html";
});
