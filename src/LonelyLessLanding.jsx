import { useState, useEffect, useRef } from 'react';
import { useTheme, THEME_KEYS } from './ThemeProvider';

// ─────────────────────────────────────────────────────────────────────────────
// STYLES CONSTANT
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `
  /* CSS Variables are now injected dynamically by ThemeProvider */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  html { scroll-behavior: smooth; }
  
  body {
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--cream);
    overflow-x: hidden;
  }

  /* View Transition API rules for Theme Droplet Ripple */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
  }
  ::view-transition-old(root) {
    z-index: 1;
  }
  ::view-transition-new(root) {
    z-index: 2;
  }

  .ll-grain {
    position: fixed; inset: 0; pointer-events: none;
    z-index: 100; opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50%     { opacity: .5; transform: scale(.7); }
  }
  @keyframes shimmer {
    0%,100% { opacity: .4; }
    50%     { opacity: 1; }
  }

  .ll-divider {
    height: 0.5px;
    background: var(--border);
  }

  @media (max-width: 640px) {
    .ll-steps-grid    { grid-template-columns: 1fr !important; }
    .ll-factors-grid  { grid-template-columns: 1fr !important; }
    .ll-research-grid { grid-template-columns: 1fr !important; }
    .ll-score-preview { flex-direction: column !important; align-items: flex-start !important; gap: 1.5rem !important; }
    .ll-stats         { flex-wrap: wrap !important; }
    .ll-stat-item     { padding: .75rem 1.5rem !important; }
    .ll-stat-divider  { display: none !important; }
    .ll-nav-links     { display: none !important; }
    .ll-hide-mobile   { display: none !important; }
    .ll-cta-inner     { padding: 2.5rem 1.5rem !important; }
    .ll-hero-h1       { font-size: 2.6rem !important; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// DATA CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const STATS = [
  { num: '1 in 4', numEm: true,  label: 'adults feel lonely every day' },
  { num: '15×',    numEm: true,  label: 'cigarettes a day — equivalent health risk' },
  { num: '30s',    numEm: true,  label: 'to get your full risk score' },
  { num: '4',      numEm: true,  label: 'research-backed factors measured' },
];

const STEPS = [
  {
    num: '01',
    title: 'Set your four sliders',
    body: 'Hours online, social interactions, sleep, and physical activity — the four lifestyle factors most strongly linked to loneliness by peer-reviewed research.',
  },
  {
    num: '02',
    title: 'Get your risk score',
    body: 'A weighted algorithm based on WHO and UCLA thresholds combines your inputs into a 0–100 loneliness risk score, broken down by each factor.',
  },
  {
    num: '03',
    title: 'Act on your suggestions',
    body: 'Personalised, research-cited recommendations fire based on your score — not generic advice, but specific actions ranked by impact on your result.',
  },
];

const FACTORS = [
  {
    icon: '📱',
    title: 'Screen time',
    body: 'Excessive online time displaces face-to-face interaction and correlates with increased social isolation. The WHO flags more than 6 hours per day as a caution threshold.',
    source: 'WHO Digital Wellbeing Guidelines 2023',
    weight: '25%',
  },
  {
    icon: '🤝',
    title: 'Social interactions',
    body: 'The single strongest predictor in the UCLA Loneliness Scale. Meaningful contact frequency — not just follower counts — determines perceived social connectedness.',
    source: 'UCLA Loneliness Scale 2020',
    weight: '30%',
  },
  {
    icon: '🌙',
    title: 'Sleep quality',
    body: 'NIH longitudinal data links irregular or insufficient sleep to a 35% higher depression risk, which both causes and amplifies loneliness in a documented feedback loop.',
    source: 'NIH Sleep Deprivation Research',
    weight: '25%',
  },
  {
    icon: '🏃',
    title: 'Physical activity',
    body: 'Even light aerobic activity reduces depression risk by up to 30%. Team sports and group exercise have a compounding benefit through social contact.',
    source: 'WHO Physical Activity Guidelines 2022',
    weight: '20%',
  },
];

const RESEARCH = [
  {
    source: 'Holt-Lunstad et al., 2015',
    stat:   '26% higher mortality risk',
    body:   'Social isolation is associated with a 26% increased likelihood of premature death — comparable to obesity and exceeding physical inactivity.',
  },
  {
    source: 'UCLA Loneliness Scale, 2020',
    stat:   '61% of adults feel lonely',
    body:   "More than 3 in 5 adults reported feeling lonely, left out, or isolated in Cigna's large-scale study using the UCLA Loneliness Scale.",
  },
  {
    source: 'WHO Digital Wellbeing, 2023',
    stat:   '+23% loneliness above 5 hrs/day',
    body:   'Passive social media use beyond 5 hours daily is linked to a 23% increase in reported loneliness, independent of in-person contact.',
  },
  {
    source: 'NIH Sleep Research',
    stat:   '35% higher depression risk',
    body:   'Irregular sleep schedules — independent of total hours — increase depression risk by 35%, creating a feedback loop with social withdrawal.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function LogoDot({ size = 7 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--sage)',
      animation: 'pulse-dot 2s ease-in-out infinite',
      flexShrink: 0,
    }} />
  );
}

function SectionTag({ children, center = false }) {
  return (
    <div style={{
      fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase',
      color: 'var(--cream3)', marginBottom: '1rem', fontWeight: 500,
      textAlign: center ? 'center' : 'left',
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, center = false }) {
  return (
    <h2 style={{
      fontFamily: "'DM Serif Display', serif",
      fontSize: 'clamp(2rem, 4vw, 2.8rem)',
      fontWeight: 400, lineHeight: 1.1,
      letterSpacing: '-.02em', marginBottom: '1.25rem',
      textAlign: center ? 'center' : 'left',
    }}>
      {children}
    </h2>
  );
}

function StatNumber({ value }) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return <>{value}</>;
  return (
    <>
      {match[1]}
      <em style={{ fontStyle: 'italic', color: 'var(--sage)' }}>{match[2]}</em>
    </>
  );
}

function NavLink({ children, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 13, color: hovered ? 'var(--cream)' : 'var(--cream3)',
        fontWeight: 300, cursor: 'pointer', transition: 'color .2s',
      }}
    >
      {children}
    </span>
  );
}

const DEMO_CIRCUMFERENCE = 2 * Math.PI * 50; // ≈ 314

function ScoreRingDemo() {
  const offset = DEMO_CIRCUMFERENCE * (1 - 65 / 100);
  return (
    <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
      <svg width="120" height="120" viewBox="0 0 120 120"
        style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r="50"
          fill="none" stroke="var(--surface2)" strokeWidth="7"/>
        <circle cx="60" cy="60" r="50"
          fill="none" stroke="#d4924a" strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={DEMO_CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .9s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '2rem', lineHeight: 1, color: 'var(--cream)'
        }}>65%</span>
        <span style={{
          fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase',
          color: 'var(--cream3)', marginTop: 2
        }}>risk</span>
      </div>
    </div>
  );
}

function BtnPrimary({ children, onClick, large = false }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: large ? 16 : 15,
        fontWeight: 500,
        color: 'var(--bg)',
        background: hovered ? 'var(--sage)' : 'var(--cream)',
        border: 'none',
        borderRadius: 14,
        padding: large ? '16px 36px' : '14px 28px',
        cursor: 'pointer',
        transition: 'background .2s, transform .1s',
        transform: pressed ? 'scale(0.99)' : 'scale(1)',
        letterSpacing: '.01em',
      }}
    >
      {children}
    </button>
  );
}

function BtnGhost({ children, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14, fontWeight: 300,
        color: hovered ? 'var(--cream)' : 'var(--cream2)',
        background: 'transparent',
        border: `0.5px solid ${hovered ? 'var(--cream3)' : 'var(--border2)'}`,
        borderRadius: 14,
        padding: '14px 24px',
        cursor: 'pointer',
        transition: 'all .2s',
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, style = {}, className = '' }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface)',
        border: `0.5px solid ${hovered ? 'var(--border2)' : 'var(--border)'}`,
        borderRadius: 20,
        padding: '1.75rem',
        transition: 'border-color .2s',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ThemeSlider() {
  const { themeId, changeTheme, themes } = useTheme();
  const activeIndex = THEME_KEYS.indexOf(themeId) === -1 ? 0 : THEME_KEYS.indexOf(themeId);

  return (
    <div style={{
      display: 'inline-flex',
      background: 'var(--surface2)',
      borderRadius: 99,
      padding: 4,
      position: 'relative',
      border: '0.5px solid var(--border)',
    }}>
      {/* Sliding indicator pill */}
      <div style={{
        position: 'absolute',
        top: 4, bottom: 4, left: 4,
        width: 'calc(33.33% - 2.66px)',
        borderRadius: 99,
        background: 'var(--surface)',
        border: '0.5px solid var(--border2)',
        transform: `translateX(${activeIndex * 100}%)`,
        transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }} />
      
      {THEME_KEYS.map((key) => (
        <button
          key={key}
          onClick={(e) => changeTheme(key, e)}
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            padding: '6px 14px',
            background: 'transparent',
            border: 'none',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            color: themeId === key ? 'var(--cream)' : 'var(--cream3)',
            cursor: 'pointer',
            transition: 'color 0.3s',
            minWidth: 90,
          }}
        >
          {themes[key].name}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function LonelyLessLanding() {
  const { changeTheme } = useTheme();
  const sectionRefs = {
    how:      useRef(null),
    science:  useRef(null),
    research: useRef(null),
    cta:      useRef(null),
  };

  const scrollTo = (key) =>
    sectionRefs[key]?.current?.scrollIntoView({ behavior: 'smooth' });

  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Inject STYLES
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Inject Google Fonts and Title
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.title = 'LonelyLess — Know your loneliness risk';
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="ll-grain" />

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '1.1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: navScrolled ? 'var(--bg)' : 'transparent',
        backdropFilter: navScrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: navScrolled ? 'blur(12px)' : 'none',
        borderBottom: navScrolled ? '0.5px solid var(--border)' : '0.5px solid transparent',
        transition: 'all .3s',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 14, fontWeight: 500, color: 'var(--cream)', letterSpacing: '.02em'
        }}>
          <LogoDot />
          LonelyLess
        </div>

        {/* Nav links */}
        <div className="ll-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          {[
            { label: 'How it works', key: 'how' },
            { label: 'The science',  key: 'science' },
            { label: 'Research',     key: 'research' },
          ].map(({ label, key }) => (
            <NavLink key={key} onClick={() => scrollTo(key)}>{label}</NavLink>
          ))}
        </div>

        {/* CTA and ThemeSlider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="ll-hide-mobile">
            <ThemeSlider />
          </div>
          <button
            onClick={() => window.location.href = '/app'}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 500,
              color: 'var(--bg)', background: 'var(--cream)',
              border: 'none', borderRadius: 99,
              padding: '8px 18px', cursor: 'pointer',
              transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--sage)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--cream)'}
          >
            Check my score →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '8rem 1.5rem 4rem',
        position: 'relative',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--surface2)', border: '0.5px solid var(--border2)',
          borderRadius: 99, padding: '6px 16px 6px 10px',
          fontSize: 11, color: 'var(--cream2)', letterSpacing: '.1em',
          textTransform: 'uppercase', marginBottom: '2rem',
          animation: 'fadeUp .6s ease both',
        }}>
          <LogoDot size={7} />
          Free · No signup · Research-backed
        </div>

        {/* H1 */}
        <h1 className="ll-hero-h1" style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(2.8rem, 8vw, 5rem)',
          fontWeight: 400, lineHeight: 1.05,
          letterSpacing: '-.03em',
          maxWidth: 720, margin: '0 auto 1.5rem',
          animation: 'fadeUp .6s .1s ease both',
        }}>
          Feel{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--sage)' }}>less alone</em>,
          <br />one check-in at a time.
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(15px, 2vw, 17px)',
          color: 'var(--cream3)', fontWeight: 300, lineHeight: 1.7,
          maxWidth: 480, margin: '0 auto 2.5rem',
          animation: 'fadeUp .6s .2s ease both',
        }}>
          LonelyLess turns 4 lifestyle inputs into an honest loneliness risk
          score — backed by UCLA, WHO, and NIH research. Takes 30 seconds.
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          flexWrap: 'wrap', justifyContent: 'center',
          animation: 'fadeUp .6s .3s ease both',
          marginBottom: '3rem',
        }}>
          <BtnPrimary onClick={() => window.location.href = '/app'}>
            Check my LonelyLess score →
          </BtnPrimary>
          <BtnGhost onClick={() => scrollTo('how')}>
            See how it works
          </BtnGhost>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2.5rem',
          left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          fontSize: 11, color: 'var(--cream3)',
          letterSpacing: '.12em', textTransform: 'uppercase',
          animation: 'fadeUp .6s .5s ease both',
        }}>
          <div style={{
            width: '0.5px', height: 40,
            background: 'linear-gradient(to bottom, var(--cream3), transparent)',
          }} />
          Scroll
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="ll-stats" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexWrap: 'wrap',
        borderTop: '0.5px solid var(--border)',
        borderBottom: '0.5px solid var(--border)',
        padding: '2.5rem 2rem',
      }}>
        {STATS.map((s, i) => (
          <div key={i} className="ll-stat-item" style={{
            textAlign: 'center', padding: '1rem 3rem', position: 'relative'
          }}>
            {i > 0 && (
              <div className="ll-stat-divider" style={{
                position: 'absolute', left: 0, top: '20%', height: '60%',
                width: '0.5px', background: 'var(--border)'
              }} />
            )}
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '2.4rem', fontWeight: 400, color: 'var(--cream)', lineHeight: 1
            }}>
              <StatNumber value={s.num} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--cream3)', fontWeight: 300, marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ── */}
      <section ref={sectionRefs.how} style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <SectionTag>How it works</SectionTag>
          <SectionTitle>
            Simple inputs.<br />
            <em style={{ fontStyle: 'italic', color: 'var(--sage)' }}>Honest</em> output.
          </SectionTitle>
          <p style={{
            fontSize: 16, color: 'var(--cream3)', fontWeight: 300,
            lineHeight: 1.7, maxWidth: 520, marginBottom: '3.5rem'
          }}>
            No account. No personal data stored. Just four sliders and a score
            that tells you where you stand.
          </p>
          <div className="ll-steps-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16
          }}>
            {STEPS.map((step, i) => (
              <Card key={i}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 99,
                  background: 'var(--surface2)', border: '0.5px solid var(--border2)',
                  fontSize: 12, fontWeight: 500, color: 'var(--cream2)',
                  marginBottom: '1.25rem',
                }}>
                  {step.num}
                </div>
                <h3 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '1.2rem', fontWeight: 400,
                  marginBottom: '.6rem', color: 'var(--cream)'
                }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--cream3)', fontWeight: 300, lineHeight: 1.65 }}>
                  {step.body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="ll-divider" />

      {/* ── THE SCIENCE ── */}
      <section ref={sectionRefs.science} style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <SectionTag>The science</SectionTag>
          <SectionTitle>
            Four factors.<br />
            One <em style={{ fontStyle: 'italic', color: 'var(--sage)' }}>rigorous</em> model.
          </SectionTitle>
          <p style={{
            fontSize: 16, color: 'var(--cream3)', fontWeight: 300,
            lineHeight: 1.7, maxWidth: 520, marginBottom: '3.5rem'
          }}>
            Every threshold in LonelyLess comes from a published study.
            Here's what we measure and why.
          </p>

          {/* Factor cards */}
          <div className="ll-factors-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12, marginBottom: 12
          }}>
            {FACTORS.map((f, i) => (
              <Card key={i} style={{ transition: 'border-color .2s, transform .2s' }}>
                <div style={{ fontSize: 22, marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '1.15rem', fontWeight: 400,
                  marginBottom: '.5rem', color: 'var(--cream)'
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--cream3)', fontWeight: 300, lineHeight: 1.65 }}>
                  {f.body}
                </p>
                <div style={{
                  fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase',
                  color: 'var(--cream3)', marginTop: '.85rem', paddingTop: '.75rem',
                  borderTop: '0.5px solid var(--border)'
                }}>
                  Source: <span style={{ color: 'var(--sage)' }}>{f.source}</span>
                  {' '}· Weight: {f.weight}
                </div>
              </Card>
            ))}
          </div>

          {/* Score preview card */}
          <div className="ll-score-preview" style={{
            background: 'var(--surface)', border: '0.5px solid var(--border)',
            borderRadius: 24, padding: '2.5rem', marginTop: '3.5rem',
            display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap',
          }}>
            <ScoreRingDemo />
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '1.3rem', fontWeight: 400,
                marginBottom: '.5rem', color: 'var(--cream)'
              }}>
                Moderate loneliness risk
              </h3>
              <p style={{
                fontSize: 13, color: 'var(--cream2)', fontWeight: 300,
                lineHeight: 1.6, marginBottom: '1rem'
              }}>
                A few areas need attention. You're closer to connection than you think.
                Here's what your breakdown looks like:
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { label: 'Screen time · Elevated', color: 'var(--amber)' },
                  { label: 'Social life · Concerning', color: 'var(--red)' },
                  { label: 'Sleep · Good', color: 'var(--sage)' },
                  { label: 'Exercise · Good', color: 'var(--sage)' },
                ].map((tag, i) => (
                  <span key={i} style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 99,
                    background: 'var(--surface2)', border: '0.5px solid var(--border2)',
                    color: tag.color,
                  }}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ll-divider" />

      {/* ── RESEARCH ── */}
      <section ref={sectionRefs.research} style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <SectionTag>Research</SectionTag>
          <SectionTitle>
            The numbers<br />
            don't <em style={{ fontStyle: 'italic', color: 'var(--sage)' }}>lie</em>.
          </SectionTitle>
          <p style={{
            fontSize: 16, color: 'var(--cream3)', fontWeight: 300,
            lineHeight: 1.7, maxWidth: 520, marginBottom: '3.5rem'
          }}>
            Loneliness is a public health crisis hiding in plain sight.
            These are the findings that built LonelyLess.
          </p>
          <div className="ll-research-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12
          }}>
            {RESEARCH.map((r, i) => (
              <Card key={i} style={{ borderRadius: 18, padding: '1.5rem' }}>
                <div style={{
                  fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase',
                  color: 'var(--sage)', fontWeight: 500, marginBottom: '.6rem'
                }}>
                  {r.source}
                </div>
                <div style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '1.6rem', color: 'var(--cream)',
                  marginBottom: '.4rem', lineHeight: 1.1
                }}>
                  {r.stat}
                </div>
                <div style={{ fontSize: 13, color: 'var(--cream3)', fontWeight: 300, lineHeight: 1.6 }}>
                  {r.body}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="ll-divider" />

      {/* ── CTA ── */}
      <section ref={sectionRefs.cta} style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="ll-cta-inner" style={{
          maxWidth: 600, margin: '0 auto',
          background: 'var(--surface)', border: '0.5px solid var(--border)',
          borderRadius: 28, padding: '4rem 3rem',
        }}>
          <SectionTag center>Free forever</SectionTag>
          <SectionTitle center>
            Know where<br />you{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--sage)' }}>actually</em> stand.
          </SectionTitle>
          <p style={{
            fontSize: 16, color: 'var(--cream3)', fontWeight: 300, lineHeight: 1.7,
            maxWidth: 420, margin: '0 auto 2rem', textAlign: 'center',
          }}>
            No login. No personal data. Just an honest score and a clear
            path forward — in 30 seconds.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <BtnPrimary large onClick={() => window.location.href = '/app'}>
              Check my LonelyLess score →
            </BtnPrimary>
            <span style={{ fontSize: 12, color: 'var(--cream3)', fontWeight: 300 }}>
              Uses open research data · Not your personal data
            </span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: '2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem',
        borderTop: '0.5px solid var(--border)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 13, fontWeight: 500, color: 'var(--cream2)'
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sage)' }} />
          LonelyLess
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[
            { label: 'How it works', key: 'how' },
            { label: 'The science',  key: 'science' },
            { label: 'Research',     key: 'research' },
          ].map(({ label, key }) => (
            <span
              key={key}
              onClick={() => scrollTo(key)}
              style={{
                fontSize: 12, color: 'var(--cream3)', fontWeight: 300,
                cursor: 'pointer', transition: 'color .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--cream2)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--cream3)'}
            >
              {label}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--cream3)', fontWeight: 300 }}>
          © 2025 LonelyLess · Open research data only
        </div>
      </footer>

    </div>
  );
}

export default LonelyLessLanding;
