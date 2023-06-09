import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Jwt } from '../models/Jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  $jwt: BehaviorSubject<Jwt | null> = new BehaviorSubject<Jwt | null>(null);

  constructor(private http: HttpClient) {
    this.readJwtLocalStorage();
  }

  login(user: { email: string; password: string }): Observable<boolean> {
    return new Observable<boolean>((resolve) => {
      this.http.post<any>('http://localhost:3000/users/login', user).subscribe({
        next: (response) => {
          const jwt: Jwt = response.body;
          localStorage.setItem('jwt', jwt.token);
          localStorage.setItem('isAdmin', String(jwt.isAdmin));
          localStorage.setItem('userId', jwt.userId);
          this.readJwtLocalStorage();
          resolve.next(true);
          resolve.complete();
        },
        error: () => {
          resolve.next(false);
          resolve.complete();
        },
      });
    });
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
    this.$jwt.next(null);
  }

  private readJwtLocalStorage() {
    const token = localStorage.getItem('jwt');
    const isAdmin = Boolean(localStorage.getItem('isAdmin'));
    const userId = localStorage.getItem('userId');

    if (token && isAdmin !== null && userId) {
      this.$jwt.next({ token, isAdmin, userId });
    } else {
      this.$jwt.next(null);
    }
  }
}
