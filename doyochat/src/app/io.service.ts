import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { io, Socket } from "socket.io-client";
import { User } from './models/user';
import { AuthService } from './services/auth.service';

@Injectable({ providedIn: 'root'})


export class IoService {

  socket: Socket
  players: User[] = [];
  messages: {username: string, value: string}[];
  selected_frames = 3;
  selected_players= 3;
  selected_time = 30000;
  host = true;
  background: string;
  stage = 0;

  constructor(private authService: AuthService, private router: Router) {
    this.messages = [];
  }

  leave(username: string){
    this.socket.emit('leave',username);
  }

  deleteUser(username: string){
    this.socket.emit('deleteUser', username);
  }

  deleteRoom(){
    this.socket.emit('deleteRoom');
  }

  connectSocket(){
    this.socket.emit("hello", 'lover of Snezhnaya');
  }

  setSettings(type: string, value: number){
    console.log("setSettings = ", type, value)
    this.socket.emit("setting", {type: type, value: value});
  }

  startGame(){
    this.socket.emit('start');
    console.log('startGame is called');
  }

  finishDraw(image: string){
    console.log('next emit');
    console.log(image)
    this.socket.emit('next', {stage: this.stage, image: image})
  }

  sendMessage(username: string, value: string){
    this.socket.emit('message', {username: username, value: value} );
    this.messages.push({username: username, value: value})
    console.log('message emit has been called')
  }

  initSocket(settings?: {players_num: number, frames_num: number, game_time: number}){
    let token = this.authService.getAccessToken();
    this.socket = io("http://51.124.249.185", {path: '/socket/socket.io', query:{token}});
    this.socket.on("connect", () => {
      console.log('socketInit');
      console.log(this.socket.id);
      
      this.socket.on("add", (resp)=> {
        console.log('addddddddddddddddddddddddddd')
        let user = new User(resp.username, resp.icon, resp.experience)
        this.players.push(user)
        //console.log(this.players)
     })

      this.socket.on("setting", (resp) =>{
        if (resp.type == 'players_num')
          this.selected_players = resp.value
        if (resp.type == 'frames_num')
          this.selected_frames = resp.value
        if (resp.type == 'game_time')
          this.selected_time = resp.value
        console.log(resp)
      })

      this.socket.on("init", (resp) => {
        console.log(resp);
        this.players = resp.players;
        this.selected_players = resp.settings.players_num;
        this.selected_frames = resp.settings.frames_num;
        this.selected_time = resp.settings.game_time;
        this.setRole(false);
        this.host = false;
        this.router.navigate(['room']);
      })

      this.socket.on('leave', (username) => {
        console.log('username',username)
        if(username)
          this.players = this.players.filter((player) => {
            return player.username !== username;
          })
        else{
          this.router.navigate(['home']);
          this.players = [];
        } 
      })

      this.socket.on('deleteUser', ()=>{
        alert('Хост удалил вас из комнаты')
        this.router.navigate(['home']);
        this.players = [];
      })

      this.socket.on('deleteRoom', ()=>{
        if(!this.host)
          alert('Хост удалил комнату')
        this.router.navigate(['home']);
        this.players = [];
      })

      this.socket.on('deleteRoom', ()=>{
        if(!this.host)
          alert('Хост удалил комнату')
        this.router.navigate(['home']);
        this.players = [];
      })

      this.socket.on('message', (message) => {
        console.log(message.username);
        console.log(message.value);
        this.messages.push({username: message.username, value: message.value});
      })

      this.socket.on('next', (resp) => {
        this.background = resp;
        this.stage++;
        console.log(this.background);
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
      })

      this.socket.on('start', () => {
        this.background = '';
        this.router.navigate(['draw']);
      })

      this.socket.on('finish', () => {
        this.router.navigate(['room']);
      })
    });
  
    this.socket.emit("init", settings);
  }
 

  setRole(host: boolean){
    localStorage.setItem('host', JSON.stringify(host));
  }
  getRole():boolean{
    return JSON.parse(localStorage.getItem('host'));
  }

}
