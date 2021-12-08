import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Account } from '../models/account';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  private readonly access_token_key = 'access_token';
  private readonly refresh_token_key = 'refresh_token';
  private readonly profile_key = 'profile';

  constructor(private http: HttpClient, private userService: UserService) {}

    login(email_:string, password_:string): Observable<any> {
      let data = {email:email_, password:password_};
      return this.http.post<{account: Account, accessToken: string, icon: string}>('http://51.124.249.185/api/auth/signin', data)
        .pipe(
          tap(
            (resp) => {
              console.log(resp);
              this.setAccessToken(resp.accessToken);
              this.userService.setProfile(resp.account);
              if (resp.icon)
                this.userService.setIcon(resp.icon);
            })
        )
    }

    register(email_:string, username_:string, password_:string): Observable<any> {
      let data ={username:username_, email:email_, password:password_};
      return this.http.post('http://51.124.249.185/api/auth/signup', data)
        .pipe(
          tap(
            (resp) =>
              console.log(resp)
          )
        )
    }

    getAccessToken(): string {
      return localStorage.getItem(this.access_token_key);
    }

    setAccessToken(token:string){
      localStorage.setItem(this.access_token_key, token);
    }
    
    getRefreshToken(): string {
      return localStorage.getItem(this.refresh_token_key);
    }

    setRefreshToken(token:string){
      localStorage.setItem(this.refresh_token_key, token);
    }
}
