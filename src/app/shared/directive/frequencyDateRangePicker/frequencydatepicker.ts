  import {Directive, ElementRef, OnInit, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
  import * as moment from 'moment';
  import { FREQUENCY_DATE_PICKER_PERIODS } from '../../_helpers/datetime.periods';

  @Directive({
    selector: '[frequencydatepicker]'
  })

  export class FrequencyDatePickerDirective implements OnInit {
    //https://www.jqueryscript.net/time-clock/Date-Range-Picker-Plugin-jQuery.html
    @Input() startDate: any;
    @Input() endDate: any;
    @Input() periods:any = FREQUENCY_DATE_PICKER_PERIODS;
    @Input() selectedPeriod:any
    @Input() parentElement:any
    @Input() anchorElement:any

    options: any = {};
    @Output() callback: any = new EventEmitter();
    

    constructor(private elementRef: ElementRef) {
   
       
    }

    ngOnInit() {

      if(this.parentElement){
        this.parentElement = '#'+ this.parentElement;
      }

      this.options = {
        //timezone : '+0500',//Intl.DateTimeFormat().resolvedOptions().timeZone,
        timeZone: null, // user's computer time zone
        // /timeZone: 'utc'
        //timeZone: 'Australia/Sydney'
        minDate: moment().startOf('year').subtract(5, 'years'),
        maxDate: moment(),
        forceUpdate:true,
        firstDayOfWeek: 6,
        single: true,
        locale: {
          format: 'MMM DD, YYYY'
        },
        
        periods: this.periods,
        parentElement: this.parentElement ,
        anchorElement:this.anchorElement,
        period: this.selectedPeriod,
      }
      this.changeDate();
      this.options["callback"] = this.dateCallback.bind(this);
        $(this.elementRef.nativeElement)
          .daterangepicker(this.options,null,true); 
            
    }

    dateCallback(startDate:any, endDate:any, period:any) {
      startDate._isUTC=false;
      endDate._isUTC=false;
      
      $(this.elementRef.nativeElement).val(startDate.format('MMM DD, YYYY') + ' – ' + endDate.format('MMM DD, YYYY'));
      let message = {
        StartEndDateArr : [startDate.format('YYYY-MM-DD') ,endDate.format('YYYY-MM-DD')],
        startDate : startDate.toDate(),
        endDate : endDate.toDate(),
        period : period
      };

      this.callback.emit(message);
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //   // let startDate = changes["startDate"].currentValue;
    //   // let endDate = changes["endDate"].currentValue;
    //   if(changes.startDate || changes.endDate){
    //     this.changeDate();
    //   }
      
    // }
 
   changeDate(){

    this.startDate._isUTC=false;
    this.endDate._isUTC=false;

      this.options["startDate"] = this.startDate.format('YYYY-MM-DD');
      this.options["endDate"] = this.endDate.format('YYYY-MM-DD');
      this.options["period"] = this.selectedPeriod;
   }
   

    loadScript(src:any){
      var script = document.createElement("script");
      script.type = "text/javascript";
      document.getElementsByTagName("body")[0].appendChild(script);
      script.src = src;
    }

    loadStyle(src:any){
      var style = document.createElement("link");
      style.rel = "stylesheet";
      document.getElementsByTagName("head")[0].appendChild(style);
      style.href = src;
    }
  }
  
