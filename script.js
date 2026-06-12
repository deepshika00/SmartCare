// =======================================================
// GLOBAL SYSTEM APPLICATION INSTANCE STATE
// =======================================================
const state = {
  activePage: "scores",
  games: [
    { name: "Game 1: Colour Sequence", score: 0, total: 4, correct: 0, wrong: 0, status: "Idle" },
    { name: "Game 2: Odd One Out", score: 0, total: 4, correct: 0, wrong: 0, status: "Idle" },
    { name: "Game 3: Animal Sounds", score: 0, total: 4, correct: 0, wrong: 0, status: "Idle" },
    { name: "Game 4: Sentence Game", score: 0, total: 4, correct: 0, wrong: 0, status: "Idle" }
  ],
  emergency: { triggered: false, history: [] },
  selectedPieIndex: 0,
  firebaseConfig: null
};

let firebaseDb = null;
let weeklyChartInstance = null;
let monthlyChartInstance = null;

// --- CONFIGURATION CONSTANTS MATCHING THE GRAPH DATA PERFECTLY ---
const BASELINE_WEEKLY_DATA = [68, 72, 64, 70, 50, 0, 0]; // Mon, Tue, Wed, Thu, Fri (Live), Sat, Sun
const BASELINE_MONTHLY_DATA = [62, 66, 74, 65];         // Week 1, Week 2, Week 3, Week 4

// --- INITIALIZATION ORCHESTRATION ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("[SYSTEM] SmartCare Initializing Engine Core Layers...");
  
  if (typeof lucide !== 'undefined') lucide.createIcons();
  setupLiveClock();
  setupSPAViewRouting();

  const preservedConfig = localStorage.getItem("smartcare_firebase_config");
  if (preservedConfig) {
    state.firebaseConfig = JSON.parse(preservedConfig);
    connectFirebaseStream();
  }

  renderBarChartAnalysis();
  renderPieChartAnalysis();
  setupInteractivityListeners();
  
  initWeeklyTrendChart();
  initMonthlyTrendChart();
  syncAllSummaryCardsUI();
});

// --- FIREBASE CLIENT NETWORK STREAM LAYERS ---
function connectFirebaseStream() {
  if (!state.firebaseConfig || !state.firebaseConfig.databaseURL) return;
  try {
    if (firebase.apps.length === 0) {
      firebase.initializeApp({ databaseURL: state.firebaseConfig.databaseURL });
    }
    firebaseDb = firebase.database();
    
    const ind = document.getElementById("firebase-indicator");
    const lbl = document.getElementById("firebase-status-label");
    if (ind && lbl) {
      ind.className = "status-indicator-dot connected";
      lbl.innerText = "Firebase Live";
    }

    attachDatabaseListeners();
  } catch (err) {
    console.error("[CRITICAL] Stream Link Error: ", err);
  }
}

function attachDatabaseListeners() {
  if (!firebaseDb) return;

  // Realtime Node Sync: Straight mirror matching the ESP32's hardware accumulator calculations
  firebaseDb.ref("games").on("value", (snapshot) => {
    const incomingData = snapshot.val();
    if (!incomingData) return;

    console.log("[STREAM] Received accumulated metrics from hardware:", incomingData);

    Object.keys(incomingData).forEach((key) => {
      let idx = -1;
      if (key.startsWith("game_")) {
        idx = parseInt(key.split("_")[1]);
      } else {
        idx = parseInt(key);
      }

      if (!isNaN(idx) && idx >= 0 && idx < 4) {
        const item = incomingData[key];
        
        // Directly capture values from the database without web math alterations
        const scoreVal = parseInt(item.score) || 0;
        const totalVal = parseInt(item.total) || 4;
        
        state.games[idx].score = scoreVal;
        state.games[idx].total = totalVal;
        state.games[idx].correct = item.correct !== undefined ? parseInt(item.correct) : scoreVal;
        state.games[idx].wrong = item.wrong !== undefined ? parseInt(item.wrong) : (totalVal - state.games[idx].correct);
        state.games[idx].status = item.status || "Completed";
        if (item.name) state.games[idx].name = item.name;
      }
    });

    // Refresh layout viewports instantly
    refreshGameCardsUI();
    renderBarChartAnalysis();
    renderPieChartAnalysis();
    syncAllSummaryCardsUI();
  });

  // Realtime Node Sync: Hardware Online / Offline Indicator
  firebaseDb.ref("device").on("value", (snapshot) => {
    const dev = snapshot.val();
    const dot = document.getElementById("deviceStatusDot");
    const txt = document.getElementById("deviceStatusText");
    if (dot && txt && dev) {
      if (dev.status === "online") {
        dot.className = "h-2 w-2 rounded-full bg-green-500 animate-pulse";
        txt.innerText = "Hardware Online";
      } else {
        dot.className = "h-2 w-2 rounded-full bg-gray-400";
        txt.innerText = "Hardware Offline";
      }
    }
  });
}

