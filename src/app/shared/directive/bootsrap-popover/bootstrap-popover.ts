  import {Directive, ElementRef, OnInit, Input, Output, EventEmitter, TemplateRef,ViewContainerRef,SimpleChanges, SimpleChange } from '@angular/core';

  declare var $:any;
  @Directive({
    selector: '[bootstrap-popover]'
  })

  export class BootstrapPopoverDirective implements OnInit {
    //https://www.jqueryscript.net/time-clock/Date-Range-Picker-Plugin-jQuery.html

    // @Input()
    // popoverElement!: TemplateRef<any>;
    @Input() popupTemplate!: HTMLElement;
    @Input() animation:any = false;
    @Input() html:any = true;
    @Input() placement:any = 'bottom';
    @Input() title:any='';
    @Input() trigger:any='hover';
    @Input() templateString:any;


    constructor(private elementRef: ElementRef, private containerRef: ViewContainerRef) {
   
       
    }

    ngOnInit() {
      
    }

    ngOnChanges(changes: SimpleChanges): void {
      //console.log(changes);
      this.updateElement();
    }
    updateElement(){
      //console.log(this.popupTemplate)
      let t:any
      if(this.popupTemplate){
        t = this.popupTemplate.innerHTML;
      }
      else{
        t = this.templateString
      }
      //console.log(this.elementRef,t)
      $(this.elementRef.nativeElement).popover({ 
        // title: "<span class='booked'>This is booked</span>", 
        content: t,
        animation:this.animation,
        html:this.html,
        placement:this.placement,
        title:this.title,
        trigger:this.trigger
      });
    }

  }
  
