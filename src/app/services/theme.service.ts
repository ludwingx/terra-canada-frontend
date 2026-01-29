import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private currentTheme = signal<Theme>('light');
  
  theme = computed(() => this.currentTheme());
  isDark = computed(() => this.currentTheme() === 'dark');

  constructor() {
    this.loadTheme();
    
    // Aplicar tema al DOM cuando cambie
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  private loadTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('terra-theme') as Theme;
      if (saved && (saved === 'light' || saved === 'dark')) {
        this.currentTheme.set(saved);
      } else {
        // Detectar preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme.set(prefersDark ? 'dark' : 'light');
      }
      this.applyTheme(this.currentTheme());
    }
  }

  private applyTheme(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    }
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('terra-theme', theme);
    }
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

