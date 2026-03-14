import THRESHOLDS from '../data/datasets.json';

function getScore(value, key) {
  if (!THRESHOLDS || !THRESHOLDS[key]) {
      return { score: 0, label: "Unknown", note: "Thresholds not loaded", weight: 0 };
  }

  const factorData = THRESHOLDS[key];
  const thresholdInfo = factorData.thresholds.find(t => value <= t.max);

  return {
    score: thresholdInfo ? thresholdInfo.score : 0,
    label: thresholdInfo ? thresholdInfo.label : "Unknown",
    note: thresholdInfo ? thresholdInfo.note : "",
    weight: factorData.weight
  };
}

/**
 * Main calculateRisk function that accepts an object of numeric inputs.
 */
export function calculateRisk(inputs) {
  if (!THRESHOLDS) {
    console.warn("Thresholds not loaded yet. Unable to calculate risk.");
    return null;
  }

  // Get individual factor details
  const factors = {
    online: getScore(inputs.online, 'online'),
    social: getScore(inputs.social, 'social'),
    sleep: getScore(inputs.sleep, 'sleep'),
    activity: getScore(inputs.activity, 'activity')
  };

  // Compute total score based on weights
  let totalScoreRaw = 0;
  totalScoreRaw += factors.online.score * factors.online.weight;
  totalScoreRaw += factors.social.score * factors.social.weight;
  totalScoreRaw += factors.sleep.score * factors.sleep.weight;
  totalScoreRaw += factors.activity.score * factors.activity.weight;

  const total = Math.round(totalScoreRaw);

  // Determine level and color
  let level = "Low";
  let color = "#1D9E75"; 

  if (total >= 40 && total <= 69) {
    level = "Moderate";
    color = "#EF9F27";
  } else if (total >= 70) {
    level = "High";
    color = "#E24B4A";
  }

  return {
    total,
    level,
    color,
    factors
  };
}
