import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../../../services/src/jwt/jwt.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);

  const config = jwtService.getConfig();
  const token = jwtService.getToken();
  const authScheme = config?.authScheme || 'Bearer ';
  const headerName = config?.headerName || 'Authorization';
  const errorOnNoToken = config?.errorOnNoToken;
  const skipAddingIfExpired = config?.skipAddingIfExpired;

  if (!token && errorOnNoToken) {
    throw new Error(
      '[NgxOneforall - JWT Interceptor]: Not able to get JWT token from token getter function'
    );
  }

  const isExpired = jwtService.isExpired(token);

  if (isExpired && skipAddingIfExpired) {
    return next(req);
  }

  const clonedReq = req.clone({
    setHeaders: {
      [headerName]: `${authScheme}${token}`,
    },
  });

  return next(clonedReq);
};
