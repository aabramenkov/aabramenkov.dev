import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-fb-auth',
  template:
    '<h2>Waiting for Facebook authentication.</h2><br>',
  styles: [''],
})
export class FbAuthComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const fbAuthCode: string|null = this.route.snapshot.queryParamMap.get('code');
    if (!fbAuthCode){
      console.error ('Authorization failed');
      return;
    }
    this.authService.fbAuth(fbAuthCode).subscribe(
      () => {
        const actualPageUrl = localStorage.getItem('actualPageUrl');
        if (actualPageUrl){
          localStorage.removeItem('actualPageUrl');
          this.router.navigate([actualPageUrl]);
        }else{
          this.router.navigate(['about']);
        }
      },
      (error) => {
        this.router.navigate(['about']);
      }
    );
  }
}
