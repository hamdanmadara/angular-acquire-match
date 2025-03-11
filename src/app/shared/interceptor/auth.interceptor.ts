import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/Auth/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    // Use inject() to get the AuthService
    const authService = inject(AuthService);

    const token = authService.getToken();
    console.log("Interceptor Token:", token);

    if (token) {
        const cloned = req.clone({
            setHeaders: {
                // Use 'Authorization' with 'Bearer ' prefix
                Authorization: `${token}`,
            },
        });
        return next(cloned);
    } else {
        return next(req);
    }
};