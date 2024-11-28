import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageComponent } from '../language/language.component';
import { ThemeComponent } from '../theme/theme.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeUpdateService } from '../../../services/common/theme-update.service';
import { Subscription } from 'rxjs';
import { LocalstorageService } from '../../../services/common/localstorage.service';
import { LocalStorageKeys } from '../../../utilities/literals';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-layout',
  imports: [RouterModule, LanguageComponent, ThemeComponent, TranslateModule, CommonModule],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss'
})
export class BaseLayoutComponent implements OnInit, OnDestroy {

  isDarkTheme: boolean = false;

  themeSubscription: Subscription = Subscription.EMPTY;

  constructor(private themeUpdateService: ThemeUpdateService, private localstorageService: LocalstorageService) {
    const navTheme = window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const theme = this.localstorageService.getItem(LocalStorageKeys.selectedTheme);
    if(theme) {
      this.isDarkTheme = theme === 'dark';
    }else{
      this.isDarkTheme = navTheme === 'dark';
    }
  }

  ngOnInit(): void {
    this.themeSubscription = this.themeUpdateService.themeUpdated$.subscribe((theme) => {
      this.isDarkTheme = theme === 'dark';
  });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

}
