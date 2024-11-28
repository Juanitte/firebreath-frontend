import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeUpdateService {

  constructor() { }

  private themeUpdatedSource = new Subject<string>();

  themeUpdated$ = this.themeUpdatedSource.asObservable();

  /**
   * Trigger the graph update.
   */
  triggerThemeUpdate(theme: string) {
    this.themeUpdatedSource.next(theme);
  }
}