// --- CALCULATION ENGINE: MATH SYNC FOR TOP BLOCKS ---
function syncAllSummaryCardsUI() {
  let totalCorrect = 0;
  let totalQuestions = 0;
  
  state.games.forEach(game => {
    totalCorrect += game.correct;
    totalQuestions += game.total;
  });

  const liveAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 50;

  const activeWeeklyData = [...BASELINE_WEEKLY_DATA];
  activeWeeklyData[4] = liveAccuracy; 

  const trackedWeeklyDays = activeWeeklyData.filter(v => v > 0);
  const weeklyAvg = trackedWeeklyDays.length > 0 ? Math.round(trackedWeeklyDays.reduce((a, b) => a + b, 0) / trackedWeeklyDays.length) : liveAccuracy;
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let maxWeeklyVal = -1;
  let bestDayIdx = 0;
  activeWeeklyData.forEach((val, idx) => {
    if (val > maxWeeklyVal) {
      maxWeeklyVal = val;
      bestDayIdx = idx;
    }
  });

  // Dynamic Weekly Trend Evaluator
  const trendIndicatorEl = document.getElementById("weekly-trend-indicator");
  if (trendIndicatorEl) {
    const yesterdayValue = activeWeeklyData[3]; 
    if (liveAccuracy < yesterdayValue) {
      trendIndicatorEl.innerText = "Decreasing";
      trendIndicatorEl.className = "stat-value";
      trendIndicatorEl.style.color = "var(--danger)";
    } else if (liveAccuracy > yesterdayValue) {
      trendIndicatorEl.innerText = "Improving";
      trendIndicatorEl.className = "stat-value";
      trendIndicatorEl.style.color = "var(--success)";
    } else {
      trendIndicatorEl.innerText = "Stable";
      trendIndicatorEl.className = "stat-value";
      trendIndicatorEl.style.color = "var(--text-muted)";
    }
  }

  const wAvgEl = document.getElementById("weekly-avg-score");
  if (wAvgEl) wAvgEl.innerText = `${weeklyAvg}%`;

  const wBestEl = document.getElementById("weekly-best-day");
  if (wBestEl) wBestEl.innerText = `${daysOfWeek[bestDayIdx]} (${maxWeeklyVal}%)`;

  const activeMonthlyData = [...BASELINE_MONTHLY_DATA];
  const monthlySum = activeMonthlyData.reduce((a, b) => a + b, 0);
  const monthlyAvg = (monthlySum / activeMonthlyData.length).toFixed(1);

  let maxMonthlyVal = -1;
  let bestWeekIdx = 0;
  activeMonthlyData.forEach((val, idx) => {
    if (val > maxMonthlyVal) {
      maxMonthlyVal = val;
      bestWeekIdx = idx;
    }
  });

  const mAvgEl = document.getElementById("monthly-avg-score");
  if (mAvgEl) mAvgEl.innerText = `${monthlyAvg}%`;

  const mBestEl = document.getElementById("monthly-highest-week");
  if (mBestEl) mBestEl.innerText = `Week ${bestWeekIdx + 1} (${maxMonthlyVal}%)`;

  if (weeklyChartInstance) {
    weeklyChartInstance.data.datasets[0].data = activeWeeklyData;
    weeklyChartInstance.update();
  }
}

// --- RENDERING HANDLERS ---
function refreshGameCardsUI() {
  state.games.forEach((game, idx) => {
    const scoreFraction = document.getElementById(`game-score-${idx}`);
    if (scoreFraction) scoreFraction.innerText = `${game.correct}/${game.total}`;

    const accuracyPercent = game.total > 0 ? Math.round((game.correct / game.total) * 100) : 0;
    const scorePercent = document.getElementById(`game-percent-${idx}`);
    if (scorePercent) scorePercent.innerText = `${accuracyPercent}%`;

    const progressBar = document.getElementById(`game-progress-${idx}`);
    if (progressBar) progressBar.style.width = `${accuracyPercent}%`;

    const accLabel = document.getElementById(`game-acc-label-${idx}`);
    if (accLabel) accLabel.innerText = `${accuracyPercent}% Accuracy`;

    const statusLabel = document.getElementById(`game-status-${idx}`);
    if (statusLabel) {
      statusLabel.innerText = game.status;
      if (game.status.toLowerCase() === "running") {
        statusLabel.className = "game-status status-running";
        statusLabel.style.background = "#fef3c7";
        statusLabel.style.color = "#d97706";
      } else {
        statusLabel.className = "game-status status-completed";
        statusLabel.style.background = "#d1fae5";
        statusLabel.style.color = "#065f46";
      }
    }
  });
}

