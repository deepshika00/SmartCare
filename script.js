/**
 * SmartCare – Caretaker Analytics Dashboard Runtime Engine
 * Manages calculations and real-time Chart.js synchronization layers.
 */

window.DashboardEngine = {
    games: {
        game_0: { id: 1, labelName: "Colour Sequence", correct: 0, wrong: 0, currentStatus: "Idle", badgeStyle: "bg-slate-50 text-slate-500 border-slate-200" },
        game_1: { id: 2, labelName: "Odd One Out", correct: 0, wrong: 0, currentStatus: "Idle", badgeStyle: "bg-slate-50 text-slate-500 border-slate-200" },
        game_2: { id: 3, labelName: "Animal Sounds", correct: 0, wrong: 0, currentStatus: "Idle", badgeStyle: "bg-slate-50 text-slate-500 border-slate-200" },
        game_3: { id: 4, labelName: "Sentence Game", correct: 0, wrong: 0, currentStatus: "Idle", badgeStyle: "bg-slate-50 text-slate-500 border-slate-200" }
    },
    weekly: { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 },
    monthly: { week1: 0, week2: 0, week3: 0, week4: 0 },
    activePieSelectedKey: "game_0",
    alertHistoryLogCount: 0,
    charts: { bar: null, pie: null, weeklyLine: null, monthlyLine: null }
};
function initDashboard() {
    const db = firebase.database();

    // Listen to 'history' for dynamic monthly/consistency updates
    db.ref('history').on('value', (snapshot) => {
        const history = snapshot.val();
        
        // 1. Reset UI to 0 if no data exists
        if (!history) {
            const el = document.getElementById('consistency-value');
            if (el) el.innerText = "0%";
            return;
        }

        // 2. Perform fresh calculation
        let totalC = 0;
        let totalT = 0;
        let weeklySums = { "Week 1": {c:0, t:0}, "Week 2": {c:0, t:0}, "Week 3": {c:0, t:0}, "Week 4": {c:0, t:0} };

        Object.values(history).forEach(log => {
            const date = new Date(log.timestamp * 1000);
            const weekNum = Math.min(Math.ceil(date.getDate() / 7), 4);
            const weekKey = "Week " + weekNum;

            totalC += log.correct;
            totalT += log.total;
            weeklySums[weekKey].c += log.correct;
            weeklySums[weekKey].t += log.total;
        });
        /**
 * Monitors the Firebase database for device alerts
 */
/**
 * Monitors the Firebase database for device emergency triggers.
 * Add this to your Firebase listener section.
 */
/**
 * Monitors the Firebase database for hardware trigger events.
 * Replace 'emergency/status' with the actual path your ESP32 updates.
 */
function listenForHardwareAlerts() {
    const db = firebase.database();
    const alertSound = document.getElementById('alert-sound'); // Ensure this ID is in index.html

    db.ref('emergency/status').on('value', (snapshot) => {
        const isAlertActive = snapshot.val(); 

        if (isAlertActive === true) {
            // Trigger visual and audio alerts
            playEmergencyAlert();
            
            // Redirect to the college location
            window.location.href = "https://www.google.com/maps/search/GRIET"; 
        }
    });
}
/**
 * Monitors the Firebase 'emergency/status' path
 */
function listenForEmergency() {
    const db = firebase.database();
    const alertSound = document.getElementById('alert-sound');
    const masterBox = document.getElementById('emergency-master-box');
    const title = document.getElementById('emergency-status-title');
    const iconContainer = document.getElementById('emergency-icon-container');
    const icon = document.getElementById('emergency-graphic-icon');
    const link = document.getElementById('location-link');

    db.ref('emergency/status').on('value', (snapshot) => {
        const isActive = snapshot.val(); // Expects true or 1

        if (isActive === true || isActive === 1) {
            // 1. Play Sound
            alertSound.play().catch(e => console.log("Sound block prevented, user needs to click page first"));

            // 2. Change UI to Alert Mode
            masterBox.classList.add('bg-red-50', 'border-red-200');
            title.textContent = "EMERGENCY ALERT!";
            title.classList.replace('text-slate-900', 'text-red-700');
            iconContainer.classList.replace('bg-emerald-50', 'bg-red-100');
            icon.classList.replace('text-emerald-600', 'text-red-600');
            
            // 3. Show Redirect Button
            link.classList.remove('hidden');
            
            // 4. Force automatic redirect to Maps
            window.open(link.href, '_blank');
        } else {
            // Reset to normal
            masterBox.classList.remove('bg-red-50', 'border-red-200');
            title.textContent = "System Normal";
            link.classList.add('hidden');
        }
    });
}
// 1. Ensure this is inside your main init function
function initHardwareListener() {
    const db = firebase.database();
    
    // Use the EXACT path your ESP32 uses. 
    // If your ESP32 pushes to 'emergency/status', ensure this matches.
    db.ref('emergency/status').on('value', (snapshot) => {
        const val = snapshot.val();
        console.log("Firebase alert value:", val); // CHECK THIS IN YOUR CONSOLE

        if (val === true || val === 1) {
            triggerEmergencyUI();
        }
    });
}

function triggerEmergencyUI() {
    // Play alert sound
    const alertSound = document.getElementById('alert-sound');
    if (alertSound) alertSound.play();

    // Redirect to Maps
    window.location.href = "https://www.google.com/maps/dir/?api=1&destination=Gokaraju+Rangaraju+Institute+of+Engineering+and+Technology";
}

function playEmergencyAlert() {
    const audio = document.getElementById('alert-sound');
    if (audio) {
        audio.play().catch(e => console.log("Interaction required for audio"));
    }
    // Update the UI Emergency Status section
    document.getElementById('emergency-status-title').textContent = "EMERGENCY ACTIVE";
    document.getElementById('emergency-graphic-icon').classList.add('text-red-600');
}
/**
 * Monitors the Firebase database for hardware trigger events.
 * Add this to your script.js file.
 */
function listenForEmergencyAlerts() {
    const db = firebase.database();
    
    // Listen for changes to the 'emergency/status' path
    db.ref('emergency/status').on('value', (snapshot) => {
        const isAlertActive = snapshot.val();
        const emergencyCard = document.getElementById('summary-emergency-card');
        const emergencyStatus = document.getElementById('summary-emergency-status');
        const emergencyIconBg = document.getElementById('summary-emergency-icon-bg');
        const navDot = document.getElementById('nav-emergency-dot');

        if (isAlertActive === true || isAlertActive === 'true') {
            // TRIGGER ALERT STATE
            if (emergencyCard) {
                emergencyCard.classList.add('bg-red-50', 'border-red-200', 'alert-active');
                emergencyCard.classList.remove('bg-white');
            }
            if (emergencyStatus) {
                emergencyStatus.textContent = "EMERGENCY!";
                emergencyStatus.className = "mt-2 md:mt-3 text-xl md:text-2xl font-black text-red-600";
            }
            if (emergencyIconBg) {
                emergencyIconBg.className = "bg-red-100 p-2 rounded-lg text-red-600";
            }
            if (navDot) navDot.classList.remove('hidden');
        } else {
            // RESET TO NORMAL STATE
            if (emergencyCard) {
                emergencyCard.classList.remove('bg-red-50', 'border-red-200', 'alert-active');
                emergencyCard.classList.add('bg-white');
            }
            if (emergencyStatus) {
                emergencyStatus.textContent = "Normal";
                emergencyStatus.className = "mt-2 md:mt-3 text-xl md:text-2xl font-black text-slate-600";
            }
            if (emergencyIconBg) {
                emergencyIconBg.className = "bg-slate-50 p-2 rounded-lg text-slate-500";
            }
            if (navDot) navDot.classList.add('hidden');
        }
    });
}

        // 3. Update the Consistency Card (The "Stuck 100%" fix)
        const consistency = totalT > 0 ? Math.round((totalC / totalT) * 100) : 0;
        const el = document.getElementById('consistency-value');
        if (el) el.innerText = consistency + "%";

        // 4. Update the Monthly Graph
        if (window.monthlyChart) {
            window.monthlyChart.data.datasets[0].data = [
                (weeklySums["Week 1"].c / (weeklySums["Week 1"].t || 1)) * 100,
                (weeklySums["Week 2"].c / (weeklySums["Week 2"].t || 1)) * 100,
                (weeklySums["Week 3"].c / (weeklySums["Week 3"].t || 1)) * 100,
                (weeklySums["Week 4"].c / (weeklySums["Week 4"].t || 1)) * 100
            ];
            window.monthlyChart.update();
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initNavigationRouter();
    initDashboard();
    connectFirebaseStream();
    initEmergencySystem();

    
    if (typeof lucide !== 'undefined') lucide.createIcons();
});

/**
 * Navigation View Router Management
 */
function initNavigationRouter() {
    document.querySelectorAll('.nav-menu .nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPageId = btn.getAttribute('data-page');
            
            document.querySelectorAll('.nav-menu .nav-btn').forEach(b => b.classList.toggle('active', b === btn));
            document.querySelectorAll('.dashboard-page').forEach(page => {
                const isTarget = page.id === targetPageId;
                page.classList.toggle('active', isTarget);
            });

            const mainTitle = document.getElementById('current-page-title');
            const subTitle = document.getElementById('current-page-subtitle');
            
            if (targetPageId === 'dashboard') {
                mainTitle.textContent = "SmartCare Dashboard";
                subTitle.textContent = "Real-Time Cognitive Monitoring";
            } else if (targetPageId === 'analysis') {
                mainTitle.textContent = "Performance Analysis";
                subTitle.textContent = "Detailed Cognitive Skill Metrics Evaluation Matrix";
                rebuildPerformanceBarGraph();
                rebuildPieChartVisualization();
            } else if (targetPageId === 'weekly') {
                mainTitle.textContent = "Weekly Performance Trend";
                subTitle.textContent = "Historical Day-Aware Tracking Profiles";
                rebuildWeeklyTrendLineGraph();
            } else if (targetPageId === 'monthly') {
                mainTitle.textContent = "Monthly Improvement Trend";
                subTitle.textContent = "Longitudinal Progress Matrix Benchmarking";
                rebuildMonthlyTrendLineGraph();
            } else if (targetPageId === 'emergency') {
                mainTitle.textContent = "Emergency Alerts";
                subTitle.textContent = "Wireless Hardware Interrupt Signal Monitoring";
            }
        });
    });
}

