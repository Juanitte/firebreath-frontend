import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Routes } from '../utilities/routes';
import { LoginService } from '../services/login/login.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService)
  const router = inject(Router);

  let response = true;

  if (!loginService.isLogged()) {
    response = false;
    router.navigate([Routes.login]);
  }
  return response;
};
