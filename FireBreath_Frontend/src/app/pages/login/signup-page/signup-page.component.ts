import { Component } from '@angular/core';
import { SignupComponent } from "../../../components/login/signup/signup.component";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup-page',
  imports: [SignupComponent],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss'
})
export class SignupPageComponent {

  constructor(private translate: TranslateService) { }

  translateText(lang: string) {
    this.translate.use(lang);
  }
}
