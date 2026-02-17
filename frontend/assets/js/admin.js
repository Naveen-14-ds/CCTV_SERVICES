async function loadDashboardCharts() {
  const res = await fetch(`${API_BASE}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const text = await res.text();
  const stats = text ? JSON.parse(text) : { pending:0, inProgress:0, completed:0 };

  const ctx = document.getElementById("serviceChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Pending", "In Progress", "Completed"],
      datasets: [
        {
          data: [stats.pending, stats.inProgress, stats.completed],
          backgroundColor: ["#ffc107", "#17a2b8", "#28a745"],
        },
      ],
    },
  });
}
