import { Directive, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appHidePopover]'
})
export class HidePopoverDirective implements OnInit, OnDestroy {
  private routerEventsSubscription: Subscription | undefined;

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit() {
    this.routerEventsSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        this.clearPopoverContent();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  private clearPopoverContent() {
    const popovers = document.querySelectorAll('.popover.show.bs-popover-bottom');
    popovers.forEach(popover => {
      this.renderer.removeChild(popover.parentNode, popover);
    });
  }
}
