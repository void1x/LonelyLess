const RULES = [
  // ONLINE Rules
  {
    id: "online-moderate",
    trigger: "online",
    threshold: 20,
    priority: 7,
    icon: "📵",
    action: "Set a daily screen time limit",
    reason: "WHO guidelines link >5 hrs/day screen time to increased social isolation risk.",
    link: null
  },
  {
    id: "online-high",
    trigger: "online",
    threshold: 60,
    priority: 3,
    icon: "🚶",
    action: "Replace screen time with outdoor walks",
    reason: "Outdoor time lowers cortisol and creates natural social interaction opportunities.",
    link: null
  },
  
  // SOCIAL Rules
  {
    id: "social-moderate",
    trigger: "social",
    threshold: 30,
    priority: 5,
    icon: "📞",
    action: "Schedule 2 calls with friends this week",
    reason: "UCLA Loneliness Scale identifies social contact frequency as the strongest predictor of loneliness.",
    link: null
  },
  {
    id: "social-high",
    trigger: "social",
    threshold: 65,
    priority: 1,
    icon: "🏘️",
    action: "Join a local club or community group",
    reason: "Structured group activities provide consistent, low-effort social contact proven to reduce isolation.",
    link: null
  },
  {
    id: "social-critical",
    trigger: "social",
    threshold: 85,
    priority: 0,
    icon: "🤝",
    action: "Reach out to one person today — anyone",
    reason: "Severe social isolation is linked to health outcomes equivalent to smoking 15 cigarettes per day (Holt-Lunstad, 2015).",
    link: null
  },

  // SLEEP Rules
  {
    id: "sleep-moderate",
    trigger: "sleep",
    threshold: 30,
    priority: 6,
    icon: "🌙",
    action: "Set a consistent sleep and wake time",
    reason: "NIH research shows irregular sleep schedules increase depression risk by 35% independent of total hours.",
    link: null
  },
  {
    id: "sleep-high",
    trigger: "sleep",
    threshold: 60,
    priority: 2,
    icon: "📱",
    action: "No screens 1 hour before bed",
    reason: "Blue light from screens suppresses melatonin production and delays sleep onset by up to 90 minutes.",
    link: null
  },

  // ACTIVITY Rules
  {
    id: "activity-moderate",
    trigger: "activity",
    threshold: 45,
    priority: 5,
    icon: "🏃",
    action: "Add a 20-minute walk 3 times per week",
    reason: "WHO data shows even light aerobic exercise reduces depression risk by up to 30%.",
    link: null
  },
  {
    id: "activity-high",
    trigger: "activity",
    threshold: 65,
    priority: 3,
    icon: "⚽",
    action: "Try a team sport or group fitness class",
    reason: "Social exercise combines physical benefits with peer connection — double the mental health impact.",
    link: null
  },
  {
    id: "activity-critical",
    trigger: "activity",
    threshold: 80,
    priority: 1,
    icon: "🧘",
    action: "Start with 10 minutes of movement daily",
    reason: "Sedentary behaviour is independently associated with 25% higher anxiety risk (Biswas et al., 2015).",
    link: null
  }
];

/**
 * Gets personalized suggestions based on factor scores.
 * 
 * @param {Object} factors - The factors object from calculateRisk()
 * @param {number} maxCount - Max number of recommendations to return
 * @returns {Array} Array of recommended action objects
 */
function getSuggestions(factors, maxCount = 4) {
  if (!factors) return [];

  // Filter rules where the relevant factor score meets or exceeds the trigger threshold
  let matchedRules = RULES.filter(rule => {
    const factorData = factors[rule.trigger];
    if (!factorData) return false;
    return factorData.score >= rule.threshold;
  });

  // If everything is healthy (no rules triggered)
  if (matchedRules.length === 0) {
    return [{
      icon: "✅",
      action: "Keep up your current habits",
      reason: "Your lifestyle is in a healthy range. Check in weekly to monitor changes.",
      priority: -1, // Not strictly needed but keeps shape consistent
      link: null
    }];
  }

  // Sort by priority ascending (0 = highest urgency)
  matchedRules.sort((a, b) => a.priority - b.priority);

  // Return the top maxCount rules
  return matchedRules.slice(0, maxCount);
}

// Attach to window
window.RulesEngine = { getSuggestions };
