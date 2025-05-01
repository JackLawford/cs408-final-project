const API_URL = "https://d5tedw0pz6.execute-api.us-east-2.amazonaws.com";

const input = document.getElementById("useridInput");
const output = document.getElementById("userOutput");

document.getElementById("userActionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userid = input.value.trim();
  if (!userid) return alert("Enter a User ID to search.");

  try {
    const res = await fetch(`${API_URL}/score/${userid}`);
    const data = await res.json();

    if (data.message === "User not found") {
      output.textContent = "User not found.";
    } else {
      output.innerHTML = `<strong>${data.userid}</strong> — ${data.score.toFixed(4)}s`;
    }
  } catch (err) {
    console.error(err);
    output.textContent = "Search failed.";
  }
});

document.getElementById("deleteBtn").addEventListener("click", async () => {
  const userid = input.value.trim();
  if (!userid) return alert("Enter a User ID to delete.");

  try {
    const res = await fetch(`${API_URL}/score/${userid}`, { method: "DELETE" });
    const data = await res.json();
    output.textContent = data.message;
  } catch (err) {
    console.error(err);
    output.textContent = "Delete failed.";
  }
});