/**
 * Firebase Realtime Database Connector
 */
// Add this helper function at the top of your script.js file
function getTodayString() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()]; // Returns the current day name
}
/**
 * Firebase Realtime Database Connector - Updated for Day-Aware Analysis
 */
function connectFirebaseStream() {
    const db = firebase.database();
    
    // 1. Get current day to filter Firebase data
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = days[new Date().getDay()]; 

    db.ref('games').on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        // 2. Loop through your game nodes (game_0, game_1, etc.)
        Object.keys(window.DashboardEngine.games).forEach(key => {
            const gameData = data[key];

            // 3. The Filter Logic: 
            // If the day in Firebase matches today, update the dashboard.
            // If it's a different day, set the dashboard values to 0.
            if (gameData && gameData.day === today) {
                window.DashboardEngine.games[key].correct = parseInt(gameData.correct) || 0;
                window.DashboardEngine.games[key].wrong = parseInt(gameData.wrong) || 0;
                window.DashboardEngine.games[key].currentStatus = gameData.status || "Completed";
            } else {
                // If it's not today, treat it as if the game hasn't been played yet
                window.DashboardEngine.games[key].correct = 0;
                window.DashboardEngine.games[key].wrong = 0;
                window.DashboardEngine.games[key].currentStatus = "Idle";
            }
        });

        // 4. THIS IS YOUR ORIGINAL LOGIC
        // After cleaning the data, we call the functions that update your UI/Charts
        // Keep your original function calls here:
        evaluateCalculatedGameScores(); 
        rebuildWeeklyTrendLineGraph();
        rebuildMonthlyTrendLineGraph();
        generateCaretakerRecommendations();
        
        // If you have a specific render function for charts, call it here:
        if (typeof renderDashboardCharts === 'function') {
            renderDashboardCharts();
        }
    });
}
    const firebaseConfig = {
        databaseURL: "https://smartcare-1eb34-default-rtdb.firebaseio.com/",
        projectId: "smartcare-1eb34"
    };

    try {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        const db = firebase.database();
        const today = getTodayString(); // Get current day (e.g., "Sunday")

        document.getElementById('firebase-status-label').textContent = "Firebase Live";
        document.getElementById('firebase-indicator').className = "h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200";

        const dayMappingLookup = {
            'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 
            'Thu': 'Thursday', 'Fri': 'Friday', 'Sat': 'Saturday', 'Sun': 'Sunday',
            'Monday': 'Monday', 'Tuesday': 'Tuesday', 'Wednesday': 'Wednesday',
            'Thursday': 'Thursday', 'Friday': 'Friday', 'Saturday': 'Saturday', 'Sunday': 'Sunday'
        };

        // 1. Games Realtime Telemetry Sync Node Listener
        db.ref('games').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Reset Weekly Accumulators for Charts (Charts still need full week data)
                Object.keys(window.DashboardEngine.weekly).forEach(day => window.DashboardEngine.weekly[day] = 0);
                const dayCorrectAccumulator = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 };
                const dayTotalAccumulator = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 };

                Object.keys(window.DashboardEngine.games).forEach(key => {
                    if (data[key]) {
                        const rawDayStr = (data[key].day || "").trim();
                        const cleanedDay = rawDayStr.charAt(0).toUpperCase() + rawDayStr.slice(1).toLowerCase();
                        const targetedDayKey = dayMappingLookup[cleanedDay] || dayMappingLookup[cleanedDay.substring(0, 3)];

                        // A: Accumulate data for historical charts (Always runs)
                        if (targetedDayKey && dayCorrectAccumulator[targetedDayKey] !== undefined) {
                            dayCorrectAccumulator[targetedDayKey] += parseInt(data[key].correct) || 0;
                            dayTotalAccumulator[targetedDayKey] += (parseInt(data[key].correct) || 0) + (parseInt(data[key].wrong) || 0);
                        }

                        // B: ONLY update dashboard state if data matches TODAY
                        if (targetedDayKey === today) {
                            window.DashboardEngine.games[key].correct = parseInt(data[key].correct) || 0;
                            window.DashboardEngine.games[key].wrong = parseInt(data[key].wrong) || 0;
                            window.DashboardEngine.games[key].currentStatus = data[key].status || "Idle";
                        } else {
                            // Reset state to empty if the data is NOT from today
                            window.DashboardEngine.games[key].correct = 0;
                            window.DashboardEngine.games[key].wrong = 0;
                            window.DashboardEngine.games[key].currentStatus = "Idle";
                        }
                    }
                });

                // Update charts with calculated weekly averages
                Object.keys(window.DashboardEngine.weekly).forEach(day => {
                    window.DashboardEngine.weekly[day] = dayTotalAccumulator[day] > 0 
                        ? Math.round((dayCorrectAccumulator[day] / dayTotalAccumulator[day]) * 100) : 0;
                });

                // Refresh UI
                evaluateCalculatedGameScores();
                evaluateWeeklyTrendsSummary();
                rebuildPerformanceBarGraph();
                rebuildPieChartVisualization();
                rebuildWeeklyTrendLineGraph();
                generateCaretakerRecommendations();
            }
        });

        // ... Keep the rest of your monthly and emergency listeners as they are ...
    } catch (err) {
        console.error("Firebase Sync Interrupted: ", err);
    }


