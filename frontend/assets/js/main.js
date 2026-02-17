// assets/js/main.js

// ===== Helper: API base URL =====
// Updated to match backend server running on port 3000
const API_BASE = "http://localhost:3001/api";

// ===== Signup =====
async function signupUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  // backend exposes registration at /api/auth/register
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await res.json();
  alert(data.message || "Signup complete!");
  if (res.ok) window.location.href = "login.html";
}

// ===== Login =====
async function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    // Store complete user data and token
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    alert("Login successful!");

    if (data.user.role === "owner") {
      window.location.href = "owner-dashboard.html";
    } else if (data.user.role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "dashboard.html";
    }
  } else {
    alert(data.message || "Invalid login");
  }
}

// ===== Logout =====
function logoutUser() {
  localStorage.clear();
  window.location.href = "login.html";
}
