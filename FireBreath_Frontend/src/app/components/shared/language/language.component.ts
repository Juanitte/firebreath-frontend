import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LocalStorageKeys } from '../../../utilities/literals';
import { LocalstorageService } from '../../../services/common/localstorage.service';
import { LanguageUpdateService } from '../../../services/common/language-update.service';
import { ThemeUpdateService } from '../../../services/common/theme-update.service';

@Component({
  selector: 'app-language',
  imports: [CommonModule],
  templateUrl: './language.component.html',
  styleUrl: './language.component.scss'
})
export class LanguageComponent implements OnInit, OnDestroy {

  esButtonPressed: boolean = true;
  enButtonPressed: boolean = false;
  themeClass: string = '';

  translateSubscription: Subscription = Subscription.EMPTY;
  themeSubscription: Subscription = Subscription.EMPTY;

  constructor(private translate: TranslateService, private languageUpdateService: LanguageUpdateService,
              private localstorageService: LocalstorageService, private themeUpdateService: ThemeUpdateService) {
    const lang = this.localstorageService.getItem(LocalStorageKeys.selectedLanguage) || this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.use('en');
    } else {
      this.translate.use(lang);
      this.updateButtonState(lang);
    }
    const navTheme = window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const theme = this.localstorageService.getItem(LocalStorageKeys.selectedTheme);
    theme ? this.themeClass = theme : this.themeClass = navTheme;
  }

  ngOnInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe((event) => {
      this.updateButtonState(event.lang);
      this.localstorageService.setItem(LocalStorageKeys.selectedLanguage, event.lang);
    });
    this.themeSubscription = this.themeUpdateService.themeUpdated$.subscribe((theme) => {
      this.localstorageService.setItem(LocalStorageKeys.selectedTheme, theme);
      this.themeClass = theme;
    });
  }

  ngOnDestroy() {
    this.translateSubscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }

  /**
   * Cambia el idioma según marque el botón.
   * @param language el nuevo idioma.
   */
  toggleButtons(language: string) {
    if (language === 'es') {
      this.translate.use('es');
    } else if (language === 'en') {
      this.translate.use('en');
    }
  }

  /**
   * Cambia de idioma.
   * @param language el nuevo idioma.
   */
  switchLanguage(language: string) {
    this.translate.use(language);
    setTimeout(() => {
      this.languageUpdateService.triggerLangUpdate();
    }, 100)
  }

  /**
   * Actualiza el botón seleccionado.
   * @param lang el idioma del botón seleccionado.
   */
  private updateButtonState(lang: string) {
    this.esButtonPressed = lang === 'es';
    this.enButtonPressed = lang === 'en';
  }
}
