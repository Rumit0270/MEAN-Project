import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../auth/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private authStatusSubscription: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.isAuthenticated = this.userService.getIsAuthenticated();
    this.authStatusSubscription = this.userService.getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.userService.logout();
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }

}
