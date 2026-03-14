import { useState, useEffect } from 'react';

const STORAGE_KEY = "wellbeing_history";
const MAX_ENTRIES = 30;

function formatShortDate(dateObj) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  return `${month} ${day}`;
}

export function useHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to parse history from localStorage:", error);
    }
  }, []);

  const saveCheckIn = (inputs, result) => {
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

    const newHistory = [entry, ...history];
    if (newHistory.length > MAX_ENTRIES) {
      newHistory.pop();
    }

    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    return entry;
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getHistoryChartData = () => {
    // Take the subset of the most recent 10 max
    const recent10 = history.slice(0, 10);
    
    // Reverse them for chronological left-to-right display
    recent10.reverse();
    
    return {
      labels: recent10.map(item => item.date),
      scores: recent10.map(item => item.total),
      colors: recent10.map(item => item.color)
    };
  };

  return { history, saveCheckIn, clearHistory, getHistoryChartData };
}
