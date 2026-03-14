const STORAGE_KEY = "wellbeing_history";
const MAX_ENTRIES = 30;

/**
 * Reads history from localStorage.
 * 
 * @returns {Array} Array of history entries, newest first.
 */
function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse history from localStorage:", error);
    return [];
  }
}

/**
 * Formats a Date object as a short string like "Mar 14".
 * 
 * @param {Date} dateObj - The date to format.
 * @returns {string} Formatted short date string.
 */
function formatShortDate(dateObj) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  return `${month} ${day}`;
}

/**
 * Saves a single check-in result to localStorage.
 * 
 * @param {Object} inputs - Original user inputs ({online, social, sleep, activity})
 * @param {Object} result - Result object from calculateRisk()
 * @returns {Object} The freshly created history entry
 */
function saveCheckIn(inputs, result) {
  const now = new Date();
  
  const entry = {
    id: Date.now().toString(),
    timestamp: now.toISOString(),
    date: formatShortDate(now),
    inputs: { ...inputs },
    total: result.total,
    level: result.level,
    color: result.color,
    factors: result.factors
  };

  const history = getHistory();
  
  // Newest first
  history.unshift(entry);
  
  if (history.length > MAX_ENTRIES) {
    history.pop();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  
  return entry;
}

/**
 * Clears all saved check-in history from localStorage.
 * 
 * @returns {boolean} True when complete
 */
function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
  return true;
}

/**
 * Prepares the history data specifically for a Chart.js line chart.
 * Requires reversing the latest 10 items so the oldest is on the left.
 * 
 * @returns {Object} { labels: [...], scores: [...], colors: [...] }
 */
function getHistoryChartData() {
  const history = getHistory();
  
  // Take the subset of the most recent 10 max
  const recent10 = history.slice(0, 10);
  
  // Reverse them for chronological left-to-right display
  recent10.reverse();
  
  return {
    labels: recent10.map(item => item.date),
    scores: recent10.map(item => item.total),
    colors: recent10.map(item => item.color)
  };
}

// Attach to window
window.HistoryEngine = { 
  saveCheckIn, 
  getHistory, 
  clearHistory, 
  getHistoryChartData 
};