/**
 * Helper to generate string metrics for individual game accuracies
 */
function getAccuracyFeedbackString(accuracy) {
    if (accuracy >= 90) return "Outstanding performance. Cognitive response and memory retention are excellent.";
    if (accuracy >= 75) return "Strong performance with good cognitive ability and attention.";
    if (accuracy >= 60) return "Moderate performance. Some areas may require additional practice.";
    if (accuracy >= 40) return "Below average performance. Improvement is recommended.";
    return "Significant improvement required. Additional cognitive training may be beneficial.";
}

/**
 * Automatic Mathematical Evaluations Engine
 */
function evaluateCalculatedGameScores() {
    const state = window.DashboardEngine;
    let computedGlobalTotalCorrect = 0;
    let computedGlobalTotalQuestions = 0;
    let completedGamesCount = 0;
    let combinedWrongAttempts = 0;
    
    let topScorePct = -1;
    let topScoringGameName = "--";
    let worstScorePct = 101;
    let worstScoringGameName = "--";

    Object.keys(state.games).forEach(key => {
        const game = state.games[key];
        const totalQs = game.correct + game.wrong;
        const accuracyPct = totalQs > 0 ? Math.round((game.correct / totalQs) * 100) : 0;
        
        computedGlobalTotalCorrect += game.correct;
        computedGlobalTotalQuestions += totalQs;
        combinedWrongAttempts += game.wrong;

        const lowerStatus = game.currentStatus.toLowerCase();
        if (lowerStatus === "completed" || lowerStatus === "complete") {
            game.badgeStyle = "bg-emerald-50 text-emerald-600 border-emerald-100";
            completedGamesCount++;
        } else if (lowerStatus === "running" || lowerStatus === "active") {
            game.badgeStyle = "bg-yellow-50 text-yellow-600 border-yellow-100";
        } else if (lowerStatus === "failed") {
            game.badgeStyle = "bg-red-50 text-red-600 border-red-100";
        } else {
            game.badgeStyle = "bg-slate-50 text-slate-500 border-slate-200";
        }

        if (totalQs > 0) {
            if (accuracyPct > topScorePct) {
                topScorePct = accuracyPct;
                topScoringGameName = game.labelName;
            }
            if (accuracyPct < worstScorePct) {
                worstScorePct = accuracyPct;
                worstScoringGameName = game.labelName;
            }
        }

        const id = game.id;
        const scoreString = document.getElementById(`game-score-${id}`);
        const percentageString = document.getElementById(`game-pct-${id}`);
        const progressIndicatorBar = document.getElementById(`game-progress-${id}`);
        const statusBadgeLabel = document.getElementById(`game-badge-${id}`);

        if (scoreString) scoreString.textContent = `${game.correct}/${totalQs}`;
        if (percentageString) percentageString.textContent = `(${accuracyPct}%)`;
        if (progressIndicatorBar) progressIndicatorBar.style.width = `${accuracyPct}%`;
        if (statusBadgeLabel) {
            statusBadgeLabel.textContent = game.currentStatus;
            statusBadgeLabel.className = `text-[10px] font-bold border px-2.5 py-1 rounded-full uppercase tracking-wider ${game.badgeStyle}`;
        }

        // Render dynamic insight text string per specific game card slot
        const targetInsightElement = document.getElementById(`insight-game${id}`);
        if (targetInsightElement) {
            targetInsightElement.textContent = getAccuracyFeedbackString(accuracyPct);
        }
    });

    const baselineAveragePercent = computedGlobalTotalQuestions > 0 ? Math.round((computedGlobalTotalCorrect / computedGlobalTotalQuestions) * 100) : 0;
    
    document.getElementById('summary-total-games').textContent = Object.keys(state.games).length;
    document.getElementById('summary-avg-score').textContent = `${baselineAveragePercent}%`;
    document.getElementById('summary-best-game').textContent = topScoringGameName;

    // Highest/Lowest Engine Output
    const bestInsightEl = document.getElementById('best-game-insight-label');
    if (bestInsightEl) {
        bestInsightEl.textContent = topScorePct !== -1 ? `Strongest cognitive area: ${topScoringGameName} with ${topScorePct}% accuracy.` : "Strongest cognitive area: --";
    }
    const worstInsightEl = document.getElementById('worst-game-insight-label');
    if (worstInsightEl) {
        worstInsightEl.textContent = worstScorePct !== 101 ? `Most challenging activity: ${worstScoringGameName}. Additional practice is recommended.` : "Most challenging activity: --";
    }

    // Session Metrics Context Engine Breakdown Output
    const sessionAnalysisParagraph = document.getElementById('session-analysis-summary-paragraph');
    if (sessionAnalysisParagraph) {
        let textSummary = `The user completed ${completedGamesCount} cognitive activities with an overall accuracy of ${baselineAveragePercent}%. Performance indicates healthy engagement and consistent cognitive ability. `;
        if (baselineAveragePercent > 80) {
            textSummary += "Overall cognitive performance is excellent.";
        } else if (baselineAveragePercent >= 60) {
            textSummary += "Overall cognitive performance is stable with room for improvement.";
        } else {
            textSummary += "Performance trends suggest additional cognitive exercises may be beneficial.";
        }
        sessionAnalysisParagraph.textContent = textSummary;
    }
}

