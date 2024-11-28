import { Component } from '@angular/core';
import { LoginComponent } from '../../../components/login/login/login.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-page',
  imports: [LoginComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  constructor(private translate: TranslateService) { }

  translateText(lang: string) {
    this.translate.use(lang);
  }
}
