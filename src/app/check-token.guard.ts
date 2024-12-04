import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./services/auth.service";

export const checkTokenGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.$token()) {
    return true;
  } else {
    router.navigate(['', 'signin']);
    return false;
  }
};
