import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { LoginService } from '../../../services/login/login.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../../services/common/loading.service';
import { UsersService } from '../../../services/users/users.service';
import * as CryptoJS from 'crypto-js';
import { LocalStorageKeys, Roles } from '../../../utilities/literals';
import { Routes } from '../../../utilities/routes';
import { iUser } from '../../../models/iUser';
import { ThemeUpdateService } from '../../../services/common/theme-update.service';
import { LocalstorageService } from '../../../services/common/localstorage.service';

function passwordValidator(control: FormControl): { [key: string]: any } | null {
  const hasUppercase = /[A-Z]/.test(control.value); // Verifica si hay al menos una letra mayúscula
  const hasNumber = /\d/.test(control.value); // Verifica si hay al menos un dígito numérico
  const hasNonAlphanumeric = /\W/.test(control.value); // Verifica si hay al menos un carácter no alfanumérico

  if (control.value && control.value.length >= 6 && hasUppercase && hasNumber && hasNonAlphanumeric) {
    return null; // La contraseña cumple con todos los requisitos
  } else {
    return { 'passwordRequirements': true }; // La contraseña no cumple con los requisitos
  }
}

@Component({
  selector: 'app-login',
  imports: [LoadingComponent, CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public loginForm!: FormGroup; // Define loginForm como un FormGroup
  public errorMsg: string = "";
  loading$: Observable<boolean>;
  passwordVisible = false;
  themeClass: string = '';

  themeSubscription: Subscription = Subscription.EMPTY;

  constructor(private loginService: LoginService, private loadingService: LoadingService,
    private router: Router, private translate: TranslateService, private usersService: UsersService,
    private themeUpdateService: ThemeUpdateService, private localstorageService: LocalstorageService) {

    this.loading$ = this.loadingService.loading$;
    this.loadingService.showLoading();
  }

  ngOnInit() {
    const navTheme = window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const theme = this.localstorageService.getItem(LocalStorageKeys.selectedTheme);
    theme ? this.themeClass = theme : this.themeClass = navTheme;
    
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, passwordValidator])
    });
    if (this.loginService.isLogged()) {
      this.checkNavigateUser(this.usersService.currentUser);
    }

    this.themeSubscription = this.themeUpdateService.themeUpdated$.subscribe((theme) => {
      this.localstorageService.setItem(LocalStorageKeys.selectedTheme, theme);
      this.themeClass = theme;
    });

    setTimeout(() => {
      this.loadingService.hideLoading();
    },200);
  }


  /**
   * Envia la solicitud de inicio de sesión al backend.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      const hashedPassword = CryptoJS.SHA256(password).toString().concat('@', 'A', 'a');

      // Muestra el indicador de carga antes de iniciar la carga de datos
      this.loadingService.showLoading();

      // Enviar solicitud de inicio de sesión
      this.loginService.login(email, hashedPassword).subscribe({
        next: (response) => {
          // Oculta el indicador de carga una vez que los datos se han cargado
          this.loadingService.hideLoading();

          this.errorMsg = "";
          if (this.usersService.currentUser?.role === Roles.superAdminRole) {
            this.router.navigate([Routes.supportManager]);
          } else if (this.usersService.currentUser?.role === Roles.adminRole) {
            this.router.navigate([Routes.supportTechnician]);
          }
        },
        error: (error) => {
          console.error('Error en la solicitud:', error);
          this.errorMsg = "Email o contraseña no válidos.";

          // En caso de error, también oculta el indicador de carga
          this.loadingService.hideLoading();
        }
      });
    }
  }

  /**
   * Redirige a la vista de registro.
   */
  goToSignup() {
    this.router.navigate([Routes.register]);
  }

  /**
   * Redirige a la vista de recuperación de contraseña.
   */
  goToRecover() {
    this.router.navigate([Routes.recover]);
  }

  /**
   * Cambia la visibilidad de la contraseña.
   */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }


  /**
   * Comprueba si el usuario es un administrador, tecnico o usuario normal y redirige a la vista correspondiente.
   */

  checkNavigateUser(user: iUser | null) {
    if (user?.role === Roles.superAdminRole) {
      this.router.navigate([Routes.supportManager]);
    } else if (user?.role === Roles.adminRole) {
      this.router.navigate([Routes.supportTechnician]);
    } else {
      this.router.navigate([Routes.login]);
    }
  }

}
