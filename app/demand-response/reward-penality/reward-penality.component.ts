import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EventBean } from '../../vo/event-bean';
import { DataBean } from '../../vo/data-bean';
import { BinEnum } from '../../bin-enum';
import { GkCommonServiceService } from '../../gk-common-service.service';
import { Renderer } from '@angular/core/src/render/api';
import { DataServiceService } from '../../data-service.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeRangeUtil } from '../../utils/time-range-util';
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { HierarchyService } from '../../hierarchy.service';
import { EventStatistics } from '../../vo/event-statistics';
declare var Highcharts: any;

@Component({
  selector: 'app-reward-penality',
  templateUrl: './reward-penality.component.html',
  styleUrls: ['./reward-penality.component.css']
})
export class RewardPenalityComponent implements OnInit {

  //serverURL = 'http://nginx.greenkoncepts.com:8000';
  serverURL = 'https://nginx.greenkoncepts.com:9001';
  showMessagePopUp: boolean = false;
  binNum = 1;
  barChartLabels: string[] = [];
  isLighting: boolean = false;
  isAppliance: boolean = false;
  isAirCondition: boolean = false;
  isWaterHeater: boolean = false;
  airConName: string = "";
  lightingName: string = "";
  waterHeaterName: string = "";
  applianceName: string = "";
  floorPlanName: string = "";
  lighting: number = 0;
  airCondition: number = 0;
  appliance: number = 0;
  waterHeater: number = 0;
//   incentivesByDay: number = 0;
//   incentivesByToday: number[] = Array < number > ();
  incentivesByYear: number[] = Array < number > ();
  incentivesByWeek: number[] = Array < number > ();
  totalIncentives : number = 0.00;
  instantPower: number = 0;
  private newData: Array < any > = Array < any > ();    

  constructor(private _httpService: GkCommonServiceService, private _dataService: DataServiceService,
    private http: Http, private router: Router, private hierarchyService: HierarchyService) {
        const timeRangObj = TimeRangeUtil.getTimeRangeObject(this.binNum);
        this.barChartLabels = timeRangObj.labels;
        this.hierarchyService.allData$.asObservable()
        .filter(item => item != null)
        .subscribe(
            data => {
                debugger
                if (data instanceof Array && data.length == 0)
                    return;
                this.newData.push(data);
                if(this.floorPlanName == "") {
                    this.floorPlanName = this.newData[0].nodeTreeDatas.name;
                    this.getEnergyByWeek().subscribe(
                            data => {
                                debugger
                                this.createConsumptionChart();
                            });
                    }
                console.log(data);
            },
            err => {
                this.showMessagePopUp = true;
            });
     }

    ngOnInit() {
    
    }

    // getEnergyBreakDown(): Observable < any > {

