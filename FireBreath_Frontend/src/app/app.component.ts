import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeUpdateService } from './services/common/theme-update.service';
import { Subscription } from 'rxjs';
import { LocalstorageService } from './services/common/localstorage.service';
import { LocalStorageKeys } from './utilities/literals';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'EasyWeb';
  translate: TranslateService = inject(TranslateService);
  themeClass: string = 'light';

  themeSubscription: Subscription = Subscription.EMPTY;

  constructor(private themeUpdateService: ThemeUpdateService, private localstorageService: LocalstorageService) {
    const navTheme = window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const theme = this.localstorageService.getItem(LocalStorageKeys.selectedTheme);
    theme ? this.themeClass = theme : this.themeClass = navTheme;
  }

  ngOnInit() {
    this.themeSubscription = this.themeUpdateService.themeUpdated$.subscribe((theme) => {
        this.themeClass = theme;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  translateText(lang: string) {
    this.translate.use(lang);
  }
}
