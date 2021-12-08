import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IoService } from '../io.service';
import { ModalComponent } from '../modal/modal.component';
import { Account } from '../models/account';
import { User } from '../models/user';
import { DrawService } from '../services/draw.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private account: Account;
  private default = './assets/images/empty_profile_.png'
  info = 1;
  value: string;
  username: string;
  friends: User[];
  requests: User[];
  animations: string[];
  resultSearch = false;
  isChange = false;
  isSubmitted = false;
  resultRequest = false;
  resultFriends = true;
  search: User[];
  form: FormGroup;
  config: MatSnackBarConfig;
  searchMode: boolean;
  searchText = 'ПОИСК КОМНАТЫ';
  
  constructor(private router: Router, private userService: UserService, private drawService: DrawService,
    private dialog: MatDialog, private snackBar: MatSnackBar, private socketService: IoService) { }

  ngOnInit(): void {
    let image = document.getElementById("profile") as HTMLImageElement;
    this.account = this.userService.getProfile();
    this.username = this.account.username;
    this.searchMode = false;

    this.friends = this.account.friends;
    this.requests = this.account.requests;
    this.animations = this.account.animations;

    this.config = new MatSnackBarConfig();
    this.config.duration = 10000;

    if (this.userService.getIcon())
      image.setAttribute("src", 'data:image/png;charset=utf-8;base64,' + this.userService.getIcon());
    else
      image.setAttribute("src", this.default);

    this.form = new FormGroup({
      username: new FormControl((this.username), [Validators.required, Validators.minLength(4), Validators.maxLength(35), Validators.pattern('^[A-Za-z0-9]+$')])
    });

  }

  redirectToRoom(): void {
    this.socketService.host = true;
    this.socketService.setRole(true);
    this.router.navigate(['/room']);
  }

  searchRoom(): void {
    console.log('home');
    this.searchMode = !this.searchMode;
    let but = document.getElementById("search");
    let text = document.getElementById("sr");
    if (this.searchMode) {
      but.style.backgroundColor = "rgb(135, 69, 26)";
      text.setAttribute('class', 'glow');
      this.searchText = 'ПОИСК...'
    }
    else {
      but.style.backgroundColor="rgb(255, 119, 28)";
      text.setAttribute('class', 'none');
      this.searchText = 'ПОИСК КОМНАТЫ'
    }
    this.socketService.initSocket();
  }

  changeName() {
    this.isChange = true;
  }

  saveName() {
    this.isSubmitted = true;
    if(this.form.valid)
      this.isChange = false;
      if(this.form.controls.username.value !== this.account.username){
        this.username = this.form.controls.username.value;
        this.account.username = this.username;
        this.userService.setProfile(this.account);
        this.userService.saveUserName(this.username);
      }
  }

  changeIcon() {
    this.drawService.setGameMode(false);
    this.router.navigate(['/draw'])
  }

  showFriendsPanel(){
    this.info = 1;
    if (this.friends.length)
      this.resultFriends = true;
    else
      this.resultFriends = false;
  }
  showRequestsPanel(){
    this.info = 2;
    if (this.friends.length)
      this.resultRequest = true;
    else
      this.resultRequest= false;
  }
  searchUserPanel(){
    this.info = 3;
    this.search = [];
  }

  cancel(user: User){
    if(confirm('Вы точно хотите отклонить приглашение в друзья от' + user.username + '?'))
      this.userService.cancelRequest(user.username).subscribe((resp) => {
        this.requests = resp.requests;
        this.account.requests = this.requests;
        this.userService.setProfile(this.account);
        this.snackBar.openFromComponent(PizzaPartyComponent, {
          announcementMessage: 'Запрос от' + user.username + 'отклонен ):',
          duration: 5000
        })

      });
  }

  accept(user: User){
    this.userService.acceptRequest(user.username).subscribe((resp) => {
      this.requests = resp.requests;
      this.friends = resp.friends;
      this.account.requests = this.requests;
      this.account.friends = this.friends;
      this.userService.setProfile(this.account);
      this.snackBar.openFromComponent(PizzaPartyComponent, {
        announcementMessage: 'Запрос от' + user.username + 'принят',
        duration: 5000
      })

    });
  }

  deleteFriend(user: User){
    if(confirm('Вы точно хотите удалить ' + user.username + 'из друзей?'))
      this.userService.deleteFriend(user.username).subscribe((resp) => {
        this.friends = resp.friends;
        this.account.friends = this.friends;
        this.userService.setProfile(this.account);
        this.snackBar.openFromComponent(PizzaPartyComponent, {
          announcementMessage:user.username+' удален из друзей',
          duration:5000
        })
      })
  }

  addFriend(user: User) {
    this.userService.addFriend(user.username).subscribe((resp) => {
      if(resp.status==200){
        this.friends = resp.friends;
        this.account.friends = this.friends;
        this.userService.setProfile(this.account);
        this.snackBar.open('hi', )
        // this.snackBar.openFromComponent(PizzaPartyComponent, {
        //   announcementMessage: 'Заявка отправлена!',
        //   duration:5000
        // })
      }
      if(resp.status==400){}
        // // this.snackBar.openFromComponent(PizzaPartyComponent, {
        // //   announcementMessage:'Заявка уже отправлена!',
        // //   duration:5000
        // // })
        // this.snackBar.open('gfgfhgfhgf','', {
        //   announcementMessage:'Заявка уже отправлена!',
        //   duration:5000
        // })
      else
      this.snackBar.openFromComponent(PizzaPartyComponent, {
        announcementMessage:'Ошибка :(',
        duration:5000
      })
    })
  }

  searchUser(){
    if(this.value)
      this.userService.searchUser(this.value).subscribe((resp)=>{
        if(resp.length > 0){
          this.resultSearch = true;
          this.search = resp;
        }
        else
          this.resultSearch = false;
      })
  }

  openGif(animation: string) {
    let dialog = this.dialog.open(ModalComponent, {backdropClass:'dialog-theme', data: {gif: "http://51.124.249.185/images/animations/"+animation }});
    
  
    dialog.afterClosed().subscribe((result) => {
      if (result)
        console.log('delete this animation ', result);
      else 
        console.log('just close');
    });
  }

  

}

@Component({
  selector: 'snack-bar',
  templateUrl: 'snack-bar-component.html',
  styles: [
    `
    .example-pizza-party {
      color: hotpink;
    }
  `,
  ],
})
export class PizzaPartyComponent {}

