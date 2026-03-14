import { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  // The clinical, light "MIT Mental Health" color palette
  mental_health: {
    name: 'Mental Health',
    colors: {
      '--bg':       '#f4f7f6',
      '--surface':  '#ffffff',
      '--surface2': '#eef1f0',
      '--border':   'rgba(0,0,0,0.08)',
      '--border2':  'rgba(0,0,0,0.15)',
      '--cream':    '#1e293b',
      '--cream2':   '#475569',
      '--cream3':   '#64748b',
      '--sage':     '#0d9488',
      '--amber':    '#d97706',
      '--red':      '#dc2626',
    }
  },
  // Deep ocean blues
  ocean: {
    name: 'Deep Ocean',
    colors: {
      '--bg':       '#0b1120',
      '--surface':  '#111827',
      '--surface2': '#1e293b',
      '--border':   'rgba(255,255,255,0.08)',
      '--border2':  'rgba(255,255,255,0.16)',
      '--cream':    '#f8fafc',
      '--cream2':   '#cbd5e1',
      '--cream3':   '#94a3b8',
      '--sage':     '#38bdf8',
      '--amber':    '#fbbf24',
      '--red':      '#f87171',
    }
  },
  // Vibrant, energetic tangerine theme
  tangerine: {
    name: 'Tangerine',
    colors: {
      '--bg':       '#fff7ed',
      '--surface':  '#ffedd5',
      '--surface2': '#fed7aa',
      '--border':   'rgba(234,88,12,0.15)',
      '--border2':  'rgba(234,88,12,0.3)',
      '--cream':    '#431407',
      '--cream2':   '#7c2d12',
      '--cream3':   '#9a3412',
      '--sage':     '#ea580c',
      '--amber':    '#d97706',
      '--red':      '#dc2626',
    }
  }
};

export const THEME_KEYS = Object.keys(THEMES);

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    const saved = localStorage.getItem('ll_theme');
    return THEMES[saved] ? saved : 'mental_health';
  });

  // Apply initially on mount to avoid flash
  useEffect(() => {
    const colors = THEMES[themeId].colors;
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    document.body.style.backgroundColor = colors['--bg'];
  }, []); // Run only on mount. Subsequent changes handled by changeTheme

  const changeTheme = (newId, e) => {
    if (newId === themeId) return;
    
    localStorage.setItem('ll_theme', newId);
    
    const applyStyles = () => {
      const colors = THEMES[newId].colors;
      const root = document.documentElement;
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      document.body.style.backgroundColor = colors['--bg'];
      setThemeId(newId);
    };

    // If View Transitions API is not supported or no event (e.g., initial load setup)
    if (!document.startViewTransition || !e) {
      applyStyles();
      return;
    }

    // Calculate the ripple/droplet start point
    const x = e.clientX ?? window.innerWidth / 2;
    const y = e.clientY ?? window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Trigger the actual view transition
    const transition = document.startViewTransition(() => {
      applyStyles();
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 700,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <ThemeContext.Provider value={{ themeId, changeTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
