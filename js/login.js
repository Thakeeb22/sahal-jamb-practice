document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // STOP refresh

    const fullname = document.getElementById("fullname").value.trim();
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("jambUsers")) || [];

    const user = users.find(
      (u) => u.fullname === fullname && u.password === password,
    );

    if (!user) {
      alert("Invalid login details");
      return;
    }

    // Save active user
    localStorage.setItem("jambUser", JSON.stringify(user));

    // Redirect
    window.location.href = "practice.html";
  });
});
