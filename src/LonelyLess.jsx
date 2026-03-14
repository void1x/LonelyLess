import { useState, useEffect, useCallback } from 'react';
import { useTheme } from './ThemeProvider';
import ThemeSlider from './ThemeSlider';

// ─────────────────────────────────────────────────────────────────────────────
// STYLES CONSTANT
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `
  /* CSS Variables are now injected dynamically by ThemeProvider */
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--cream);
    min-height: 100vh;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0%,100% { opacity: .4; }
    50%     { opacity: 1; }
  }

  @keyframes pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50%     { opacity: .5; transform: scale(.7); }
  }

  input[type=range] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 3px;
    border-radius: 99px;
    outline: none;
    cursor: pointer;
  }

  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--cream);
    cursor: pointer;
    box-shadow: 0 0 0 3px rgba(240,236,227,0.12);
    transition: transform .15s, background .15s;
  }

  input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    background: var(--sage);
  }

  input[type=range]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--cream);
    cursor: pointer;
    border: none;
    box-shadow: 0 0 0 3px rgba(240,236,227,0.12);
    transition: transform .15s, background .15s;
  }

  .grain {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  @media (max-width: 640px) {
    .ll-hide-mobile { display: none !important; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// SLIDERS CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SLIDERS = [
  { key: 'online',   label: 'Hours online / day',         min: 0,  max: 16, unit: 'hrs',      hint: 'WHO caution: >6 hrs/day'    },
  { key: 'social',   label: 'Social interactions / week', min: 0,  max: 21, unit: 'times',    hint: 'Optimal: 7–14 per week'     },
  { key: 'sleep',    label: 'Sleep hours / night',        min: 2,  max: 12, unit: 'hrs',      hint: 'NIH optimal: 7–9 hrs'       },
  { key: 'activity', label: 'Physical activity / week',   min: 0,  max: 14, unit: 'sessions', hint: 'WHO target: ≥3 sessions'    },
];

const FACTOR_LABELS = {
  online:   'Screen time',
  social:   'Social life',
  sleep:    'Sleep',
  activity: 'Exercise',
};

// ─────────────────────────────────────────────────────────────────────────────
// SUGGESTIONS ENGINE
// ─────────────────────────────────────────────────────────────────────────────
const RULES = [
  { trigger: 'online',   threshold: 45, icon: '📵', action: 'Set a daily screen time limit',
    why: 'WHO links >5 hrs/day to a 23% higher loneliness risk.' },
  { trigger: 'online',   threshold: 70, icon: '🚶', action: 'Replace 1 hr of screens with a walk',
    why: 'Outdoor time lowers cortisol and creates natural social opportunities.' },
  { trigger: 'social',   threshold: 50, icon: '📞', action: 'Schedule 2 calls with friends this week',
    why: 'Social contact frequency is the single strongest predictor of loneliness.' },
  { trigger: 'social',   threshold: 70, icon: '🏘️', action: 'Join a local club or community group',
    why: 'Structured groups provide consistent, low-effort social contact.' },
  { trigger: 'social',   threshold: 88, icon: '🤝', action: 'Reach out to one person today',
    why: 'Severe isolation carries health risks equal to smoking 15 cigarettes a day.' },
  { trigger: 'sleep',    threshold: 35, icon: '🌙', action: 'Fix a consistent sleep and wake time',
    why: 'Irregular sleep increases depression risk by 35% independent of hours slept.' },
  { trigger: 'sleep',    threshold: 60, icon: '📱', action: 'No screens 1 hour before bed',
    why: 'Blue light delays sleep onset by up to 90 minutes.' },
  { trigger: 'activity', threshold: 45, icon: '🏃', action: 'Add a 20-min walk 3× per week',
    why: 'Even light exercise reduces depression risk by up to 30% (WHO data).' },
  { trigger: 'activity', threshold: 70, icon: '⚽', action: 'Try a team sport or group fitness class',
    why: 'Social exercise doubles the mental health benefit of solo workouts.' },
];

const DEFAULT_SUGGESTION = {
  icon: '✅',
  action: 'Keep up your current habits',
  why: 'Your lifestyle already supports good social wellbeing. Check in weekly on LonelyLess.',
};

function getSuggestions(scores, max = 4) {
  const matched = RULES.filter(r => scores[r.trigger] >= r.threshold).slice(0, max);
  return matched.length ? matched : [DEFAULT_SUGGESTION];
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORING LOGIC
// ─────────────────────────────────────────────────────────────────────────────
function sOnline(h) {
  if (h <= 3)  return 5;
  if (h <= 5)  return 20;
  if (h <= 7)  return 45;
  if (h <= 9)  return 65;
  if (h <= 12) return 80;
  return 95;
}

function sSocial(s) {
  if (s >= 14) return 5;
  if (s >= 10) return 15;
  if (s >= 7)  return 30;
  if (s >= 4)  return 50;
  if (s >= 2)  return 70;
  if (s >= 1)  return 85;
  return 98;
}

function sSleep(h) {
  if (h >= 7 && h <= 9)    return 5;
  if (h === 6 || h === 10) return 30;
  if (h === 5 || h === 11) return 60;
  if (h <= 4)              return 85;
  return 70;
}

function sActivity(a) {
  if (a >= 5)  return 5;
  if (a >= 3)  return 20;
  if (a === 2) return 45;
  if (a === 1) return 65;
  return 88;
}

function getRatingMeta(score) {
  if (score <= 25) return { label: 'Good',       color: '#7db89a' };
  if (score <= 55) return { label: 'Moderate',   color: '#d4924a' };
  return               { label: 'Concerning', color: '#c25f5f' };
}

function calculateRisk(vals) {
  const scores = {
    online:   sOnline(vals.online),
    social:   sSocial(vals.social),
    sleep:    sSleep(vals.sleep),
    activity: sActivity(vals.activity),
  };
  const total = Math.round(
    scores.online   * 0.25 +
    scores.social   * 0.30 +
    scores.sleep    * 0.25 +
    scores.activity * 0.20
  );

  let level, color, summary;
  if (total >= 70) {
    level   = 'High loneliness risk';
    color   = '#c25f5f';
    summary = 'Your habits show multiple risk factors. Small, consistent changes will meaningfully reduce your loneliness risk.';
  } else if (total >= 40) {
    level   = 'Moderate loneliness risk';
    color   = '#d4924a';
    summary = "A few areas need attention. You're closer to connection than you think.";
  } else {
    level   = 'Low loneliness risk';
    color   = '#7db89a';
    summary = 'Your lifestyle habits support good social wellbeing. Keep monitoring weekly with LonelyLess.';
  }

  const factorNotes = {
    online:   vals.online <= 5    ? 'Within the healthy range'  : vals.online <= 8   ? 'Slightly above optimal' : 'High — consider reducing',
    social:   vals.social >= 7    ? 'Good connection level'     : vals.social >= 4   ? 'Could be improved'      : 'Low — prioritise connection',
    sleep:   (vals.sleep >= 7 && vals.sleep <= 9)
                                  ? 'Optimal range'             : vals.sleep < 7     ? 'Below recommended'      : 'Slightly over optimal',
    activity: vals.activity >= 3  ? 'Meeting WHO target'        : vals.activity >= 1 ? 'Below the target'       : 'Sedentary — key risk factor',
  };

  const factors = Object.entries(scores).map(([key, score]) => ({
    key, score, note: factorNotes[key], ...getRatingMeta(score),
  }));

  return { total, level, color, summary, factors, scores };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getTrackStyle(value, min, max) {
  const pct = ((value - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, #7db89a ${pct}%, #1e1f1c ${pct}%)`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE RING SUB-COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const CIRCUMFERENCE = 2 * Math.PI * 46; // ≈ 289

