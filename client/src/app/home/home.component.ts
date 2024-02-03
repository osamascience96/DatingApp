import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  registerMode = false;
  users: User[] = [];

  constructor(private userService: UsersService){}

  ngOnInit(): void {
    this.getUsers();
  }
  

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  getUsers() {
    this.userService.getUsers()
      .subscribe({
        next: (response) => {
          this.users = response;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log("Request has Completed");
        }
      });
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }

}
