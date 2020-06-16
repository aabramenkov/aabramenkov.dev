import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-linkedin-auth',
  template: '<h1>Waiting for authorization from Linkedin</h1>',
  styles: [''],
})
export class LinkedinAuthComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const linkedinAuthCode = this.route.snapshot.queryParamMap.get('code');
    this.authService.linkedinAuth(linkedinAuthCode).subscribe(
      () => {
        const actualPageUrl = localStorage.getItem('actualPageUrl');
        if (actualPageUrl) {
          localStorage.removeItem('actualPageUrl');
          this.router.navigate([actualPageUrl]);
        } else {
          this.router.navigate(['about']);
        }
      },
      (error) => {
        this.router.navigate(['about']);
      }
    );
  }
}
