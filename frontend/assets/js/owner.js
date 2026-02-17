// assets/js/owner.js

// Backend now runs on port 3000
const API_BASE = "http://localhost:3000/api";
const token = localStorage.getItem("token");

// ===== Fetch All Cameras =====
async function loadCameras() {
  const res = await fetch(`${API_BASE}/cameras/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await (window.safeJson ? safeJson(res) : res.json());

  const table = document.getElementById("cameraTableBody");
  table.innerHTML = "";
  data.forEach((cam) => {
    table.innerHTML += `
      <tr>
        <td>${cam.brand}</td>
        <td>${cam.model}</td>
        <td>${cam.location}</td>
        <td>${cam.status}</td>
        <td><button class="btn btn-warning btn-sm" onclick="requestService('${cam._id}')">Request Service</button></td>
      </tr>`;
  });
}

// ===== Add New Camera =====
async function addCamera() {
  const brand = document.getElementById("brand").value.trim();
  const model = document.getElementById("model").value.trim();
  const location = document.getElementById("location").value.trim();

  const res = await fetch(`${API_BASE}/cameras/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ brand, model, location }),
  });

  const data = await (window.safeJson ? safeJson(res) : res.json());
  alert(data.message || "Camera added!");
  loadCameras();
}

// ===== Request Service =====
async function requestService(cameraId) {
  const issue = prompt("Describe your camera issue:");
  if (!issue) return;

  const res = await fetch(`${API_BASE}/service/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cameraId, issueDescription: issue }),
  });

  const data = await (window.safeJson ? safeJson(res) : res.json());
  alert(data.message || "Service request sent!");
}

// ===== Load Service History =====
async function loadServiceHistory() {
  const res = await fetch(`${API_BASE}/service/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await (window.safeJson ? safeJson(res) : res.json());

  const table = document.getElementById("serviceTableBody");
  table.innerHTML = "";
  data.forEach((req) => {
    table.innerHTML += `
      <tr>
        <td>${req.cameraId.brand}</td>
        <td>${req.issueDescription}</td>
        <td>${req.status}</td>
        <td>
          ${req.status === "Completed" ? `<button class="btn btn-success btn-sm" onclick="giveFeedback('${req._id}')">Feedback</button>` : ""}
        </td>
      </tr>`;
  });
}

// ===== Feedback =====
async function giveFeedback(requestId) {
  const rating = prompt("Rate the service (1–5):");
  const comments = prompt("Any feedback?");
  const res = await fetch(`${API_BASE}/feedback/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ requestId, rating, comments }),
  });

  const data = await res.json();
  alert(data.message || "Feedback submitted!");
}
