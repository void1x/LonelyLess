import { useState } from 'react';
import { useTheme, THEME_KEYS } from './ThemeProvider';

export default function ThemeSlider() {
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
