import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "./services/auth.service";

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.$token();

  if (token) {
    const reqWithToken = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(reqWithToken);
  }

  return next(req);
};
