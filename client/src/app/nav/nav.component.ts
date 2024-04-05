import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Observable, map, of } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{

  model: any = {}
  currentUser: any;
  loggedInObservable: Observable<User | null> = of(null);

  constructor(
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.SetLoggedInObservable();
  }


  login() {
    this.accountService.login(this.model)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('/members');
          this.SetLoggedInObservable();
        }
    })
  }

  SetLoggedInObservable = () => {
    this.loggedInObservable = this.accountService.currentUser$;
    this.loggedInObservable.subscribe(
      (user: User | null) => {
        this.currentUser = user;
      }
    )
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
  
}
