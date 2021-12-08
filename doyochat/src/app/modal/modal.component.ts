import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalComponent>,  @Inject(MAT_DIALOG_DATA) public data: {gif:string}, userService: UserService) {
  }

  close(){
    this.dialogRef.close();
  }

  delete(){
    this.dialogRef.close('del');
    if(confirm('Анимация будет навсегда уделаена из вашего профиля. Продолжить?')){
      console.log('delete animation');
      this.close();
      // this.userService(this.gif).subscribe(()=>{
      //   this.close();
      //})
    }
  }

  ngOnInit(): void {
    let img = document.getElementById("gif");
    img.setAttribute('src', this.data.gif);
  }

}
function MD_DIALOG_DATA(MD_DIALOG_DATA: any) {
  throw new Error('Function not implemented.');
}

