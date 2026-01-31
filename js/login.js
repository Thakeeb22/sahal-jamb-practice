// login.js
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const password = document.getElementById("password").value;

    if (!fullname || !password) {
      alert("Please enter both fullname and password");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save JWT + minimal info
      localStorage.setItem(
        "jambSession",
        JSON.stringify({
          token: data.token,
          fullname: data.fullname,
          subjects: data.subjects || [],
        }),
      );

      alert("Login successful! Redirecting to practice page...");
      window.location.href = "practice.html";
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });
});
