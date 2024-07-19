import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { AccountService } from '../_services/account.service';
import { map } from 'rxjs';

@Directive({
  selector: '[appIsAuthenticated]',
  standalone: true,
})
export class IsAuthenticatedDirective implements OnInit {
  private accountService = inject(AccountService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);

  ngOnInit(): void {
    this.accountService.currentUser$
      .pipe(
        map((user) => {
          // console.log(this.showWhenAuthenticated);
          if (user != null) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
          } else {
            this.viewContainerRef.clear();
          }
        })
      )
      .subscribe();
  }
}