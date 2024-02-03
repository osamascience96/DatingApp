import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{

  model: any = {}
  loggedInObservable: Observable<User | null> = of(null);

  constructor(private accountService: AccountService){}

  ngOnInit(): void {
  }


  login() {
    this.accountService.login(this.model)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.loggedInObservable = this.accountService.currentUser$;
        },
        error: (error) => {
          console.log(error);
        } 
    })
  }

  logout() {
    this.accountService.logout();
  }
  
}
