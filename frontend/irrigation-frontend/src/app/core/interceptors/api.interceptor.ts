import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Ajouter des headers si nécessaire
  const clonedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
    }
  });
  
  return next(clonedReq);
};
