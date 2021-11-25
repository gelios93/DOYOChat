import { unsupported } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})


export class DrawComponent implements OnInit {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private paint: boolean;
  private base: HTMLElement;

  private clickX: number[] = [];
  private clickY: number[] = [];
  private clickDrag: boolean[] = [];

  private lineColor: string[] = [];
  private lineWidth: number[] = [];
  //private lineAlpha: number[] = [];

  time = '0:33';

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

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let base= document.getElementById('base');
    let context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = 'rgba(45,78,221, 1)';
    context.lineWidth = 4;
    //context.globalAlpha = 1;

    this.canvas = canvas;
    this.context = context;
    this.base = base;

    this.redraw();
    this.createUserEvents();
  }

  private createUserEvents() {
    let canvas = this.canvas;
    canvas.addEventListener("mousedown", this.pressEventHandler);
    canvas.addEventListener("mousemove", this.dragEventHandler);
    canvas.addEventListener("mouseup", this.releaseEventHandler);
    canvas.addEventListener("mouseout", this.cancelEventHandler);
  }

  private redraw() {
    let clickX = this.clickX;
    let clickY = this.clickY;
    let context = this.context;
    let clickDrag = this.clickDrag;
    let lineColor = this.lineColor;
    let lineWidth = this.lineWidth;
    //let lineAlpha = this.lineAlpha;
    
    for (let i = 0; i < clickX.length; ++i) {
        context.strokeStyle = lineColor[i];
        //context.globalAlpha = lineAlpha[i];
        context.lineWidth = lineWidth[i];
        context.beginPath();
        if (clickDrag[i] && i) {
            //context.globalAlpha = 0;
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
    this.clickX.push(x);
    this.clickY.push(y);
    this.clickDrag.push(dragging);
    this.lineWidth.push(this.context.lineWidth as number)
    //this.lineAlpha.push(this.context.globalAlpha as number)
    this.lineColor.push(this.context.strokeStyle as string);
  }

  private clearCanvas() {
    this.context.globalAlpha = 1;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.clickX = [];
    this.clickY = [];
    this.clickDrag = [];
    this.lineColor = [];
    this.lineWidth = [];
    //this.lineAlpha = [];
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
    let mouseX = e.pageX;
    let mouseY = e.pageY;
    mouseX -= this.base.offsetLeft + this.canvas.offsetLeft;
    mouseY -= this.base.offsetTop + this.canvas.offsetTop;
    this.paint = true;
    this.addClick(mouseX, mouseY, false);
    this.redraw();
  }

  private dragEventHandler = (e: MouseEvent) => {
    let mouseX = e.pageX;
    let mouseY = e.pageY;
    mouseX -= this.base.offsetLeft + this.canvas.offsetLeft;
    mouseY -= this.base.offsetTop + this.canvas.offsetTop;

    if (this.paint) {
      this.addClick(mouseX, mouseY, true);
      this.redraw();
    }
    e.preventDefault();
  }

  changeColor(arr: string [], index: number) {
    // this.context.strokeStyle = arr[index];
    this.context.strokeStyle = this.hexToRgb(arr[index]);
    //this.context.globalAlpha = 0.5;
  }

  changeLine(value: number) {
    this.context.lineWidth = value;
  }

  finish(){
    let img = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    console.log(img);
  }

  leave(){
    if(confirm("Вы точно хотите покинуть комнату?\nПосле выхода вы больше не сможете вернуться в игру.")) {
      this.router.navigate(['/home']);
    }
  }

  hexToRgb(hex:string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 'rgba(' 
    + parseInt(result[1], 16) + ','
    + parseInt(result[2], 16) + ','
    + parseInt(result[3], 16) + ','
    + '1' + ')'
    : null;
  }
  
}