function renderBarChartAnalysis() {
  const container = document.getElementById("analysis-bar-chart-list");
  if (!container) return;

  let htmlBuffer = "";
  state.games.forEach((game) => {
    const correctPct = game.total > 0 ? (game.correct / game.total) * 100 : 0;
    const wrongPct = game.total > 0 ? (game.wrong / game.total) * 100 : 0;

    htmlBuffer += `
      <div class="bar-chart-row">
        <div class="bar-row-header">
          <span>${game.name}</span>
          <span style="color: var(--text-muted)">${game.correct}C - ${game.wrong}W</span>
        </div>
        <div class="bar-track-line">
          <div class="bar-fill-correct" style="width: ${correctPct}%"></div>
          <div class="bar-fill-wrong" style="width: ${wrongPct}%"></div>
        </div>
      </div>
    `;
  });
  container.innerHTML = htmlBuffer;
}

// --- ANALYSIS PIE CHART RENDERING LAYERS ---
function renderPieChartAnalysis() {
  const targetGame = state.games[state.selectedPieIndex];
  if (!targetGame) return;
  
  const title = document.getElementById("pie-game-title");
  if (title) title.innerText = targetGame.name;

  const correctCount = document.getElementById("pie-correct-count");
  if (correctCount) correctCount.innerText = targetGame.correct;

  const wrongCount = document.getElementById("pie-wrong-count");
  if (wrongCount) wrongCount.innerText = targetGame.wrong;

  const total = targetGame.correct + targetGame.wrong;
  const accuracy = total > 0 ? Math.round((targetGame.correct / total) * 100) : 0;

  const centerPercent = document.getElementById("pie-center-percent");
  if (centerPercent) centerPercent.innerText = `${accuracy}%`;

  const chartWheel = document.getElementById("pie-conic-chart");
  if (chartWheel) {
    chartWheel.style.background = `conic-gradient(var(--primary) 0% ${accuracy}%, #e2e8f0 ${accuracy}% 100%)`;
  }
}

function selectPieGame(idx) {
  state.selectedPieIndex = idx;
  const btns = document.querySelectorAll("#pie-game-buttons .tab-select-btn");
  btns.forEach((btn, i) => {
    if (i === idx) btn.classList.add("active-btn");
    else btn.classList.remove("active-btn");
  });
  renderPieChartAnalysis();
}

// --- STATIC STATISTICAL GRAPH COMPONENT BINDINGS (CHARTJS) ---
function initWeeklyTrendChart() {
  const ctx = document.getElementById('weeklyChartCanvas');
  if (!ctx) return;
  weeklyChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Cognitive Accuracy (%)',
        data: [...BASELINE_WEEKLY_DATA],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
        fill: true,
        tension: 0.3
      }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false,
      scales: { y: { min: 0, max: 100 } }
    }
  });
}

function initMonthlyTrendChart() {
  const ctx = document.getElementById('monthlyChartCanvas');
  if (!ctx) return;
  monthlyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Resilience Curve Score',
        data: [...BASELINE_MONTHLY_DATA],
        backgroundColor: '#14b8a6',
        borderRadius: 6
      }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false,
      scales: { y: { min: 0, max: 100 } }
    }
  });
}

// --- INFRASTRUCTURE EVENT MAPPINGS & CONTROLS ---
function setupLiveClock() {
  setInterval(() => {
    const clk = document.getElementById("header-clock");
    if (clk) clk.innerText = new Date().toLocaleTimeString();
  }, 1000);
}

// --- SPA VIEW ROUTING HANDLERS ---
function setupSPAViewRouting() {
  const buttons = document.querySelectorAll(".nav-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const targetPage = btn.getAttribute("data-page");
      document.querySelectorAll(".dashboard-page").forEach(page => {
        page.classList.remove("active");
      });
      
      const activeSection = document.getElementById(targetPage);
      if (activeSection) activeSection.classList.add("active");
    });
  });
}

function setupInteractivityListeners() {
  document.getElementById("firebase-config-trigger")?.addEventListener("click", () => {
    document.getElementById("firebase-modal").style.display = "block";
  });
  document.getElementById("firebase-modal-close")?.addEventListener("click", () => {
    document.getElementById("firebase-modal").style.display = "none";
  });
}

function triggerToast(title, body) {
  const toast = document.getElementById("toast-notify");
  const tTitle = document.getElementById("toast-title");
  const tDesc = document.getElementById("toast-desc");
  if (!toast) return;
  
  if (tTitle) tTitle.innerText = title;
  if (tDesc) tDesc.innerText = body;
  
  toast.classList.add("show");
  setTimeout(() => { toast.classList.remove("show"); }, 4000);
}