import { useState, useEffect } from 'react';
import LonelyLess from './LonelyLess';
import LonelyLessLanding from './LonelyLessLanding';
import { ThemeProvider } from './ThemeProvider';

function AppRouter() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (path === '/app') {
    return <LonelyLess />;
  }
  
  return <LonelyLessLanding />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}
