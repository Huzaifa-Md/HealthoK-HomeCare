'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'theme-light' | 'theme-dark';

export default function SettingsTab() {
  const [theme, setTheme] = useState<Theme>('theme-light');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme') as Theme;
    if (savedTheme === 'theme-dark' || savedTheme === 'theme-light') {
      setTheme(savedTheme);
    }
  }, []);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('admin-theme', newTheme);
    // Force re-render of the parent by dispatching an event, or parent can listen to localStorage changes.
    // However, since state is lifted up in page.tsx typically, let's just dispatch a custom event.
    window.dispatchEvent(new Event('themeChanged'));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-admin-text mb-1">Dashboard Settings</h2>
        <p className="text-admin-text-muted text-sm">Manage your preferences for the admin interface.</p>
      </div>

      <div className="bg-admin-card rounded-2xl border border-admin-border p-6 shadow-sm">
        <h3 className="font-bold text-admin-text mb-4 text-lg border-b border-admin-border pb-3">Appearance</h3>
        
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="font-semibold text-admin-text">Theme Preference</p>
            <p className="text-admin-text-muted text-sm mt-1">Choose between Light and Dark mode for the dashboard.</p>
          </div>
          
          <div className="flex bg-admin-bg p-1.5 rounded-xl border border-admin-border">
            <button 
              onClick={() => changeTheme('theme-light')} 
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${theme === 'theme-light' ? 'bg-admin-card shadow-sm text-admin-text border border-admin-border' : 'text-admin-text-muted hover:text-admin-text border border-transparent'}`}
            >
              <Sun className="w-4 h-4" /> Light
            </button>
            <button 
              onClick={() => changeTheme('theme-dark')} 
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${theme === 'theme-dark' ? 'bg-admin-card shadow-sm text-admin-text border border-admin-border' : 'text-admin-text-muted hover:text-admin-text border border-transparent'}`}
            >
              <Moon className="w-4 h-4" /> Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
