import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IoService } from '../io.service';
import { Account } from '../models/account';
import { DrawService } from '../services/draw.service';
import { UserService } from '../services/user.service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let userService: UserService;
  let drawService: DrawService;
  let matDialog: MatDialog;
  let matSnackBar: MatSnackBar;
  let socketService: IoService;
  let account = new Account('yana','dsdsf@fsfef', 23, [],[],[]);

  beforeEach(async () => {

    userService = jasmine.createSpyObj('UserService', ['getProfile' ,'getIcon', 'saveUserName', 'setProfile']);
    userService.getProfile = jasmine.createSpy().and.returnValue(new Account('yana','dsdsf@fsfef', 23, [],[],[]));
    userService.getIcon = jasmine.createSpy().and.returnValue('base64_of_animation');

    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [
      {
      provide: UserService,
      useValue: userService},
      {
      provide: Router,
      useValue: router},
      {
      provide: DrawService,
      useValue: drawService},
      {
      provide: MatDialog,
      useValue: matDialog},
      {
      provide: MatSnackBar,
      useValue: matSnackBar
      },
      {
      provide: IoService,
      useValue: socketService,
      }
    ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change username', () => {

    userService.setProfile = jasmine.createSpy('Aсcount з новим username');//Шпіон для збереження змін у localstorage
    userService.saveUserName= jasmine.createSpy('changedName');//Шпіон для виклику функції запиту на сервер
    component.isSubmitted = true;//Копка підтвердження змін натиснута
    account.username = 'oldName'//Початкове значення поля ім'я
    component.form.setValue({username: 'newname5'});//Нове введене користувачем значення
    
    component.saveName();

    expect(component.form.valid).toBeTruthy();
    expect(userService.saveUserName).toHaveBeenCalled();
    expect(userService.setProfile).toHaveBeenCalled();
    expect(component.username).toEqual('newname5');

  });

  it('should not change username', () => {

    userService.setProfile = jasmine.createSpy('Aсcount з новим username');
    userService.saveUserName= jasmine.createSpy('changedName');
    component.isSubmitted = true;
    account.username = 'oldName'//Початкове значення поля ім'я
    component.form.setValue({username: 'new34u9"№;3234@34'});//Нове НЕКОРЕКТНЕ введене користувачем значення
    
    component.saveName();

    expect(component.form.valid).toBeFalse();
  });

});
