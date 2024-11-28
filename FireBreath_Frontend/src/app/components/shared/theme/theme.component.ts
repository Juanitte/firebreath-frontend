import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalstorageService } from '../../../services/common/localstorage.service';
import { ThemeUpdateService } from '../../../services/common/theme-update.service';
import { LocalStorageKeys } from '../../../utilities/literals';

@Component({
  selector: 'app-theme',
  imports: [CommonModule],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss'
})
export class ThemeComponent implements OnInit, OnDestroy {

  lightButtonPressed: boolean = true;
  darkButtonPressed: boolean = false;
  themeClass: string = 'light';

  themeSubscription: Subscription = Subscription.EMPTY;

  constructor(private themeUpdateService: ThemeUpdateService,
              private localstorageService: LocalstorageService) {
    const navTheme = window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const theme = this.localstorageService.getItem(LocalStorageKeys.selectedTheme);
    theme ? this.themeClass = theme : this.themeClass = navTheme;
    this.updateButtonState(this.themeClass);
  }

  ngOnInit() {
    this.themeSubscription = this.themeUpdateService.themeUpdated$.subscribe((theme) => {
      this.localstorageService.setItem(LocalStorageKeys.selectedTheme, theme);
      this.updateButtonState(theme);
      this.themeClass = theme;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  /**
   * Cambia de tema.
   * @param theme el nuevo tema.
   */
  switchTheme(theme: string) {
    this.themeUpdateService.triggerThemeUpdate(theme);
  }

  /**
   * Actualiza el botón seleccionado.
   * @param theme el tema del botón seleccionado.
   */
  private updateButtonState(theme: string) {
    this.lightButtonPressed = theme === 'light';
    this.darkButtonPressed = theme === 'dark';
  }

}
