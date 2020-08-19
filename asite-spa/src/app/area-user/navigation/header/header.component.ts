import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {faBars} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  faBars = faBars;
  photoUrl: string;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.photoUrl.subscribe(
      (photoUrl) => (this.photoUrl = photoUrl)
    );
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  login() {
    const headerText = 'Sign in with...';
    this.authService.login(headerText);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['about']);
  }

  loggedIn(): boolean {
    return this.authService.loggedIn;
  }
  roleMatch(): boolean {
    let isMatch = false;
    isMatch = this.authService.roleMatch(['Admin']);
    return isMatch;
  }

}
