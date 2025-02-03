import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const credentials = btoa(`${environment.username}:${environment.password}`);
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Basic ${credentials}`)
  });

  return next(authReq);
};
