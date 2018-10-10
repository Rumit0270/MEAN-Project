import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.userService.getToken();
    const reqCopy = req.clone({
      // headers: req.headers.set('x-auth', token)
      setHeaders: {
        'x-auth': token
      }
    });

    return next.handle(reqCopy);
  }
}