    //     let nodeName = this.waterHeaterName + "," + this.lightingName + "," + this.airConName + "," + this.applianceName;
    //     let key = this._dataService.key;
    //     let now = new Date();
    //     return this._httpService.getInstantaneousEvents(nodeName, "Power", "GetInstantPower")
    //         .map(
    //             data => {
    //                 debugger
    //                 let statistics: EventStatistics[] = data.statistics;
    //                 if (statistics == null || statistics.length == 0) {
    //                     return null;
    //                 }
    //                 for (let item of statistics) {
    //                     if (item.ciName == this.airConName) {
    //                         this.airCondition = item.lastValue / 1000;
    //                     } else if (item.ciName == this.lightingName) {
    //                         this.lighting = item.lastValue / 1000;
    //                     } else if (item.ciName == this.applianceName) {
    //                         this.appliance = item.lastValue / 1000;
    //                     } else if (item.ciName == this.waterHeaterName) {
    //                         this.waterHeater = item.lastValue / 1000;
    //                     }
    //                 }
    //                 if(this.isAirCondition)
    //                     this.instantPower += this.airCondition;
    //                 if(this.isAppliance)
    //                     this.instantPower += this.appliance;
    //                 if(this.isLighting)
    //                     this.instantPower += this.lighting;
    //                 if(this.isWaterHeater)
    //                     this.instantPower += this.waterHeater;
    //             }
    //         );
    // }
  onChange(value) {
    // if (value == "today") {
    //     this.binNum = 1;
    //     this.getEnergyByDay().subscribe(
    //         data => {
    //             this.createConsumptionChartByToday();
    //         }
    //     );
    // } else 
    if (value == "week") {
        debugger
        this.getEnergyByWeek().subscribe(
            data => {
                debugger
                this.createConsumptionChart();
            }
        );

    } else if (value = "year") {
        this.binNum = 3;
        this.getEnergyByYear().subscribe(
            data => {
                this.createConsumptionChartByYear();
            }
        );
    }
}

// getEnergyByDay(): Observable < any > {
//   this.totalIncentives = 0.00;
//   this.incentivesByDay = 0;
//   this.incentivesByToday = [];
//   const nodeName = this.floorPlanName;
//   let key = this._dataService.key;
//   let now = new Date();
//   now.setMinutes(0);
//   now.setSeconds(0);
//   now.setHours(now.getHours());
//   let beginTime = new Date();
//   beginTime.setHours(0);
//   beginTime.setMinutes(0);
//   beginTime.setSeconds(0);

//   return this.http.get(this.serverURL + '/getIncentives/')
//   .map(
//     data => {
//         debugger;
//         let newData = data.json();
//         console.log(newData);
//         for(let item of newData) {
//             if (item.node_name === this.floorPlanName) {
//                 this.incentivesByDay = (Number(Number(item.incentives).toFixed(2)));
//             }
//         }
//     });
// }

getEnergyByWeek(): Observable < any > {
  this.totalIncentives = 0.00;
  const nodeName = this.floorPlanName;
  let key = this._dataService.key;
  this.incentivesByWeek = [];

  let firstday = new Date();
  console.log(firstday);
  let day = firstday.getDay();
  let diff = firstday.getDate() - day + (day == 0 ? -6 : 1);
  firstday = new Date(firstday.setDate(diff));
  firstday.setHours(0);
  firstday.setMinutes(0);
  firstday.setSeconds(0);
  let lastDay = new Date();
  debugger
  return this.http.get(this.serverURL + '/getIncentivesByWeek/')
  .map(
    data => {
        debugger;
        debugger;
        let newData = data.json();
        console.log(newData);
        for(let item of newData) {
            if (item.node_name === this.floorPlanName) {
                this.incentivesByWeek.push(Number(Number(item.incentives).toFixed(2)));
                this.totalIncentives += item.incentives.toFixed(2);
            }
        }
    });
}

getEnergyByYear(): Observable < any > {
  this.totalIncentives = 0.00;
  this.incentivesByYear = [];
  const nodeName = this.floorPlanName;
  let key = this._dataService.key;
  let now = new Date();
  let firstDayOfYear = new Date();
  firstDayOfYear.setMonth(now.getMonth() - 12);
  firstDayOfYear.setDate(1);
  firstDayOfYear.setHours(0);
  firstDayOfYear.setMinutes(0);

  debugger
  return this.http.get(this.serverURL + '/getIncentivesByYear/')
  .map(
    data => {
        debugger;
        let newData = data.json();
        console.log(newData);
        for(let item of newData) {
            if (item.node_name === this.floorPlanName) {
                this.incentivesByYear.push(Number(Number(item.incentives).toFixed(2)));
                this.totalIncentives += item.incentives.toFixed(2);
            }
        }
    });
}

// createConsumptionChartByToday() {
//     this.getEnergyBreakDown();
//     this.createChartLabels();
//     this.incentivesByToday.reverse();
//     for (let i = 0; i < this.barChartLabels.length; i++) {
//          if(this.barChartLabels[i] == '14:00') {
//             // if(this.instantPower < 6) {
//             //     this.incentivesByToday.push(50);
//             //     this.totalIncentives = 50.00;
//             // } else {
//             //     this.incentivesByToday.push(-50);
//             //     this.totalIncentives = -50.00;
//             // }
//         } else {
//             this.incentivesByToday.push(0.00);
//         }
//     }
//     Highcharts.chart('consumptionChartDIV', {
//         chart: {
//             type: 'column'
//         },
//         title: {
//             text: ''
//         },
//         legend: {
//             layout: 'vertical',
//             align: 'left',
//             verticalAlign: 'top',
//             x: 150,
//             y: 100,
//             floating: true,
//             borderWidth: 1,
//             backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
//         },
//         xAxis: {
//             categories: this.barChartLabels
//         },
//         yAxis: {
//             labels: {
//                 formatter: function () {
//                     return "$" + this.value.toFixed(2);
//                 }
//             },
//             title: {
//                 text: ''
//             }
//         },
//         tooltip: {
//             shared: true,
//             formatter: function() {
//                 return "$ " + this.y.toFixed(2);
//             }
//         },
//         credits: {
//             enabled: false
//         },
//         plotOptions: {
//             areaspline: {
//                 fillOpacity: 0.5
//             },
//             column: {
//                 minPointLength: 3
//             }
//         },
//         series: [{
//             showInLegend: false,
//             name: '',
//             data: this.incentivesByToday
//         }]
//     });

// }

createConsumptionChartByYear() {
    debugger
    this.createChartLabels();
    this.incentivesByYear.reverse();
    for (let i = 0; i < this.barChartLabels.length; i++) {
        if (typeof this.incentivesByYear[i] === "undefined") {
            this.incentivesByYear.push(0);
        }
    }
    this.incentivesByYear.reverse();

    Highcharts.chart('consumptionChartDIV', {
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        xAxis: {
            categories: this.barChartLabels
        },
        yAxis: {
            labels: {
                formatter: function () {
                    return "$" + this.value.toFixed(2);
                }
            },
            title: {
                text: ''
            }
        },
        tooltip: {
            shared: true,
            formatter: function() {
                return "$ " + this.y.toFixed(2);
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            },
            column: {
                minPointLength: 3
            }
        },
        series: [{
            showInLegend: false,
            name: '',
            data: this.incentivesByYear
        }]
    });

}


createChartLabels() {
    const timeRangObj = TimeRangeUtil.getTimeRangeObject(this.binNum);
    this.barChartLabels = timeRangObj.labels;
    console.log("number bar chart : " + this.barChartLabels);
}

  createConsumptionChart() {
    let categories = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];
    this.barChartLabels = [];
    let currentDay = new Date().getDay();
    debugger
    for (let i = 0; i < currentDay; i++) {
        this.barChartLabels[i] = categories[i]; 
        if (typeof this.incentivesByWeek[i] === "undefined") {
            this.incentivesByWeek[i] = 0;
        }

    }
    console.log("week :" + this.incentivesByWeek);
    Highcharts.chart('consumptionChartDIV', {
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        xAxis: {
            categories: this.barChartLabels
        },
        yAxis: {
            labels: {
                formatter: function () {
                    return "$" + this.value.toFixed(2);
                }
            },
            title: {
                text: ''
            }
        },
        tooltip: {
            shared: true,

            formatter: function() {
                return "$ " + this.y.toFixed(2);
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            },
            column: {
                minPointLength: 3
            }
        },
        series: [{
            showInLegend: false,
            name: '',
            data: this.incentivesByWeek
        }]
    });

}
}