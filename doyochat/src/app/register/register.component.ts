import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  register(): void {
    this.router.navigate(['/login']);
  }

  discordRegister(): void {
    alert('discordRegister');
    this.router.navigate(['/login']);
  }
}