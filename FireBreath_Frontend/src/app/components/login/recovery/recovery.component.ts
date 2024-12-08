import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { LoginService } from '../../../services/login/login.service';
import { LoadingService } from '../../../services/common/loading.service';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users/users.service';
import { ThemeUpdateService } from '../../../services/common/theme-update.service';
import { LocalstorageService } from '../../../services/common/localstorage.service';
import { LocalStorageKeys, Roles } from '../../../utilities/literals';
import { Routes } from '../../../utilities/routes';
import { iUser } from '../../../models/iUser';

@Component({
  selector: 'app-recovery',
  imports: [LoadingComponent, CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './recovery.component.html',
  styleUrl: './recovery.component.scss'
})
export class RecoveryComponent implements OnInit, OnDestroy {

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
      email: new FormControl('', [Validators.required, Validators.email])
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

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
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
          if (this.usersService.currentUser?.role === Roles.adminRole) {
            this.router.navigate([Routes.home]);
          } else if (this.usersService.currentUser?.role === Roles.userRole) {
            this.router.navigate([Routes.home]);
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
    if (user?.role === Roles.adminRole) {
      this.router.navigate([Routes.home]);
    } else if (user?.role === Roles.userRole) {
      this.router.navigate([Routes.home]);
    } else {
      this.router.navigate([Routes.login]);
    }
  }
}
