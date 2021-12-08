import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IoService } from '../io.service';
import { DrawService } from '../services/draw.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})


export class DrawComponent implements OnInit {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private field: HTMLElement;
  private paint: boolean;
  private base: HTMLElement;

  private clickX: number[] = [];
  private clickY: number[] = [];
  private clickDrag: boolean[] = [];
  private clicks: number;
  private lineColor: string[] = [];
  private lineWidth: number[] = [];
  private pattern: CanvasPattern;
  
  isGameMode: boolean;
  time_left: number;


  colors = [
    ['#000000','#595959'],
    ['#038441','#6BE401'],
    ['#004DFD','#5FF5C7'],
    ['#5F01B1','#68D3FF'],
    ['#FF00FE','#FFCDF0'],
    ['#FE9900','#FFFF00'],
    ['#A30000','#FF0F11'],
    ['#96522B','#FFE3BC'],
    ['#D9D9D9','#FFFFFF']];

  sizes = [1, 4, 10, 16, 26, 38];
  img = "url(http://51.124.249.185/result.jpg)"

  constructor(private router: Router, private drawService: DrawService, private userService: UserService, public socketService: IoService) {
  }

  ngOnInit(): void { 
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.isGameMode = this.drawService.getGameMode();
    this.time_left = this.socketService.selected_time/1000;

    setTimeout(() => {
      if (!this.isGameMode){
        canvas = document.getElementById('canvas-else') as HTMLCanvasElement;
      }
      else{
        canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.field= document.getElementById('field');
      }
      let context = canvas.getContext("2d");
      if (!this.isGameMode){
        console.log('not game mode')
        if(!this.userService.getIcon()){  
          context.fillStyle = 'rgb(255, 255, 255)';
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        else {
          let background = new Image();
          background.src = 'data:image/png;charset=utf-8;base64,' + this.userService.getIcon();
          this.pattern = context.createPattern(background, 'repeat');
          context.fillStyle = this.pattern;
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      else {
          // this.time_left = this.socketService.selected_time/1000;
          // setInterval(() => {
          //   if(this.time_left > 0) {
          //      this.time_left--;
          //   } else {
          //     this.finish();
          //   }
          // }, 1000)

        if(this.socketService.background){
          this.field.style.backgroundImage = "url('"+ 'data:image/png;charset=utf-8;base64,' + this.socketService.background + "')";
        }
        else{
          console.log('first drawing')
          context.fillStyle = 'rgb(255, 255, 255)';
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      let base = document.getElementById('base');
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = 'rgba(0, 0, 0)';
      context.lineWidth = 4;
      context.globalAlpha = 1;

      this.canvas = canvas;
      this.context = context;
      this.base = base;

      this.redraw();
      this.createUserEvents(); 
    }, 1);
  }
  

  private createUserEvents() {
    let canvas = this.canvas;
    canvas.addEventListener("mousedown", this.pressEventHandler);
    canvas.addEventListener("mousemove", this.dragEventHandler);
    canvas.addEventListener("mouseup", this.releaseEventHandler);
    canvas.addEventListener("mouseout", this.cancelEventHandler);
    document.addEventListener("keydown", this.ctrlzReturn);
  }

  private redraw() {
    let clickX = this.clickX;
    let clickY = this.clickY;
    let context = this.context;
    let clickDrag = this.clickDrag;
    let lineColor = this.lineColor;
    let lineWidth = this.lineWidth;
    
    for (let i = 0; i < clickX.length; ++i) {
        context.strokeStyle = lineColor[i];
        context.lineWidth = lineWidth[i];
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.stroke();
    }
    context.closePath();
  }

  private addClick(x: number, y: number, dragging: boolean) {
    this.clicks++;
    this.clickX.push(x);
    this.clickY.push(y);
    this.clickDrag.push(dragging);
    this.lineWidth.push(this.context.lineWidth as number)
    this.lineColor.push(this.context.strokeStyle as string);
  }

  private clearCanvas() {
    if (this.isGameMode)
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    else {
      this.context.fillStyle = 'rgb(255, 255, 255)';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.clickX = [];
    this.clickY = [];
    this.clickDrag = [];
    this.lineColor = [];
    this.lineWidth = [];
  }

  clearEvent() {
    this.clearCanvas();
  }

  private releaseEventHandler = () => {
    this.paint = false;
    this.redraw();
  }

  private cancelEventHandler = () => {
    this.paint = false;
  }

  private pressEventHandler = (e: MouseEvent) => {
    this.clicks = 1;
    let mouseX = e.pageX;
    let mouseY = e.pageY;
    console.log('press', this.base.offsetLeft,  this.canvas.offsetLeft)

    mouseX -= (this.base.offsetLeft + this.canvas.offsetLeft);
    mouseY -= (this.base.offsetTop + this.canvas.offsetTop);

    this.paint = true; 
    this.addClick(mouseX, mouseY, false);
    this.redraw();
  }

  private dragEventHandler = (e: MouseEvent) => {
    let mouseX = e.pageX;
    let mouseY = e.pageY;
    console.log('drag', this.base.offsetLeft,  this.canvas.offsetLeft)

    mouseX -= (this.base.offsetLeft + this.canvas.offsetLeft);
    mouseY -= (this.base.offsetTop + this.canvas.offsetTop);

    if (this.paint) {
      this.addClick(mouseX, mouseY, true);
      this.redraw();
    }
    e.preventDefault();
  }

  private ctrlzReturn = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'z') {
      this.returnState();
    }
  }

  changeColor(arr: string [], index: number) {
    this.context.strokeStyle = this.hexToRgb(arr[index]);
  }

  changeLine(value: number) {
    this.context.lineWidth = value;
  }

  returnState(){
    for (let i = 0; i<this.clicks; i++){
      this.clickX.pop();
      this.clickY.pop();
      this.clickDrag.pop();
      this.lineColor.pop();
      this.lineWidth.pop();
    }
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.redraw();
  }

  finish(){
    // let img = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
    // let str = img.slice(31,-1);
    // console.log('finish');
    // this.socketService.finishDraw(str);

    let canvas2=document.createElement('canvas');
    let context2=canvas2.getContext('2d');
   
    canvas2.width=this.canvas.width;
    canvas2.height=this.canvas.height;
    
    //context2.drawImage(this.canvas,0,0);

    context2.fillStyle='white';
    context2.fillRect(0,0,this.canvas.width, this.canvas.height)

    // redraw the saved chart back to the main canvas
    context2.drawImage(this.canvas,0,0);

    // // fill the main canvas with a background
    // this.context.fillStyle='white';
    // this.context.fillRect(0,0,this.canvas.width, this.canvas.height)

    // // redraw the saved chart back to the main canvas
    // this.context.drawImage(canvas2,0,0);

    let img = canvas2.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
    let str = img.slice(31,-1);
    console.log('finish frame');
    console.log(str);
    this.socketService.finishDraw(str);
    

  }

  leave(){
    if(confirm("Вы точно хотите покинуть комнату?\nПосле выхода вы больше не сможете вернуться в игру.")) {
      this.router.navigate(['/home']);
    }
  }

  saveIcon(){
    let img = this.canvas.toDataURL("image/png");
    this.userService.saveUserImage(img).subscribe((resp)=>
      this.router.navigate(['/home'])
    );
  }

  toHome(){
    this.router.navigate(['/home']);
  }

  hexToRgb(hex:string) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 'rgba(' 
    + parseInt(result[1], 16) + ','
    + parseInt(result[2], 16) + ','
    + parseInt(result[3], 16) + ','
    + '1' + ')'
    : null;
  }
}


