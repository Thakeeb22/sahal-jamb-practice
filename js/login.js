// login.js
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

  // Pre-fill fullname if offline profile exists
  const storedProfile = JSON.parse(localStorage.getItem("jambProfile"));
  if (storedProfile) {
    document.getElementById("fullname").value = storedProfile.fullname;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const password = document.getElementById("password").value;

    if (!fullname || !password) {
      alert("Please enter both fullname and password");
      return;
    }

    const spinner = document.getElementById("login-spinner");
    spinner.style.display = "block";

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

      // --- Save profile offline (keep subjects consistent) ---
      localStorage.setItem(
        "jambProfile",
        JSON.stringify({ fullname, subjects: data.subjects || [] })
      );

      // --- Save JWT separately ---
      localStorage.setItem("jambToken", data.token);

      alert("Login successful! Redirecting to practice page...");
      window.location.href = "practice.html";
    } catch (err) {
      console.warn("Login failed or offline:", err.message);

      // --- Offline fallback ---
      const storedProfile = JSON.parse(localStorage.getItem("jambProfile"));
      if (storedProfile && storedProfile.fullname === fullname) {
        alert("Offline login successful! Redirecting to practice page...");
        window.location.href = "practice.html";
      } else {
        alert(
          "Cannot login offline. Connect to the internet at least once before."
        );
      }
    } finally {
      spinner.style.display = "none";
    }
  });
});