function ScoreRing({ score, color }) {
  const offset = CIRCUMFERENCE * (1 - score / 100);
  return (
    <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
      <svg
        width="110" height="110" viewBox="0 0 110 110"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx="55" cy="55" r="46"
          fill="none" stroke="var(--surface2)" strokeWidth="7"
        />
        <circle
          cx="55" cy="55" r="46"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .9s cubic-bezier(.4,0,.2,1), stroke .4s' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '1.9rem', lineHeight: 1, color: 'var(--cream)',
        }}>
          {score}%
        </span>
        <span style={{
          fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase',
          color: 'var(--cream3)', marginTop: 2,
        }}>
          risk
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function LonelyLess() {
  const [values, setValues] = useState({ online: 5, social: 4, sleep: 7, activity: 3 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 540
  );

  // Inject styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Inject Google Fonts & set title
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.title = 'LonelyLess — Know your loneliness risk';
    return () => document.head.removeChild(link);
  }, []);

  // Responsive handler
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 540);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Load history data when modal opens
  useEffect(() => {
    if (showHistory) {
      const data = JSON.parse(localStorage.getItem('lonelyless_history') || '[]');
      setHistoryData(data);
    }
  }, [showHistory, saved]);

  const handleAnalyze = useCallback(() => {
    setLoading(true);
    setResult(null);
    setSaved(false);
    setTimeout(() => {
      const risk = calculateRisk(values);
      const suggestions = getSuggestions(risk.scores);
      setResult({ ...risk, suggestions });
      setLoading(false);
    }, 600);
  }, [values]);

  const handleSave = useCallback(() => {
    if (!result) return;
    const history = JSON.parse(localStorage.getItem('lonelyless_history') || '[]');
    history.unshift({
      id:        Date.now().toString(),
      timestamp: new Date().toISOString(),
      date:      new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      inputs:    { ...values },
      total:     result.total,
      level:     result.level,
      color:     result.color,
    });
    localStorage.setItem('lonelyless_history', JSON.stringify(history.slice(0, 30)));
    setSaved(true);
  }, [result, values]);

  const col2 = isMobile ? '1fr' : 'repeat(2, 1fr)';

  return (
    <>
      {/* Grain overlay */}
      <div className="grain" />

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '1.1rem 2rem', borderBottom: '0.5px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg)', opacity: 0.95, backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        {/* Logo / Back Link */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 14, fontWeight: 500, color: 'var(--cream)', letterSpacing: '.02em',
          cursor: 'pointer'
        }} onClick={() => window.location.href = '/'}>
          <img src="/logo.svg" alt="Logo" style={{ width: 18, height: 18 }} />
          LonelyLess
        </div>

        <div className="ll-hide-mobile">
          <ThemeSlider />
        </div>
      </nav>

      <div style={{ maxWidth: 620, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>

        {/* ── HERO ── */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeUp .6s ease both' }}>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--surface2)', border: '0.5px solid var(--border2)',
            borderRadius: 99, padding: '6px 16px 6px 10px',
            fontSize: 12, color: 'var(--cream2)', letterSpacing: '.08em',
            textTransform: 'uppercase', marginBottom: '1.5rem',
            cursor: 'pointer', transition: 'border-color .2s, color .2s'
          }}
          onClick={() => setShowHistory(true)}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cream3)'; e.currentTarget.style.color = 'var(--cream)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--cream2)'; }}
          >
            <div style={{
              width: 7, height: 7, borderRadius: '50%', background: 'var(--sage)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            LonelyLess · View History
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(2.4rem, 7vw, 3.2rem)',
            fontWeight: 400, color: 'var(--cream)',
            lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '.75rem',
          }}>
            How connected are you,{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--sage)' }}>really</em>?
          </h1>

          <p style={{ fontSize: 15, color: 'var(--cream3)', fontWeight: 300, lineHeight: 1.6 }}>
            Four lifestyle inputs. One honest loneliness score.<br />
            Backed by UCLA, WHO and NIH research. Free forever.
          </p>
        </div>

        {/* ── SLIDER GRID ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: col2,
          gap: 12, marginBottom: '1.5rem',
          animation: 'fadeUp .6s .1s ease both',
        }}>
          {SLIDERS.map(s => (
            <div
              key={s.key}
              style={{
                background: 'var(--surface)', border: '0.5px solid var(--border)',
                borderRadius: 18, padding: '1.25rem 1.25rem 1rem',
                transition: 'border-color .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{
                fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase',
                color: 'var(--cream3)', marginBottom: '.75rem', fontWeight: 500,
              }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '2.2rem', color: 'var(--cream)',
                lineHeight: 1, marginBottom: '.2rem',
              }}>
                {values[s.key]}{' '}
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13, color: 'var(--cream3)', fontWeight: 300,
                }}>
                  {s.unit}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--cream3)', fontWeight: 300, marginBottom: '.85rem' }}>
                {s.hint}
              </div>
              <input
                type="range"
                min={s.min} max={s.max} step={1}
                value={values[s.key]}
                onChange={e => setValues(v => ({ ...v, [s.key]: +e.target.value }))}
                style={getTrackStyle(values[s.key], s.min, s.max)}
              />
            </div>
          ))}
        </div>

        {/* ── ANALYZE BUTTON ── */}
        <div style={{ animation: 'fadeUp .6s .2s ease both', marginBottom: '1.5rem' }}>
          <button
            onClick={handleAnalyze}
            style={{
              width: '100%', padding: '1rem',
              background: 'var(--cream)', color: 'var(--bg)',
              border: 'none', borderRadius: 14,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15, fontWeight: 500, letterSpacing: '.01em',
              cursor: 'pointer', transition: 'background .2s, transform .1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--sage)'; e.currentTarget.style.color = 'var(--bg)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--cream)'; e.currentTarget.style.color = 'var(--bg)'; }}
            onMouseDown={e  => { e.currentTarget.style.transform = 'scale(0.99)'; }}
            onMouseUp={e    => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Check my LonelyLess score →
          </button>
        </div>

        {/* ── LOADING ── */}
        {loading && (
          <div style={{
            textAlign: 'center', padding: '2rem',
            color: 'var(--cream3)', fontSize: 14, fontWeight: 300,
            animation: 'shimmer 1.5s infinite',
          }}>
            Measuring your connection level...
          </div>
        )}

        {/* ── RESULTS ── */}
        {result && !loading && (
          <div style={{ animation: 'fadeUp .5s ease both' }}>

            {/* Score hero card */}
            <div style={{
              background: 'var(--surface)', border: '0.5px solid var(--border)',
              borderRadius: 24, padding: '2rem', marginBottom: 12,
              display: 'flex', alignItems: 'center', gap: '2rem',
              flexDirection: isMobile ? 'column' : 'row',
              textAlign:     isMobile ? 'center'  : 'left',
            }}>
              <ScoreRing score={result.total} color={result.color} />
              <div style={{ flex: 1, minWidth: 160 }}>
                <h2 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '1.4rem', fontWeight: 400,
                  marginBottom: '.4rem', color: 'var(--cream)',
                }}>
                  {result.level}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--cream2)', fontWeight: 300, lineHeight: 1.6 }}>
                  {result.summary}
                </p>
                <div style={{ height: 3, background: 'var(--surface2)', borderRadius: 99, marginTop: 12 }}>
                  <div style={{
                    height: 3, borderRadius: 99, background: result.color,
                    width: result.total + '%',
                    transition: 'width .8s cubic-bezier(.4,0,.2,1)',
                  }} />
                </div>
              </div>
            </div>

            {/* Factor cards */}
            <div style={{ display: 'grid', gridTemplateColumns: col2, gap: 10, marginBottom: 12 }}>
              {result.factors.map(f => (
                <div
                  key={f.key}
                  style={{
                    background: 'var(--surface)', border: '0.5px solid var(--border)',
                    borderRadius: 16, padding: '1rem 1.1rem', transition: 'border-color .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{
                    fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: 'var(--cream3)', marginBottom: 6,
                  }}>
                    {FACTOR_LABELS[f.key]}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: f.color, marginBottom: 3 }}>
                    {f.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--cream3)', fontWeight: 300, lineHeight: 1.45 }}>
                    {f.note}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            <div style={{ marginBottom: 12 }}>
              <div style={{
                fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase',
                color: 'var(--cream3)', marginBottom: 10, padding: '0 2px',
              }}>
                What to do next
              </div>
              {result.suggestions.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    background: 'var(--surface)', border: '0.5px solid var(--border)',
                    borderRadius: 14, padding: '1rem 1.1rem', marginBottom: 8,
                    transition: 'border-color .2s, transform .2s', cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--border2)';
                    e.currentTarget.style.transform   = 'translateX(3px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform   = 'translateX(0)';
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: 'var(--surface2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, flexShrink: 0,
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--cream)', marginBottom: 3 }}>
                      {s.action}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--cream3)', fontWeight: 300, lineHeight: 1.5 }}>
                      {s.why}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saved}
              style={{
                width: '100%', padding: '.75rem',
                background: 'transparent',
                border: '0.5px solid var(--border2)',
                borderRadius: 14, marginBottom: 12,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, fontWeight: 400,
                color:  saved ? 'var(--sage)' : 'var(--cream2)',
                cursor: saved ? 'default' : 'pointer',
                transition: 'all .2s',
              }}
              onMouseEnter={e => { if (!saved) e.currentTarget.style.borderColor = 'var(--cream3)'; }}
              onMouseLeave={e => { if (!saved) e.currentTarget.style.borderColor = 'var(--border2)'; }}
            >
              {saved ? 'Saved ✓' : 'Save this check-in'}
            </button>

            {/* Divider */}
            <div style={{ height: '0.5px', background: 'var(--border)', margin: '1.5rem 0' }} />
          </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{
          textAlign: 'center', fontSize: 11, color: 'var(--cream3)',
          fontWeight: 300, lineHeight: 1.7, padding: '0 1rem',
          animation: 'fadeUp .6s .3s ease both',
        }}>
          Scoring based on{' '}
          <a href="https://www.uclahealth.org/programs/uclarrc/research/self-reports/lonelinessscale" target="_blank" rel="noreferrer"
            style={{ color: 'var(--cream2)', textDecoration: 'none', borderBottom: '0.5px solid var(--border2)' }}>
            UCLA Loneliness Scale
          </a>
          {' · '}
          <a href="https://www.who.int/news-room/fact-sheets/detail/physical-activity" target="_blank" rel="noreferrer"
            style={{ color: 'var(--cream2)', textDecoration: 'none', borderBottom: '0.5px solid var(--border2)' }}>
            WHO Digital Wellbeing
          </a>
          {' · '}
          <a href="https://www.nih.gov/news-events/nih-research-matters/sleep-deprivation-increases-alzheimers-biomarkers" target="_blank" rel="noreferrer"
            style={{ color: 'var(--cream2)', textDecoration: 'none', borderBottom: '0.5px solid var(--border2)' }}>
            NIH Sleep Research
          </a>
          {' · '}
          <a href="https://www.who.int/news-room/fact-sheets/detail/physical-activity" target="_blank" rel="noreferrer"
            style={{ color: 'var(--cream2)', textDecoration: 'none', borderBottom: '0.5px solid var(--border2)' }}>
            WHO Activity Guidelines
          </a>
          <br />
          LonelyLess uses open research data — not your personal data.
        </div>

      </div>

      {/* ── HISTORY MODAL ── */}
      {showHistory && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'var(--bg)', opacity: 0.95, // Dynamic backdrop using current theme background
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeUp .3s ease both', padding: '1rem'
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setShowHistory(false); }}
        >
          <div style={{
            width: '100%', maxWidth: 500, maxHeight: '85vh',
            background: 'var(--surface)', border: '0.5px solid var(--border2)',
            borderRadius: 24, padding: '2rem', display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 48px rgba(0,0,0,0.5)', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', fontWeight: 400, color: 'var(--cream)' }}>
                Your Check-In History
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--cream3)',
                  fontSize: 24, cursor: 'pointer', lineHeight: 1, padding: '0 8px'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--cream)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--cream3)'}
              >
                ×
              </button>
            </div>

            <div style={{ overflowY: 'auto', paddingRight: '0.5rem', flex: 1 }}>
              {historyData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--cream3)', fontSize: 14, fontWeight: 300 }}>
                  No check-ins saved yet. Analyze your lifestyle and click "Save this check-in" to start tracking.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {historyData.map(entry => (
                    <div key={entry.id} style={{
                      background: 'var(--surface2)', border: '0.5px solid var(--border)',
                      borderRadius: 16, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem'
                    }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: '50%', border: `2px solid ${entry.color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: 'var(--cream)', flexShrink: 0
                      }}>
                        {entry.total}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                          <span style={{ fontSize: 14, color: entry.color, fontWeight: 500 }}>{entry.level}</span>
                          <span style={{ fontSize: 11, color: 'var(--cream3)', fontWeight: 300 }}>{entry.date}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--cream2)', fontWeight: 300 }}>
                          <span>📱 {entry.inputs.online}h</span>
                          <span>👥 {entry.inputs.social}x</span>
                          <span>🌙 {entry.inputs.sleep}h</span>
                          <span>🏃 {entry.inputs.activity}x</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to clear your entire history?")) {
                        localStorage.removeItem('lonelyless_history');
                        setHistoryData([]);
                      }
                    }}
                    style={{
                      background: 'transparent', border: 'none', color: 'var(--red)',
                      fontSize: 12, cursor: 'pointer', padding: '1rem', marginTop: '1rem',
                      opacity: 0.7, textDecoration: 'underline'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
                  >
                    Clear History
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LonelyLess;
