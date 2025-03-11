import { DOCUMENT } from "@angular/common";
import { AfterViewInit, Directive, ElementRef, Inject, OnDestroy, Input, Output,EventEmitter } from "@angular/core";
import { Subscription, fromEvent } from "rxjs";
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[clickOutside]',
})

export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
    @Input() isContainDateRangePicker:any;
    @Output() clickOutside = new EventEmitter<void>();
  
    documentClickSubscription: Subscription | undefined;
  
    constructor(
      private element: ElementRef,
      @Inject(DOCUMENT) private document: Document
    ) {}
  
    ngAfterViewInit(): void {
      this.documentClickSubscription = fromEvent(this.document, 'click')
        .pipe(
          filter((event:any) => {
            let target :any = event.target as HTMLElement;
            let isInside =  this.isInside(target)


            if(!isInside && this.isContainDateRangePicker){
              //daterangepicker all element after clicking on frequency wiped out, so it cannot get parent element of click
              //element so added this condition, so it will stay on that dropdown, we have to give isContainDateRangePicker in main dropdown
              //so it will stay dropdown and not close on selection of daterangepicker
              if(target?.parentNode?.innerHTML?.trim()?.startsWith('<div class=\"table-value\" data-bind=\"html: $data.html, css: $data.css\">')
                  || target?.parentNode?.innerHTML?.trim()?.startsWith('<div class="table-value-wrapper" data-bind="foreach: $parents[1].tableValues($data)')
                )
              {
                return false;
              }
            }
            return !isInside;
          })
        )
        .subscribe(() => {
          this.clickOutside.emit();
        });
    }
  
    ngOnDestroy(): void {
      this.documentClickSubscription?.unsubscribe();
    }
  
    isInside(elementToCheck: HTMLElement): boolean {
      console.log(elementToCheck)
      return (
        elementToCheck === this.element.nativeElement ||
        this.element.nativeElement.contains(elementToCheck)
      );
    }
  }