  import {Directive, ElementRef, OnInit, Input, Output, EventEmitter} from '@angular/core';

  @Directive({
    selector: '[daterangepicker]'
  })

  export class DateRangePickerDirective implements OnInit {
    @Input() options: any = {};
    @Input() orientation: any = 'left';
    @Output() selected: any = new EventEmitter();


    constructor(private elementRef: ElementRef) {}

    ngOnInit() {

      // this.options["periods"] = ['day'] 
      // this.options["orientation"] = this.orientation;
      // this.options["forceUpdate"]=true
      // this.options["timeZone"] = null;  // user's computer time zone
              // /timeZone: 'utc'
              //timeZone: 'Australia/Sydney'
      //this.options["single"] = false,
      
      $(this.elementRef.nativeElement)
        .daterangepickerr(this.options, this.dateCallback.bind(this));
    }

    dateCallback(start:any, end:any, label:any) {
      $(this.elementRef.nativeElement).val(start.format('MMM DD, YYYY') + ' – ' + end.format('MMM DD, YYYY'));
      let message = 
        [start.format('YYYY-MM-DD') ,end.format('YYYY-MM-DD')]
      
      ;
      this.selected.emit(message);
    }
  }
  
