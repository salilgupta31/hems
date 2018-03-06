import { TranslateService } from 'ng2-translate/src/translate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServiceService } from '../data-service.service';
import { GkCommonServiceService } from '../gk-common-service.service';
import { BasePage } from '../common/base-page';
import { Component, OnInit } from '@angular/core';
import { EventStatistics } from './../vo/event-statistics';
import { EventBean} from '../vo/event-bean';
import { DataBean} from '../vo/data-bean';
import { BinEnum } from '../bin-enum';
import { Observable } from 'rxjs/Rx';
import { HierarchyService } from './../hierarchy.service';
import { NodeTreeDatas } from './../node-tree-datas';
import { isIdentifier } from '@angular/compiler';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
declare var Highcharts: any;

@Component({
  selector: 'app-energy-breakdown',
  templateUrl: './energy-breakdown.component.html',
  providers: [HierarchyService]
})
export class EnergyBreakdownComponent extends BasePage implements OnInit {

  private newData: Array < any > = Array < any > ();
  energyCost: number;
  monthName: number;
  todaysDate: Date;
  instantPower: string = "-";
  instantPowerkW: string = "- kW";
  rootNodeName: string;

  totalPowerConsumption: string = "";
  airConName: string = "";
  appliances: string = "";
  lightingName: string = "";
  waterHeaterName: string = "";
  applianceName: string= "";
  floorPlanName: string = "";

  powerMeter: string = "1503554701131";
  bedroom1: string = "1505208462367";
  bedroom2: string = "1505208486644";
  livingRom: string = "1505208556279";

  lighting: number = 0;
  airCondition: number = 0;
  appliance: number = 0;
  totalConsumption: number = 0;
  waterHeater: number = 0;
  isFirst:  boolean = true;

  constructor(private _httpService: GkCommonServiceService, private _dataService: DataServiceService,
      private router: Router, private _translateService: TranslateService, private activatedROute: ActivatedRoute,
      private hierarchyService: HierarchyService) {
      super(_dataService, router, _translateService);
      this.validateSession();

  }

  ngOnInit() {
    if(sessionStorage.length == 0) {
        this.router.navigate(['./login']);
    } else {
      this.hierarchyService.allData$.asObservable()
          .filter(item => item != null)
          .subscribe(
              data => {
                  debugger
                  if (data instanceof Array && data.length == 0)
                      return;
                  this.newData.push(data);
                  for (let item of this.newData) {
                    if(this.floorPlanName == "") {
                        this.floorPlanName = item.nodeTreeDatas.name;
                    }
                    let nodes = item.nodeTreeDatas.nodes;
                    for (let node of nodes) {
                        if (node.nodeGroupTag == "Water Heater") {
                            this.waterHeaterName = node.name;
                        } else if (node.nodeGroupTag == "Lighting") {
                            this.lightingName = node.name;
                        } else if (node.nodeGroupTag == "AC") {
                            this.airConName = node.name;
                        } else if (node.nodeGroupTag == "Smart Plug") {
                            this.applianceName = node.name;
                        }
                    }
                }
                  if (this.newData[0].nodeTreeDatas.isRoot == 0) {
                      this.getInstantPower()
                          .subscribe(data => {
                              this.getEnergyBreakDown().subscribe(
                                  data => {
                                      this.createChartEnergyConsumption();
                                  }
                              );
                          });
                      this.getTotalEnergy();
                  }
                  console.log(data);
              });

      let now = new Date();
      this.monthName = now.getMonth() + 1;
      this.todaysDate = new Date();
    }
  }

  ngAfterViewInit() {
      // this.createCostChart();
  }

  getInstantPower(): Observable < any > {

      return this._httpService.getInstantaneousEvents(this.floorPlanName, 'Power', 'GetInstantPower')
          .map(data => {
              debugger
              if (data !== null && data !== undefined) {
                  if((data.statistics[0] as EventStatistics).lastValue !== -1) {
                    this.instantPower = ((data.statistics[0] as EventStatistics).lastValue / 1000).toFixed(2);
                    this.instantPowerkW = this.instantPower + " kW";
                  }
                  console.log("app-energy-breakdown :" + this.instantPower);
              }
          });
  }