/**
 * Handle tab switching logic on interactive pie view panel
 */
window.switchAnalysisGame = function(idNumber) {
    const state = window.DashboardEngine;
    state.activePieSelectedKey = `game_${idNumber - 1}`;
    
    document.querySelectorAll('.tab-select-btn').forEach((btn, idx) => {
        btn.classList.toggle('active-btn', (idx + 1) === idNumber);
        btn.classList.toggle('text-slate-600', (idx + 1) !== idNumber);
    });

    rebuildPieChartVisualization();
};

/**
 * Charting Framework Render Controls (Chart.js)
 */
function rebuildPerformanceBarGraph() {
    const canvas = document.getElementById('analysisBarChartCanvas');
    if (!canvas) return;

    const state = window.DashboardEngine;
    const trackingLabels = ['Game 1', 'Game 2', 'Game 3', 'Game 4'];
    const primaryDataArray = Object.keys(state.games).map(k => {
        const g = state.games[k];
        const total = g.correct + g.wrong;
        return total > 0 ? Math.round((g.correct / total) * 100) : 0;
    });

    if (state.charts.bar) {
        state.charts.bar.data.datasets[0].data = primaryDataArray;
        state.charts.bar.update();
        return;
    }

    state.charts.bar = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: trackingLabels,
            datasets: [{
                data: primaryDataArray,
                backgroundColor: '#0f766e',
                borderRadius: 6,
                barThickness: 28
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 0, max: 100, ticks: { callback: val => val + '%' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function rebuildPieChartVisualization() {
    const canvas = document.getElementById('analysisPieChartCanvas');
    if (!canvas) return;

    const state = window.DashboardEngine;
    const currentSelectedGame = state.games[state.activePieSelectedKey];
    const totalQuestions = currentSelectedGame.correct + currentSelectedGame.wrong;

    const pctCorrect = totalQuestions > 0 ? Math.round((currentSelectedGame.correct / totalQuestions) * 100) : 0;
    const pctWrong = totalQuestions > 0 ? (100 - pctCorrect) : 0;

    document.getElementById('pie-correct-val').textContent = `${pctCorrect}%`;
    document.getElementById('pie-wrong-val').textContent = `${pctWrong}%`;
    document.getElementById('pie-total-val').textContent = totalQuestions;

    const statementLabel = document.getElementById('pie-analysis-statement');
    if (statementLabel) {
        if (pctCorrect === 100 && totalQuestions > 0) {
            statementLabel.textContent = "Perfect performance with no mistakes.";
        } else if (pctCorrect >= 75) {
            statementLabel.textContent = "Good understanding with minor errors.";
        } else if (pctCorrect === 50) {
            statementLabel.textContent = "Balanced performance with equal success and mistakes.";
        } else {
            statementLabel.textContent = "Additional practice is recommended.";
        }
    }

    if (state.charts.pie) {
        state.charts.pie.data.datasets[0].data = [pctCorrect, pctWrong];
        state.charts.pie.update();
        return;
    }

    state.charts.pie = new Chart(canvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Correct %', 'Wrong %'],
            datasets: [{
                data: [pctCorrect, pctWrong],
                backgroundColor: ['#0f766e', '#ef4444'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

/**
 * PAGE 3: Weekly Trends
 */
function evaluateWeeklyTrendsSummary() {
    const state = window.DashboardEngine;
    const vectorMap = state.weekly;
    const keys = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    let summationTotal = 0;
    let maximumScoreVal = -1;
    let maximumDayLabel = "--";
    let minimumScoreVal = 101;
    let minimumDayLabel = "--";
    let activeDaysCount = 0;

    keys.forEach(day => {
        const value = vectorMap[day] || 0;
        if (value > 0) {
            summationTotal += value;
            activeDaysCount++;
            if (value > maximumScoreVal) { maximumScoreVal = value; maximumDayLabel = day; }
            if (value < minimumScoreVal) { minimumScoreVal = value; minimumDayLabel = day; }
        }
    });

    const calculatedAvg = activeDaysCount > 0 ? Math.round(summationTotal / activeDaysCount) : 0;
    
    // Growth Improvement Metric Equation Logic Validation Engine
    const monScore = vectorMap.Monday || 0;
    const sunScore = vectorMap.Sunday || 0;
    let improvementPct = 0;
    if (monScore > 0) {
        improvementPct = Math.round(((sunScore - monScore) / monScore) * 100);
    } else if (sunScore > 0) {
        improvementPct = 100; // Edge-case validation rule
    }

    document.getElementById('weekly-avg-val').textContent = `${calculatedAvg}%`;
    document.getElementById('weekly-best-val').textContent = maximumScoreVal !== -1 ? `${maximumDayLabel} (${maximumScoreVal}%)` : "0%";
    document.getElementById('weekly-worst-val').textContent = minimumScoreVal !== 101 ? `${minimumDayLabel} (${minimumScoreVal}%)` : "0%";
    document.getElementById('weekly-growth-val').textContent = `${improvementPct}%`;

    const weeklyInsight = document.getElementById('weekly-paragraph-insight');
    if (weeklyInsight) {
        let trendSummary = `Weekly average performance was ${calculatedAvg}%. Best performance occurred on ${maximumDayLabel !== "--" ? maximumDayLabel : "N/A"} with ${maximumScoreVal !== -1 ? maximumScoreVal : 0}%. The user improved by ${improvementPct}% throughout the week. `;
        if (improvementPct > 0) {
            trendSummary += "Performance shows steady improvement across the week.";
        } else if (improvementPct < 0) {
            trendSummary += "Performance declined during the week and may require monitoring.";
        }
        weeklyInsight.textContent = trendSummary;
    }
}

function rebuildWeeklyTrendLineGraph() {
    const canvas = document.getElementById('weeklyTrendLineCanvas');
    if (!canvas) return;

    const state = window.DashboardEngine;
    const displayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const metricValues = [
        state.weekly.Monday, state.weekly.Tuesday, state.weekly.Wednesday, 
        state.weekly.Thursday, state.weekly.Friday, state.weekly.Saturday, state.weekly.Sunday
    ];

    if (state.charts.weeklyLine) {
        state.charts.weeklyLine.data.datasets[0].data = metricValues;
        state.charts.weeklyLine.update();
        return;
    }

    state.charts.weeklyLine = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: displayLabels,
            datasets: [{
                data: metricValues,
                borderColor: '#0f766e',
                backgroundColor: 'rgba(15, 118, 110, 0.04)',
                borderWidth: 3,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#0f766e',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 0, max: 100, ticks: { callback: v => v + '%' } },
                x: { grid: { display: false } }
            }
        }
    });
}

/**
 * PAGE 4: Monthly Progress Analysis
 */
// This replaces your 3 functions
function refreshMonthlyAnalytics() {
    const db = firebase.database();
    db.ref('history').once('value', (snapshot) => {
        const history = snapshot.val();
        if (!history) return;

        let weeklySums = { "Week 1": {c:0, t:0}, "Week 2": {c:0, t:0}, "Week 3": {c:0, t:0}, "Week 4": {c:0, t:0} };

        // Process history
        Object.values(history).forEach(log => {
            const date = new Date(log.timestamp * 1000);
            const weekNum = Math.min(Math.ceil(date.getDate() / 7), 4);
            const weekKey = "Week " + weekNum;
            
            weeklySums[weekKey].c += log.correct;
            weeklySums[weekKey].t += log.total;
        });

        // 1. Calculate and update the "Consistency" card
        const totalC = Object.values(weeklySums).reduce((s, w) => s + w.c, 0);
        const totalT = Object.values(weeklySums).reduce((s, w) => s + w.t, 0);
        const consistency = totalT > 0 ? Math.round((totalC / totalT) * 100) : 0;
       console.log("Calculated Consistency:", consistency);
        document.getElementById('consistency-value').innerText = consistency + "%";


        // 2. Update the Graph
        const chartData = [
            (weeklySums["Week 1"].c / (weeklySums["Week 1"].t || 1)) * 100,
            (weeklySums["Week 2"].c / (weeklySums["Week 2"].t || 1)) * 100,
            (weeklySums["Week 3"].c / (weeklySums["Week 3"].t || 1)) * 100,
            (weeklySums["Week 4"].c / (weeklySums["Week 4"].t || 1)) * 100
        ];

        // Update your chart
        if (window.monthlyChart) {
            window.monthlyChart.data.datasets[0].data = chartData;
            window.monthlyChart.update();
        }
    });
}

function rebuildMonthlyTrendLineGraph() {
    const canvas = document.getElementById('monthlyTrendLineCanvas');
    if (!canvas) return;

    const state = window.DashboardEngine;
    const displayLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const metricValues = [state.monthly.week1, state.monthly.week2, state.monthly.week3, state.monthly.week4];

    if (state.charts.monthlyLine) {
        state.charts.monthlyLine.data.datasets[0].data = metricValues;
        state.charts.monthlyLine.update();
        return;
    }

    state.charts.monthlyLine = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: displayLabels,
            datasets: [{
                data: metricValues,
                borderColor: '#0f766e',
                backgroundColor: 'rgba(15, 118, 110, 0.04)',
                borderWidth: 3,
                tension: 0.25,
                fill: true,
                pointBackgroundColor: '#0f766e',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 0, max: 100, ticks: { callback: v => v + '%' } },
                x: { grid: { display: false } }
            }
        }
    });
}

/**
 * PAGE 5: Emergency UI States
 */
function triggerEmergencyUIState(isTriggered, originalRawTimestamp) {
    const masterBox = document.getElementById('emergency-master-box');
    const iconContainer = document.getElementById('emergency-icon-container');
    const graphicIcon = document.getElementById('emergency-graphic-icon');
    const title = document.getElementById('emergency-status-title');
    const desc = document.getElementById('emergency-status-desc');
    const navDot = document.getElementById('nav-emergency-dot');

    const summaryCard = document.getElementById('summary-emergency-card');
    const summaryStatus = document.getElementById('summary-emergency-status');
    const summaryIconBg = document.getElementById('summary-emergency-icon-bg');

    if (isTriggered) {
        if (masterBox) masterBox.className = "rounded-2xl border-2 border-red-500 bg-red-50 p-8 shadow-sm flex flex-col items-center justify-center text-center max-w-2xl mx-auto alert-active";
        if (iconContainer) iconContainer.className = "h-16 w-16 bg-red-600 rounded-full flex items-center justify-center text-white mb-4 animate-bounce";
        if (graphicIcon) { graphicIcon.setAttribute('data-lucide', 'alert-triangle'); graphicIcon.className = "h-8 w-8 text-white"; }
        if (title) title.textContent = "Alert";
        
        if (desc) {
            if (window.DashboardEngine.alertHistoryLogCount > 1) {
                desc.textContent = "Repeated emergency events detected. Caretaker attention is recommended.";
            } else {
                desc.textContent = "Emergency alert received from ESP32 device.";
            }
        }
        if (navDot) navDot.classList.remove('hidden');

        if (summaryCard) summaryCard.className = "rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm";
        if (summaryStatus) { summaryStatus.textContent = "Alert"; summaryStatus.className = "mt-3 text-2xl font-black text-red-600"; }
        if (summaryIconBg) summaryIconBg.className = "rounded-lg bg-red-100 p-2 text-red-600";
    } else {
        if (masterBox) masterBox.className = "rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col items-center justify-center text-center max-w-2xl mx-auto";
        if (iconContainer) iconContainer.className = "h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-none";
        if (graphicIcon) { graphicIcon.setAttribute('data-lucide', 'shield'); graphicIcon.className = "h-8 w-8 text-emerald-600"; }
        if (title) title.textContent = "Normal";
        if (desc) desc.textContent = "All wireless hardware interrupt systems functional.";
        if (navDot) navDot.classList.add('hidden');

        if (summaryCard) summaryCard.className = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
        if (summaryStatus) { summaryStatus.textContent = "Normal"; summaryStatus.className = "mt-3 text-2xl font-black text-emerald-600"; }
        if (summaryIconBg) summaryIconBg.className = "rounded-lg bg-emerald-50 p-2 text-emerald-600";
    }
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function appendEmergencyTableLogRecord(rawTimestampString) {
    const tableBody = document.getElementById('emergency-table-rows');
    if (!tableBody) return;

    window.DashboardEngine.alertHistoryLogCount++;
    document.getElementById('emergency-count-lbl').textContent = window.DashboardEngine.alertHistoryLogCount;

    let parsedDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    let parsedTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    try {
        if (rawTimestampString) {
            const normalized = rawTimestampString.includes(" ") ? rawTimestampString.replace(" ", "T") : rawTimestampString;
            const dateObj = new Date(normalized);
            if (!isNaN(dateObj.getTime())) {
                parsedDate = dateObj.toLocaleDateString('en-GB').replace(/\//g, '-');
                parsedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            }
        }
    } catch (e) {}

    const rowMarkup = `
        <tr class="bg-red-50/30 transition-all duration-300">
            <td class="px-6 py-4 whitespace-nowrap font-bold text-red-600">${parsedDate}</td>
            <td class="px-6 py-4 whitespace-nowrap font-bold text-red-600">${parsedTime}</td>
            <td class="px-6 py-4 whitespace-nowrap"><span class="bg-red-600 text-white font-mono text-xs px-2 py-0.5 rounded-md border border-red-700">ESP32</span></td>
            <td class="px-6 py-4 text-xs font-semibold text-red-700">Button Press</td>
        </tr>
    `;
    tableBody.insertAdjacentHTML('afterbegin', rowMarkup);
    
    // Refresh emergency message view panel to handle "repeated alerts" logic state instantly
    const masterBox = document.getElementById('emergency-master-box');
    if (masterBox && masterBox.classList.contains('alert-active')) {
        triggerEmergencyUIState(true, rawTimestampString);
    }
}

/**
 * Caretaker Recommendation Engine
 */
function generateCaretakerRecommendations() {
    const state = window.DashboardEngine;
    const recommendationsContainer = document.getElementById('caretaker-recommendations-list');
    if (!recommendationsContainer) return;

    let recommendations = [];

    // 1. Evaluate Individual Games
    Object.keys(state.games).forEach(key => {
        const game = state.games[key];
        const total = game.correct + game.wrong;
        const accuracy = total > 0 ? Math.round((game.correct / total) * 100) : 0;

        if (accuracy < 60 && total > 0) {
            if (game.labelName === "Colour Sequence" || game.labelName === "Animal Sounds") {
                recommendations.push(`Recommend additional memory-based exercises for ${game.labelName}.`);
            } else if (game.labelName === "Sentence Game") {
                recommendations.push("Recommend language and communication activities.");
            } else {
                recommendations.push(`Recommend additional critical reasoning and practice for ${game.labelName}.`);
            }
        }
    });

    // 2. Evaluate Weekly Improvement Matrix
    const monScore = state.weekly.Monday || 0;
    const sunScore = state.weekly.Sunday || 0;
    let weeklyImprovement = 0;
    if (monScore > 0) {
        weeklyImprovement = ((sunScore - monScore) / monScore) * 100;
    }
    if (weeklyImprovement > 20) {
        recommendations.push("The user is showing encouraging cognitive improvement.");
    }

    // 3. Evaluate Overall Session Balance 
    let globalCorrect = 0;
    let globalTotal = 0;
    Object.keys(state.games).forEach(k => {
        globalCorrect += state.games[k].correct;
        globalTotal += (state.games[k].correct + state.games[k].wrong);
    });
    const totalAvgAccuracy = globalTotal > 0 ? Math.round((globalCorrect / globalTotal) * 100) : 0;

    if (totalAvgAccuracy > 85) {
        recommendations.push("Current cognitive performance is healthy and stable.");
    }

    // Default placeholder if performance is balanced with no conditions triggered
    if (recommendations.length === 0) {
        recommendations.push("Continue baseline daily visual/auditory tasks to ensure cognitive optimization.");
    }

    // Clean and clear DOM nodes inside layout container interface
    recommendationsContainer.innerHTML = "";
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.className = "flex items-start space-x-3 text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-100 shadow-sm transition-all";
        li.innerHTML = `
            <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 font-bold text-xs">✓</span>
            <span>${rec}</span>
        `;
        recommendationsContainer.appendChild(li);
    });
}

function initClock() {
    const el = document.getElementById('header-clock');
    if (!el) return;
    setInterval(() => {
        el.textContent = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }, 1000);
}
function calculateMonthlyProgress() {
    const db = firebase.database();
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    
    // Fetch all history logs
    db.ref('history').once('value', (snapshot) => {
        const logs = snapshot.val();
        if (!logs) return;

        let monthlyCorrect = 0;
        let monthlyTotal = 0;

        Object.values(logs).forEach(log => {
            const logDate = new Date(log.timestamp); // Ensure your Arduino sends timestamp
            if (logDate.getMonth() === currentMonth) {
                monthlyCorrect += log.correct;
                monthlyTotal += log.total;
            }
        });

        const progress = monthlyTotal > 0 ? (monthlyCorrect / monthlyTotal) * 100 : 0;
        
        // Update your UI here
        document.getElementById('monthly-progress-card').innerText = Math.round(progress) + "%";
        updateGraph(progress); // Call your chart update function
    });
}
/**
 * Enables live location tracking and reveals the map
 */
window.requestLiveLocation = function() {
    const mapContainer = document.getElementById('location-map-container');
    const waitingBadge = document.getElementById('waiting-alert-badge');
    
    // Show map and the "waiting" state
    mapContainer.classList.remove('hidden');
    waitingBadge.classList.remove('hidden');
    
    console.log("Tracking requested. Location set to static GRIET coordinate.");
};

/**
 * Call this when an emergency alert is actually received 
 * to stop the 'waiting' state and show the alarm
 */
window.handleAlertReceived = function() {
    const waitingBadge = document.getElementById('waiting-alert-badge');
    waitingBadge.classList.add('hidden');
    
    // Trigger existing emergency UI logic (if applicable)
    document.getElementById('emergency-graphic-icon').className = "h-8 w-8 text-red-600";
    document.getElementById('emergency-status-title').textContent = "EMERGENCY ACTIVE";
};
/**
 * LIVE TRACKING AND EMERGENCY ALERT INTEGRATION
 */

// 1. Triggered by the "Live Tracking" button in HTML
window.requestLiveLocation = function() {
    const mapContainer = document.getElementById('location-map-container');
    const waitingBadge = document.getElementById('waiting-alert-badge');
    
    if (mapContainer) mapContainer.classList.remove('hidden');
    if (waitingBadge) waitingBadge.classList.remove('hidden');
    
    console.log("Tracking requested. Redirecting to GRIET location.");
    window.open("https://maps.app.goo.gl/b5A5DQxDSGBuLG367", "_blank");
};

// 2. The Listener - Call this on page load to monitor the hardware
function listenForHardwareAlerts() {
    const db = firebase.database();
    const alertSound = document.getElementById('alert-sound');

    db.ref('emergency/status').on('value', (snapshot) => {
        const isAlertActive = snapshot.val(); // Expecting true or 1 from ESP32

        if (isAlertActive === true || isAlertActive === 1) {
            // A. Play alert sound
            if (alertSound) alertSound.play().catch(e => console.log("Audio requires interaction"));

            // B. Visual Alert
            const title = document.getElementById('emergency-status-title');
            if (title) title.textContent = "EMERGENCY ACTIVE";
            
            // C. Auto-Redirect
            window.location.href = "https://maps.app.goo.gl/b5A5DQxDSGBuLG367";
        }
    });/**
 * Monitors the Firebase 'emergency' node
 */
/**
 * Monitors the Firebase 'emergency' node for hardware alerts
 */
function initEmergencySystem() {
    const db = firebase.database();
    const alertSound = document.getElementById('alert-sound');
    const redirectUrl = "https://maps.app.goo.gl/b5A5DQxDSGBuLG367";

    // Listen to the 'emergency' path
    db.ref('emergency').on('value', (snapshot) => {
        const data = snapshot.val(); 

        // Check if the device sent triggered: true
        if (data && data.triggered === true) {
            console.log("Hardware Alert Triggered!");

            // 1. Play Audio (Click anywhere on page first!)
            if (alertSound) {
                alertSound.play().catch(e => console.log("Audio waiting for user interaction"));
            }

            // 2. Visual Feedback
            alert("EMERGENCY ALERT RECEIVED! Redirecting to location...");

            // 3. Redirect to the specific link
            window.location.href = redirectUrl;
        }
    });
}
}