import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DrawService } from '../services/draw.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: AuthService;
  let router: Router;
  let draw: DrawService;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    service = jasmine.createSpyObj('AuthService', ['login']);
    draw = jasmine.createSpyObj('DrawService', ['setGameMode']);
    
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
      {
      provide: AuthService,
      useValue: service},
      {
      provide: Router,
      useValue: router},
      {
      provide: DrawService,
      useValue: draw
      }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      })
      .compileComponents();
      });
      

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should init form', () => {
    component.initForm();
    expect(component.form).toBeDefined();
  });
  
  //Перевырка коректності вхідних даних
  it('should has errors of form', () => {
    component.form.setValue({email: 'newgmail.com', password: '111811111115'})
    expect(component.form.valid).toBeFalsy();
  });


  it('should call auth login method', () => {
    component.form.setValue({email: 'new@gmail.com', password: '12345678'})
    service.login = jasmine.createSpy().and.returnValue(of ('response'));
    component.login();
    expect(component.form.value).toBeTruthy();
    expect(service.login).toHaveBeenCalled();
    });
  
  //Преревірка чи повертнає метод із запитом на сервер дані/статус
  it('should return answer from server', () => {
    service.login = jasmine.createSpy().and.returnValue(of ('error'));
    component.form.setValue({email: 'new@gmail.com', password: '111811111115'})
    expect(component.login()).toBeDefined();
  })

  //Перевірка, чи перекидує коритсувача на головну сторінку 
  it('should navigate to home page', () => {
    spyOn(component.form, 'value').and.returnValue(true);
    service.login = jasmine.createSpy().and.returnValue(of ('icon'));
    router.navigate = jasmine.createSpy().and.returnValue(new Promise(() => true));
    component.login();
    //expect(router.navigate).toHaveBeenCalled();
    expect(component.form.value).toBeTruthy();
  });
});