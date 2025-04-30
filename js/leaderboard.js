async function fetchLeaderboard() {
    try {
      const response = await fetch('https://d5tedw0pz6.execute-api.us-east-2.amazonaws.com/leaderboard');
      const leaderboard = await response.json();
      return leaderboard;
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      return [];
    }
  }
  
  function updateLeaderboardDisplay(scores) {
    const leaderboardBody = document.getElementById('leaderboard-body');
  
    // clear existing entries
    leaderboardBody.innerHTML = '';
  
    // insert entries
    scores.forEach((entry, index) => {
      const row = document.createElement('tr');
  
      const rankCell = document.createElement('td');
      rankCell.textContent = index + 1;
  
      const userCell = document.createElement('td');
      userCell.textContent = entry.userid;
  
      const scoreCell = document.createElement('td');
      scoreCell.textContent = entry.score.toFixed(4);
  
      row.appendChild(rankCell);
      row.appendChild(userCell);
      row.appendChild(scoreCell);
  
      leaderboardBody.appendChild(row);
    });
  }
  
  // fetch on page load
  window.addEventListener('DOMContentLoaded', async () => {
    const scores = await fetchLeaderboard();
    updateLeaderboardDisplay(scores);
  });
  