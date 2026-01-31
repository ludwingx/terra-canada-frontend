import { Component, OnInit, OnDestroy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';
import { I18nService, Language } from '../../../services/i18n.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  themeService = inject(ThemeService);
  i18n = inject(I18nService);

  // Computed properties from services
  language = this.i18n.language; // Signal
  isFullscreen = this.themeService.isFullscreen; // Signal
  
  showLanguageMenu: boolean = false;
  
  // Clean up if needed (though signals handle reactivity nicely)
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // No explicit subscription needed for basic signals usage in template
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleFullscreen(): void {
    this.themeService.toggleFullscreen();
  }

  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  selectLanguage(lang: Language): void {
    this.i18n.setLanguage(lang);
    this.showLanguageMenu = false;
  }

  getTranslation(key: string): string {
    return this.i18n.t(key);
  }

  closeMenus(): void {
    this.showLanguageMenu = false;
  }
}
