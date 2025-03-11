  import {Directive, ElementRef, OnInit, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
  declare var $: any;

  @Directive({
    selector: '[flot-chart]'
  })

  export class FlotChartDirective implements OnInit {

    @Input() monthlyGraphValues: any = [];
    @Input() monthlyComparisonGraphValues: any = []
    @Input() yAxisTitle :any;
    @Input() isX_AxisString:boolean=false;
    @Input() stringLabels:any;
    @Input() stringLabelName:any;
    @Input() isResizeGraph: boolean=false
    // @Input() options: any = {};
    // @Input() orientation: any = 'left';
    // @Output() selected: any = new EventEmitter();

  //   dealtime = [
  //     [new Date("2022-01-01").getTime(), 61.05],
  //     [new Date("2022-02-01").getTime(), 58.32],
  //     [new Date("2022-03-01").getTime(), 57.35],
  //     [new Date("2022-04-01").getTime(), 96.31],
  //     [new Date("2022-05-01").getTime(), 55.55],
  //     [new Date("2022-06-01").getTime(), 65.64],
  //     [new Date("2022-07-01").getTime(), 54.02],
  //     [new Date("2022-08-01").getTime(), 81.88],
  //     [new Date("2022-09-01").getTime(), 52.99],
  //     [new Date("2022-10-01").getTime(), 72.99],
  //     [new Date("2022-11-01").getTime(), 51.21],
  //     [new Date("2022-12-01").getTime(), 52.24]
  // ];


    monthlyValues :any= [];
    monthlyComparisonValues :any= [];

    graphDataArr:any=[];
    firstTime:boolean=false

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {

      this.plotGrapgh()

      // if(this.monthlyGraphValues && this.monthlyGraphValues.length>0){
      //   for(let i=0;i<this.monthlyGraphValues.length;i++){
      //     let currentIndexVal = this.monthlyGraphValues[i];
      //     let graphVal:any = [new Date(currentIndexVal.Date),currentIndexVal.Value,currentIndexVal?.status];
      //     this.monthlyValues.push(graphVal);
      //   }

      //   if(this.monthlyComparisonGraphValues && this.monthlyComparisonGraphValues.length>0){
      //     for(let i=0;i<this.monthlyComparisonGraphValues.length;i++){
      //       let currentIndexVal = this.monthlyComparisonGraphValues[i];
      //       let graphVal:any = [new Date(currentIndexVal.Date),currentIndexVal.Value,currentIndexVal?.status];
      //       this.monthlyComparisonValues.push(graphVal);
      //     }
      //   }

      //   if(this.monthlyValues.length>0){
      //     this.graphDataArr.push({
      //       data: this.monthlyValues,
      //       label: ""
      //     });
      //   }

      //   if(this.monthlyComparisonValues.length>0){
      //     this.graphDataArr.push({
      //       data: this.monthlyComparisonValues,
      //       label: ""
      //     });
      //   }

      //   this.doPlot("right");
        
      // }


      // this.options["periods"] = ['day']
      // this.options["orientation"] = this.orientation;
      // this.options["forceUpdate"]=true
      // this.options["timeZone"] = null;  // user's computer time zone
      //         // /timeZone: 'utc'
      //         //timeZone: 'Australia/Sydney'
      // //this.options["single"] = false,

      // $(this.elementRef.nativeElement)
      //   .daterangepicker(this.options, this.dateCallback.bind(this));
    }
    ngOnChanges(changes: SimpleChanges): void {
      // this.monthlyValues=changes["monthlyValues"].currentValue
      if(changes.monthlyGraphValues){
        console.log("test",this.monthlyComparisonGraphValues,this.monthlyGraphValues)
        this.plotGrapgh()

      }
      // this.monthlyGraphValues=changes["monthlyGraphValues"].currentValue
      // // if(this.monthlyValues){
      //   console.log("test")
      //   this.plotGrapgh()

      // }

    //   if(this.firstTime==true){
    //     this.plotGrapgh()

    // }
      // console.log("test",this.monthlyComparisonGraphValues,this.monthlyGraphValues)
      // this.monthlyGraphValues=this.monthlyGraphValues
    }

    euroFormatter(v:any, axis:any) {
      return v.toFixed(axis.tickDecimals) + "€";
    }


    doPlot(position:any) {
      $.plot($(this.elementRef.nativeElement),
      this.graphDataArr,
    //   [
    //   {
    //       data: this.monthlyValues,
    //       label: ""
    //   },
    //   {
    //     data: // [new Date("2022-05-01"), 55.55],
    //     [
    //       [new Date("2023-01-01"), 0],
    //       [new Date("2023-02-01"), 0],
    //       [new Date("2023-03-01"), 57.35],
    //       [new Date("2023-04-01"), 96.31],
    //       [new Date("2023-06-01"), 65.64],
    //       [new Date("2023-07-01"), 54.02],
    //       [new Date("2023-08-01"), 81.88],
    //       [new Date("2023-09-01"), 52.99],
    //       [new Date("2023-10-01"), 72.99],
    //       [new Date("2023-11-01"), 51.21],
    //       [new Date("2023-12-01"), 52.24],

    //     ],
    //     label: ""
    //   }
    // ],
    {
          xaxes: this.returnXAxisLabel(),
          yaxes: [{
              axisLabel: this.yAxisTitle,
              min: 0,
              //show digit in integer instead of decimal point, when number is small
              tickDecimals: 0 
          }, {
              // align if we are to the right
              alignTicksWithAxis: position == "right" ? 1 : null,
              position: position,
              tickFormatter: this.euroFormatter
          }],
          legend: {
              position: 'sw'
          },
          colors: ["#1ab394","#1761a0"],
          grid: {
              color: "#999999",
              hoverable: true,
              clickable: true,
              tickColor: "#D4D4D4",
              borderWidth: 0,
              //hoverable: true //IMPORTANT! this is needed for tooltip to work,
          },
          tooltip: true,
        //   tooltipOpts: {
        //     content: function(label: string, xval: any, yval: any, flotItem: any) {
        //       if(flotItem?.series?.data?.[flotItem?.dataIndex]?.[2]){
        //         const status = flotItem.series.data[flotItem?.dataIndex]?.[2]; 
        //         const statusLines = status?.split(',')?.join('<br/>'); 
        //         return statusLines;
        //       }
             
        //     },
        //     xDateFormat: "%b",
        //     onHover: function(flotItem: any, $tooltipEl: any) {
        //         // console.log(flotItem, $tooltipEl);
        //     }
        // }
        tooltipOpts: {
          content: function(label: string, xval: any, yval: any, flotItem: any) {
              const status = flotItem.series.data[flotItem.dataIndex]?.[2]; // Access the status value from the data array
              let statusLines = status?.split(',')?.join('<br/>'); 
              return statusLines
              // return `<div style="background-color:black; color: #fff; padding: 10px; border: none;">
                 
              //     <span>${statusLines}</span>
              // </div>`;
          },
          xDateFormat: "%b",
          onHover: function(flotItem: any, $tooltipEl: any) {
              console.log("flot",flotItem, $tooltipEl);
              $tooltipEl.css("z-index", 9999);
          }
      }
        
        
          // tooltipOpts: {
          //     content: "%s for %x was %y",
          //     xDateFormat: "%b", // Tooltip date format

          //     onHover: function(flotItem:any, $tooltipEl:any) {
          //         // console.log(flotItem, $tooltipEl);
          //     }
          // }
      });
  }

  plotGrapgh(){
    this.monthlyValues=[]
    this.monthlyComparisonValues=[]
    this.graphDataArr=[]
    if(this.monthlyGraphValues && this.monthlyGraphValues.length>0){
      this.monthlyValues = this.convertDataForFlot(this.monthlyGraphValues);
      // for(let i=0;i<this.monthlyGraphValues.length;i++){
      //   let currentIndexVal = this.monthlyGraphValues[i];
      //   let graphVal:any = [new Date(currentIndexVal.Date),currentIndexVal.Value,currentIndexVal?.status];
      //   this.monthlyValues.push(graphVal);
      // }

      if(this.monthlyComparisonGraphValues && this.monthlyComparisonGraphValues.length>0){
        this.monthlyComparisonValues = this.convertDataForFlot(this.monthlyComparisonGraphValues);

        // for(let i=0;i<this.monthlyComparisonGraphValues.length;i++){
        //   let currentIndexVal = this.monthlyComparisonGraphValues[i];
        //   let graphVal:any = [new Date(currentIndexVal.Date),currentIndexVal.Value,currentIndexVal?.status];
        //   this.monthlyComparisonValues.push(graphVal);
        // }
      }

      if(this.monthlyValues.length>0){
        this.graphDataArr.push({
          data: this.monthlyValues,
          label: ""
        });
      }

      if(this.monthlyComparisonValues.length>0){
        this.graphDataArr.push({
          data: this.monthlyComparisonValues,
          label: ""
        });
      }

      this.doPlot("right");

    }
    
    if(this.isResizeGraph){
      $(window).resize(() => {
        this.doPlot("right");
      });
      
    }
   

  }

  convertDataForFlot(graphValues:any){
    let flotGraphList=[]
    for(let i=0;i<graphValues.length;i++){
      let currentIndexVal = graphValues[i];
      let graphVal:any;
      if(this.isX_AxisString){
        graphVal = [currentIndexVal[this.stringLabelName],currentIndexVal.Value,currentIndexVal?.status];
      }
      else{
        graphVal = [new Date(currentIndexVal.Date),currentIndexVal.Value,currentIndexVal?.status];
      }
      
      flotGraphList.push(graphVal);
    }
    return flotGraphList;
  }
  // ngAfterViewInit(): void {
  //   this.doPlot("right");
  //   $(window).resize(() => {
  //     this.doPlot("right");
  //   });
  // }
  returnXAxisLabel(){
    let labelArray;
    if(!this.isX_AxisString){
      labelArray= [{
        mode: 'time',
        timeformat: "%b", // Display only the month
        tickSize: [1, "month"], // Display ticks every 1 month
        minTickSize: [1, "month"], // Set the minimum tick size to 1 month
        // min: new Date("2022-01-01").getTime(), // Set the start date to January
        // max: new Date("2022-12-31").getTime() // Set the end date to December
       }]
    }
    else{
      labelArray = [{
        ticks: this.stringLabels
         //[[0,'Bob'],[1,'Chris'],[2,'Joe']]
      }]
    }
    
  return labelArray
  // let labelArray = [{
  //   mode: 'time',
  //   timeformat: "%W", // Display only the month
  //   tickSize: [1, "week"], // Display ticks every 1 week
  //   axisLabel: 'Weeks' // Set axis label
  // }];
  // return labelArray;
  }
}