  createCostChart() {
      Highcharts.chart('chartContainer', {
          chart: {
              type: 'bar'
          },
          title: {
              enabled: false,
              text: ''
          },
          subtitle: {
              enabled: false,
              text: ''
          },
          xAxis: {
              categories: ['lowest', 'you', 'average'],
              title: {
                  text: null
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Cost ($)',
                  align: 'high'
              },
              labels: {
                  overflow: 'justify'
              }
          },
          tooltip: {
              valueSuffix: ' $'
          },
          plotOptions: {
              bar: {
                  dataLabels: {
                      enabled: true
                  }
              }
          },
          legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'top',
              x: -40,
              y: 80,
              floating: true,
              borderWidth: 1,
              backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
              shadow: true
          },
          credits: {
              enabled: false
          },
          series: [{
              name: 'Year 1800',
              data: [29.81, 84.20, 54.33]
          }]
      });
  }
  getEnergyBreakDown(): Observable < any > {

      let nodeName = this.waterHeaterName + "," + this.lightingName + "," + this.airConName + "," + this.applianceName;
      let key = this._dataService.key;
      let now = new Date();
      return this._httpService.getInstantaneousEvents(nodeName, "Power", "GetInstantPower")
          .map(
              data => {
                  debugger
                  let statistics: EventStatistics[] = data.statistics;
                  if (statistics == null || statistics.length == 0) {
                      return null;
                  }
                  for (let item of statistics) {
                      if (item.ciName == this.airConName) {
                          this.airCondition = item.lastValue / 1000;
                      } else if (item.ciName == this.lightingName) {
                          this.lighting = item.lastValue / 1000;
                      } else if (item.ciName == this.applianceName) {
                          this.appliance = item.lastValue / 1000;
                      } else if (item.ciName == this.waterHeaterName) {
                          this.waterHeater = item.lastValue / 1000;
                      }
                  }

                  // debugger
                  // let eventBeans : EventBean [] = data.eventBean ;
                  // for(let item of eventBeans){

                  //     let dataBean : DataBean[] = item.dataBean ;
                  //     if(dataBean == null || dataBean.length == 0|| (typeof dataBean == "undefined") ){
                  //       continue ;
                  //     }
                  //     if(item.name == EnergyBreakdownComponent.airConPowerConsumption){
                  //       this.airCondition = Number(dataBean[0].value)/1000;
                  //     }
                  //     if(item.name == EnergyBreakdownComponent.lightingPowerConsumption){
                  //       this.lighting = Number(dataBean[0].value)/1000;
                  //     }
                  //     if(item.name == EnergyBreakdownComponent.appliances){
                  //       this.appliance = Number(dataBean[0].value)/1000;
                  //     }
                  //     if(item.name == EnergyBreakdownComponent.totalPowerConsumption){
                  //       this.totalConsumption = Number(dataBean[0].value)/1000;
                  //     }
                  // }
              }
          );
  }

  getTotalEnergy() {
      const nodeName = this.floorPlanName;
      let key = this._dataService.key;
      let date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      return this._httpService.getabsBinnedEvents(firstDay.getTime(), date.getTime(), BinEnum.MONTH, 'Cost', nodeName)
          .subscribe(
              data => {
                  debugger
                  let averageValue: number = 0;
                  let min: number = 0;
                  let value: number = 0;
                  let eventBeans: EventBean[] = data.eventBean;
                  let dataBean: DataBean = eventBeans[0].dataBean[0]
                  // for(let eventBean of eventBeans){
                  //   let dataBean = eventBean.dataBean[0] ;
                  //   averageValue  += Number(dataBean.averageValue) ;
                  //   min += Number(dataBean.min) ;
                  //   value += Number(dataBean.value) ;
                  // }
                  this.energyCost = dataBean.value;
              }
          );
  }

  createChartEnergyConsumption() {

      Highcharts.chart('chartContainer', {
          chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
          },
          title: {
              text: ''
          },

          tooltip: {
              pointFormat: '{series.name}: <b>{point.y:.2f}kW</b>'
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: false
                  },
                  showInLegend: true
              }
          },
          credits: {
              enabled: false
          },
          series: [{
              name: 'Usage',
              colorByPoint: true,
              data: [{
                  name: 'Air Conditioning',
                  y: Number(this.airCondition)
              }, {
                  name: 'Water Heater',
                  y: Number(this.waterHeater)
              }, {
                  name: 'Lighting',
                  y: Number(this.lighting),
                  sliced: true,
                  selected: true
              }, {
                  name: 'Appliances',
                  y: Number(this.appliance)
              }, {
                  name: 'Total',
                  y: Number(this.instantPower)
              }]
          }]
      });
  }
}