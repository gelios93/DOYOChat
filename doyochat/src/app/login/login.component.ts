import { Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DrawService } from '../services/draw.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup
  isSubmitted: boolean;
  errorMessage: string
  
  constructor(private router: Router, private authService: AuthService, private drawService: DrawService) { 
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.isSubmitted = false;
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(35), Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(35), Validators.pattern('^[A-Za-z0-9]+$')])
    });
  }

  login(): void|string {
    this.isSubmitted = true;
    if(this.form.valid)
      this.authService.login(this.form.controls.email.value, this.form.controls.password.value).subscribe((resp)=>{
        if (resp.icon){
          this.drawService.setGameMode(true);
          this.router.navigate(['/home']);
        }
        else {
          this.drawService.setGameMode(false);
          this.router.navigate(['/draw']);
        }
      })
    return 'wrong value'
  }

  discordLogin(): void {
    alert('discordLogin');
    this.router.navigate(['/home']);
  }

  removeErrors():void{
    this.isSubmitted = false;
  }
}
