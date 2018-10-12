import { AuthModel } from './auth.model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userId: string;
  private isAuthenticated = false;
  private token = '';
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  constructor(public http: HttpClient, public router: Router) {}


  getToken() {
    return this.token;
  }

  signUp(user: AuthModel) {
    this.http.post('http://localhost:3000/api/user/signup', user)
      .subscribe((res) => {
          console.log(res);
          this.router.navigate(['/']);
      });
  }

  login(user: AuthModel) {
     console.log(user);
    this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', user)
      .subscribe((res) => {
          this.token = res.token;
          console.log(this.token);
          if (this.token) {
            const expiresInDuration = res.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = res.userId;
            this.authStatusListener.next(true);

            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(this.token, expirationDate, this.userId);
            this.router.navigate(['/']);
          }
      });
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuhData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuhData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);

  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();

    if (!authInfo) {
      return;
    }

    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.userId = authInfo.userId;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  getUserId() {
    return this.userId;
  }
}
