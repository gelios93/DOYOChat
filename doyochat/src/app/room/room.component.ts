import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { IoService } from '../io.service';
import { Account } from '../models/account';
import { User } from '../models/user';
import { DrawService } from '../services/draw.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  game_time = [{value: 20000, view: '20 сек'},
               {value: 30000, view: '30 сек'},//30000
               {value: 60000, view: '60 сек'},
               {value: 90000, view: '90 сек'}]
  players_num = [{value: 2 , view: '2'},
                 {value: 3 , view: '3'},//3
                 {value: 4 , view: '4'},
                 {value: 5 , view: '5'},]
  frames_num = [{value: 3, view: '3'},//3
                {value: 4, view: '4'},
                {value: 5, view: '5'},
                {value: 6, view: '6'},
                {value: 1 , view: '1'}]

  fillMode = false;
  fillText = "ПОДБОР ИГРОКОВ"
  text: string;

  players: User[] = [];

  account: Account;

  constructor(private router: Router, private drawService: DrawService, public socketService: IoService, private userService: UserService) { }

  ngOnInit(): void {

    // var objDiv = document.getElementById("divExample");
    // objDiv.scrollTop = objDiv.scrollHeight;

    console.log('role', this.socketService.host)
    this.account = this.userService.getProfile();
    
    if(this.socketService.host && this.socketService.players.length===0){
      let icon  = this.userService.getIcon();
      let admin = new User(this.account.username, icon, this.account.experience)
      this.socketService.players.push(admin);
    }
  }

  startGame(): void {
    this.drawService.setGameMode(true);
    this.socketService.startGame();
    // this.router.navigate(['/draw']);
  }

  initSocket(){

    console.log('init')
    this.socketService.initSocket({players_num: this.socketService.selected_players, frames_num: this.socketService.selected_frames, game_time: this.socketService.selected_time});
  }

  leave(){ 
    if(confirm('Вы точно хотите покинуть комнату?')){
      if(!this.socketService.host)
        this.socketService.leave(this.account.username);
      else
        this.socketService.deleteRoom();
    }
  }

  disconnect(){
    console.log('connect room')
    this.socketService.connectSocket();
    //console.log('Вызов из компонента', this.socketService.usetjson);
  }

  deletePlayer(user: User){
    if(confirm('Вы толчно хотите удалить ' + user.username + ' из комнаты?'))
      this.socketService.deleteUser(user.username)
    }

  fillRoom(){
    this.fillMode = !this.fillMode;
    let but = document.getElementById("fill");
    let text = document.getElementById("gl");
    if (this.fillMode) {
      but.style.backgroundColor = "rgb(135, 69, 26)";
      text.setAttribute('class', 'glow');
      this.fillText = 'ПОИСК...'
    }
    else {
      but.style.backgroundColor="rgb(255, 119, 28)";
      text.setAttribute('class', 'none');
      this.fillText = 'ПОДБОР ИГРОКОВ'
    }
  }

  sendMessage(){
    this.socketService.sendMessage(this.account.username, this.text);
    this.text="";
  }

  setPlayers(val: number){
    this.socketService.selected_players = val;
    console.log(val);
    this.socketService.setSettings('players_num', val);
    console.log(this.socketService.selected_players);
  }
  setFrames(val: number){
    this.socketService.selected_frames = val;
    console.log(val);
    this.socketService.setSettings('frames_num', val);
    console.log(this.socketService.selected_frames);
  }
  setTime(val: number){
    this.socketService.selected_time = val;
    console.log(val);
    this.socketService.setSettings('game_time', val);
    console.log(this.socketService.selected_time);
  }

}
