import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Account } from '../models/account';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://51.124.249.185/api/'

  private readonly profile_key = 'profile';
  constructor(private http: HttpClient) { }

  saveUserImage(dataImage: string): Observable<any>{
    let str = dataImage.slice(22,-1);
    let data = {icon: str}
    return this.http.post<{icon: string}>(this.url + 'editData', data)
      .pipe(
        tap(
          (resp) =>{
            console.log("editData", resp);
            this.setIcon(resp.icon);
          }
        )
      )
  }

  saveUserName(username_: string){
    let data = {username: username_}
    this.http.post(this.url + 'editData', data).subscribe(resp => {
      console.log(resp)
    })
  }

  searchUser(value: string): Observable<User[]> {
    console.log(value);
    let data = {username: value};
    return this.http.post<User[]>(this.url + 'friend/searchUsers', data)
    .pipe(
      tap(
        (resp) => {
          console.log(resp);
        }
      )
    )
  }

  cancelRequest(username_: string):Observable<any> {
    let data = {username: username_}
    return this.http.post<{message: string, friends: User[], requests: User[]}>(this.url + 'friend/cancelRequest', data)
      .pipe(
        tap(
          (resp) => {
            console.log(resp);
          }
        )
      )
  }

  acceptRequest(username_: string): Observable<any>{
    let data = {username: username_}
    return this.http.post<{message: string, friends: User[], requests: User[]}>(this.url + 'friend/acceptRequest', data)
    .pipe(
      tap(
        (resp) => {
          console.log(resp);
        }
      )
    )
  }

  deleteFriend(username_: string): Observable<any> {
    let data = {username: username_};
    return this.http.post<{message: string, friends: User[], requests: User[]}>(this.url + 'friend/deleteFriend', data)
      .pipe(
        tap(
          (resp) => {
            console.log(resp);
          }
        )
      )
  }

  addFriend(username_: string): Observable<any> {
    let data = {username: username_};
    return this.http.post<{status: number, friends: User[], requests: User[]}>(this.url + 'friend/sendRequest', data)
      .pipe(
        tap(
          (resp) => {
            console.log(resp);
          }

        )
      )
  }

  setProfile(account: Account){
    localStorage.setItem(this.profile_key, JSON.stringify(account));
  }

  getProfile(): Account{
    return JSON.parse(localStorage.getItem(this.profile_key));
  }

  setIcon(icon: string){
    localStorage.removeItem('icon');
    localStorage.setItem('icon', icon);
  }

  getIcon(): string {
    return localStorage.getItem('icon');
  }

  

}
