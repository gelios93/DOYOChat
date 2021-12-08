import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isSubmitted: boolean
  isDublicate: boolean
  form: FormGroup
  
  constructor(private router: Router, private service: AuthService) { }

  ngOnInit(): void {
    this.initForm()
  }
  
  initForm(): void {
    this.isSubmitted = false;
    this.isDublicate = true;
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(35), Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(35), Validators.pattern('^[A-Za-z0-9]+$')]),
      username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(35), Validators.pattern('^[A-Za-z0-9]+$')]),
      dublicate: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  register(): void {
    this.isSubmitted = true;
    if(this.form.valid)
      if(this.form.controls.dublicate.value == this.form.controls.password.value)
        this.service.register(this.form.controls.email.value, this.form.controls.username.value, this.form.controls.password.value).subscribe((resp) => {
          this.router.navigate(['/login'])
        })
      else{
        this.isDublicate = false
      }

  }

  discordRegister(): void {
    alert('discordRegister');
    this.router.navigate(['/login']);
  }
  
  removeErrors():void{
    this.isSubmitted = false;
    this.isDublicate = true;
  }

}
