import {
  Directive,
  Input,
  ViewContainerRef,
  TemplateRef,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../_services/auth.service';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective implements OnInit {
  private decodedToken: any;
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService
  ) {}
  @Input() appHasRole!: string[];
  isVisible = false;

  ngOnInit(): void {
      if (this.authService.roleMatch(this.appHasRole)) {
        if (!this.isVisible) {
          this.isVisible = true;
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
          this.isVisible = false;
          this.viewContainerRef.clear();
        }
      } else {
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
  }
}
