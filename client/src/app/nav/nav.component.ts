import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Observable, of } from 'rxjs';
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
        },
        error: (error) => {
          this.toastr.error(error?.error);
        } 
    })
  }

  SetLoggedInObservable = () => {
    this.loggedInObservable = this.accountService.currentUser$;
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
  
}
