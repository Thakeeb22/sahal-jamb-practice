const resultData = JSON.parse(localStorage.getItem("jambResult"));
const container = document.getElementById("result-container");

if (!resultData || !resultData.subjects) {
  container.innerHTML = "<p>No result found.</p>";
} else {
  container.innerHTML = "";

  // ===== SUMMARY =====
  const summary = document.createElement("div");
  summary.className = "result-summary";
  summary.innerHTML = `
    <h3>Total Score: ${resultData.totalScore}</h3>
    <hr>
  `;
  container.appendChild(summary);

  // ===== SUBJECT BREAKDOWN =====
  Object.entries(resultData.subjects).forEach(([subject, score]) => {
    const div = document.createElement("div");
    div.className = "result-card";
    div.innerHTML = `
      <h3>${subject}</h3>
      <p>Score: <strong>${score}</strong></p>
    `;
    container.appendChild(div);
  });
}

// Sign out functionality
document.getElementById("signout-btn").addEventListener("click", () => {
  localStorage.removeItem("jambUser");
  localStorage.removeItem("jambResult");
  window.location.href = "index.html";
});
