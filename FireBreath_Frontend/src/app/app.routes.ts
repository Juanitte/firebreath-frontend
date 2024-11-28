import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './components/shared/base-layout/base-layout.component';
import { SiteLayoutComponent } from './components/shared/site-layout/site-layout.component';
import { NotFoundPageComponent } from './pages/not-found/not-found-page/not-found-page.component';
import { LoginPageComponent } from './pages/login/login-page/login-page.component';
import { loginGuard } from './guards/login.guard';
import { RecoveryPageComponent } from './pages/login/recovery-page/recovery-page.component';
import { SignupPageComponent } from './pages/login/signup-page/signup-page.component';

export const routes: Routes = [
    {
        path: '', component: BaseLayoutComponent, children: [ //Rutas sin navbar
          { path: '', component: LoginPageComponent },
          { path: 'recover', component: RecoveryPageComponent },
          { path: 'register', component: SignupPageComponent }
        ]
      },
    
      {
        path: 'manager', component: SiteLayoutComponent, canActivateChild: [loginGuard], children: [ //Rutas con navbar  
          { path: 'asd', component: LoginPageComponent }
        ]
      },
      
      { path: 'recover/:hash/:username/:domain/:tld', component: LoginPageComponent },
    
      //Pagina de 404 / Not Found
      { path: '404', component: NotFoundPageComponent },
      { path: '**', redirectTo: '/404' },
];
