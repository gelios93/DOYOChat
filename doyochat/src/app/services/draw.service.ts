import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawService {

  url = 'http://51.124.249.185/api/saveImage'
  private readonly game_mode_key = 'game_mode'
  constructor(private http: HttpClient) { }

  sendFrame(imageData: string){
    console.log(imageData.slice(0,31))
    let str = imageData.slice(31,-1)
    let data = {icon: str}
    this.http.post(this.url, data).subscribe(resp => {
      console.log(resp)
    })
  }
  setGameMode(gameMode: boolean) {
    localStorage.setItem(this.game_mode_key, JSON.stringify(gameMode));
  }

  getGameMode(): boolean {
    return JSON.parse(localStorage.getItem(this.game_mode_key));
  }

}
