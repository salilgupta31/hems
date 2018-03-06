import { TranslateService } from 'ng2-translate/src/translate.service';
import { BasePage } from '../common/base-page';
import { DataServiceService } from '../data-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GkCommonServiceService } from '../gk-common-service.service';
import { Component, OnInit } from '@angular/core';
import { FormatUtil } from './../utils/format-utils';
import { EventStatistics } from './../vo/event-statistics';
import { BinEnum } from '../bin-enum';
import { EventBean } from '../vo/event-bean';
import { EnergyMonth } from '../energy-month';
import { Observable } from 'rxjs/Rx';
import { DataBean } from '../vo/data-bean';
import { ViewChild,ElementRef } from '@angular/core';
import { TimeRangeUtil }  from '../utils/time-range-util';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Renderer } from '@angular/core';
import { debug } from 'util';
import { HierarchyService } from './../hierarchy.service';
import { NodeTreeDatas } from './../node-tree-datas';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var Highcharts: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    providers: [HierarchyService]
})
export class DashboardComponent extends BasePage implements OnInit {

    user: string;
    credential: string;
    userName: string;
    greetingText: string;
    temperatureText: string;
    windText: string;
    monthName: number;
    instantPower: string = "- kW";
    rootNodeName: string;
    payingMore: number;
    payingMorePercentage: number;
    floorPlanName: string = "";
    private newData: Array < any > = Array < any > ();    
    taffric = 0.5;
    energyCost: number;

    date = new Date();

    binNum = 1;
    barChartLabels: string[] = [];
    @ViewChild('Package11') Package11: ElementRef;
    @ViewChild('Package12') Package12: ElementRef;
    @ViewChild('Package13') Package13: ElementRef;
    @ViewChild('Package21') Package21: ElementRef;
    @ViewChild('Package22') Package22: ElementRef;
    @ViewChild('Package23') Package23: ElementRef;
    //selectedPackage : string;
    //packageName: string;
    package1Id: number;
    package2Id: number;
    package3Id: number;
    oldPackageId: string;
    currentPackageId: string;
    packageIndex: number;
    isPackageActive: boolean;

    isPackage1Active: boolean;
    isPackage2Active: boolean;
    isPackage3Active: boolean;

    peakRateP1: string = "--";
    offPeakRateP1: string = "--";
    peakRateP2: string = "--";
    offPeakRateP2: string = "--";
    peakRateP3: string = "--";
    offPeakRateP3: string = "--";
    tariffData: object;
    assingedRates: object;
    prevTariffData: object;
    prevAssingedRates: object;
    numberOfBills: string;
    showPopUp: boolean = false;

    energyMonth: EnergyMonth = new EnergyMonth();
    powerMeterData: number[] = Array < number > ();
    
    powerMeterDataByToday: number[] = Array < number > ();
    bedroom1DataByToday: number[] = Array < number > ();
    bedroom2DataByToday: number[] = Array < number > ();
    livingRomDataByToday: number[] = Array < number > ();

    powerMeterDataByYear: number[] = Array < number > ();
    bedroom1DataByYear: number[] = Array < number > ();
    bedroom2DataByYear: number[] = Array < number > ();
    livingRomDataByYear: number[] = Array < number > ();
    showMessagePopUp: boolean = false;

    constructor(private _httpService: GkCommonServiceService, private _dataService: DataServiceService,
        private router: Router, private _translateService: TranslateService, private activatedROute: ActivatedRoute, private renderer: Renderer,
        private hierarchyService: HierarchyService) {
        super(_dataService, router, _translateService);
        this.validateSession();

        this.userName = FormatUtil.checkString((_dataService.userVO && _dataService.userVO.firstName) || "") + ' ' + FormatUtil.checkString((_dataService.userVO && _dataService.userVO.lastName) || "");
        this.greetingText = FormatUtil.greetingText();

        this.getWeatherData();

        this.getTariffs("Electric");
        
    }
    ngOnInit() {
        if(sessionStorage.length == 0) {
            this.router.navigate(['./login']);
        } else {
        this.user = Cookie.get('username');
        this.credential = Cookie.get('credential');
        const timeRangObj = TimeRangeUtil.getTimeRangeObject(this.binNum);
        this.barChartLabels = timeRangObj.labels;
        this.monthName = new Date().getMonth() + 1;
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
                    if (this.newData[0].nodeTreeDatas.isRoot == 0) {
                        this.getEnergyByMonth().subscribe(
                            data => {
                                this.createCostChart();
                            }
                        );
                        this.getTotalEnergy();
                        this.getEnergyByWeek().subscribe(
                            data => {
                                debugger
                                this.createConsumptionChart();
                            });
                    }
                    this.getNodes();
                }
                console.log(data);
            },
            err => {
                this.showMessagePopUp = true;
            });
        }
    }


    changeSuggestionText(temp) {
        if (temp > 25) {

        } else {
            // $('#weatherSuggestionText').text("Right now, it’s cool enough to skip the air conditioning and use a fan.");
        }

    };

    getInstantPower() {
        this._httpService.getInstantaneousEvents(this.floorPlanName, 'Power', 'GetInstantPower')
            .subscribe(data => {
                debugger
                if (data !== null && data !== undefined) {
                    if((data.statistics[0] as EventStatistics).lastValue !== -1)
                        this.instantPower = ((data.statistics[0] as EventStatistics).lastValue / 1000).toFixed(2) + " kW";
                }
            },
            err => {
                this.showMessagePopUp = true;
            });
    }


    getWeatherData() {
        this._httpService.getWeatherData()
            .subscribe(
                data => {
                    if (data !== null && data !== undefined) {
                        let info = data.query.results.channel;

                        this.temperatureText = info.item.condition.temp;
                        this.windText = info.wind.speed;

                    } else {

                    }
                },
                err => {
                    this.showMessagePopUp = true;
                });
    }


    getNodes() {
        this._httpService.getNodesData()
            .subscribe(
                data => {
                    if (data !== null && data !== undefined) {
                        this.rootNodeName = data.nodeTreeDatas.name;
                        this.getInstantPower();

                    } else {

                    }
                },
                err => {
                    this.showMessagePopUp = true;
                });
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
        for (let i = 0; i < currentDay; i++) {
            this.barChartLabels[i] = categories[i]; 
            if (typeof this.powerMeterData[i] === "undefined") {
                this.powerMeterData[i] = 0.00;
            }

        }
        console.log("week :" + this.powerMeterData);
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
                // plotBands: [{ // visualize the weekend
                //     from: 4.5,
                //     to: 6.5,
                //     color: 'rgba(68, 170, 213, .2)'
                // }]
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
                    return "$ " + this.y;
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
                data: this.powerMeterData
            }]
        });

    }

    createCostChart() {
        console.log("this.energyMonth.min : " + this.energyMonth.min);
        Highcharts.chart('constContainer', {
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
                    text: ""
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
                valueSuffix: '$',
                formatter: function() {
                    return "$" + this.y
                }

            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                name: new Date().getMonth(),
                data: [
                    Number(this.energyMonth.min.toFixed(2)), Number(this.energyMonth.value.toFixed(2)), Number(this.energyMonth.averageValue.toFixed(2))
                ]
            }]
        });
    }

    ngAfterViewInit() {

    }

    

    getEnergyByMonth(): Observable < EnergyMonth > {

        const nodeName = this.floorPlanName;
        let key = this._dataService.key;
        let firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
        let lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

        console.log("getEnergyByMonth firstDay :" + firstDay);
        console.log("getEnergyByMonth lastDay :" + lastDay);


        return this._httpService.getAllLocationTypeData(firstDay.getTime(), lastDay.getTime(), 'Cost', BinEnum.MONTH).map(
            data => {
                debugger
                let averageValue: number = 0;
                let min: number;
                let value: number = 0;
                let total = 0;
                let nodeValue = "";
                let eventBeans = data.result;
                for(let item of eventBeans){
                    if(nodeName == item.eventBean[0].name) {
                        nodeValue = item.eventBean[0].dataBean[0].value;
                    }
                    value = Number(item.eventBean[0].dataBean[0].value);
                    total += value;
                    if(value != 0)
                        min = value;
                    if(min > value && value != 0)
                        min = value;
                }
                this.energyMonth.min = min;
                this.energyMonth.averageValue = Number(total)/12;
                this.energyMonth.value = Number(nodeValue);
                console.log("CostComparisonData Minimum", Number(this.energyMonth.min.toFixed(2)));
                console.log("CostComparisonData Value", Number(this.energyMonth.value.toFixed(2)));
                console.log("CostComparisonData Avg Value", Number(this.energyMonth.averageValue.toFixed(2)));
                return this.energyMonth;
            },
            err => {
                this.showMessagePopUp = true;
            }
        );
    }
    getEnergyByDay(): Observable < any > {
        this.powerMeterDataByToday = [];
        const nodeName = this.floorPlanName;
        let key = this._dataService.key;
        let now = new Date();
        now.setMinutes(0);
        now.setSeconds(0);
        now.setHours(now.getHours());
        let beginTime = new Date();
        beginTime.setHours(0);
        beginTime.setMinutes(0);
        beginTime.setSeconds(0);



        return this._httpService.getBinnedEvents(beginTime.getTime(), now.getTime(), BinEnum.HOUR, 'Cost', nodeName)
            .map(
                data => {

                    let eventBeans: EventBean[] = data.eventBean;
                    for (let item of eventBeans) {
                        let dataBean: DataBean[] = item.dataBean;
                        if (dataBean == null || dataBean.length == 0) {
                            continue;
                        }
                        if (item.name === this.floorPlanName) {
                            this.powerMeterDataByToday.push(Number(Number(dataBean[0].value).toFixed(2)));
                        }

                    }
                },
                err => {
                    this.showMessagePopUp = true;
                }
            );


    }

    getEnergyByWeek(): Observable < any > {
        const nodeName = this.floorPlanName;
        let key = this._dataService.key;
        this.powerMeterData = [];

        let firstday = new Date();
        let day = firstday.getDay();
        let diff = firstday.getDate() - day + (day == 0 ? -6 : 1);
        firstday = new Date(firstday.setDate(diff));
        firstday.setHours(0);
        firstday.setMinutes(0);
        firstday.setSeconds(0);

        let lastDay = new Date();

        debugger

        return this._httpService.getabsBinnedEvents(firstday.getTime(), lastDay.getTime(), BinEnum.DAY, 'Cost', nodeName)
            .map(
                data => {
                    debugger
                    let eventBeans: EventBean[] = data.eventBean;
                    for (let item of eventBeans) {
                        let dataBean: DataBean[] = item.dataBean;
                        if (dataBean == null || dataBean.length == 0) {
                            continue;
                        }
                        if (item.name === this.floorPlanName) {
                            this.powerMeterData.push(Number(Number(dataBean[0].value).toFixed(2)));
                        }

                    }
                },
                err => {
                    this.showMessagePopUp = true;
                }
            );
    }

    getEnergyByYear(): Observable < any > {
        this.powerMeterDataByYear = [];
        const nodeName = this.floorPlanName;
        let key = this._dataService.key;
        let now = new Date();
        let firstDayOfYear = new Date();
        firstDayOfYear.setMonth(now.getMonth());
        firstDayOfYear.setDate(1);
        firstDayOfYear.setHours(0);
        firstDayOfYear.setMinutes(0);

        debugger

        return this._httpService.getabsBinnedEvents(firstDayOfYear.getTime(), now.getTime(), BinEnum.MONTH, 'Cost', nodeName)
            .map(
                data => {
                    let eventBeans: EventBean[] = data.eventBean;
                    for (let item of eventBeans) {
                        let dataBean: DataBean[] = item.dataBean;
                        if (dataBean == null || dataBean.length == 0) {
                            continue;
                        }
                        if (item.name === this.floorPlanName) {
                            this.powerMeterDataByYear.push(Number(Number(dataBean[0].value).toFixed(2)));
                        }
                    }
                },
                err => {
                    this.showMessagePopUp = true;
                }
            );


    }
    onChange(value) {
        if (value == "today") {
            this.binNum = 1;
            this.getEnergyByDay().subscribe(
                data => {
                    this.createConsumptionChartByToday();
                },
                err => {
                    this.showMessagePopUp = true;
                }
            );
        } else if (value == "week") {
            debugger
            this.getEnergyByWeek().subscribe(
                data => {
                    debugger
                    this.createConsumptionChart();
                },
                err => {
                    this.showMessagePopUp = true;
                }
            );

        } else if (value = "year") {
            this.binNum = 3;
            this.getEnergyByYear().subscribe(
                data => {
                    this.createConsumptionChartByYear();
                },
                err => {
                    this.showMessagePopUp = true;
                }
            );
        }


    }



    createConsumptionChartByToday() {
        this.createChartLabels();

        this.powerMeterDataByToday.reverse();
        for (let i = 0; i < this.barChartLabels.length; i++) {
            if (typeof this.powerMeterDataByToday[i] === "undefined") {
                this.powerMeterDataByToday.push(0.00);
            }
        }            
        
        this.powerMeterDataByToday.reverse();
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
                    return "$ " + this.y;
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
                data: this.powerMeterDataByToday
            }]
        });

    }

    createConsumptionChartByYear() {
        this.createChartLabels();
        this.powerMeterDataByYear.reverse();
        for (let i = 0; i < this.barChartLabels.length; i++) {
            if (typeof this.powerMeterDataByYear[i] === "undefined") {
                this.powerMeterDataByYear.push(0.00);
            }
        }
        this.powerMeterDataByYear.reverse();

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
                // plotBands: [{ // visualize the weekend
                //     from: 4.5,
                //     to: 6.5,
                //     color: 'rgba(68, 170, 213, .2)'
                // }]
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
                    return "$ " + this.y;
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
                data: this.powerMeterDataByYear
            }]
        });

    }


    createChartLabels() {

        const timeRangObj = TimeRangeUtil.getTimeRangeObject(this.binNum);
        this.barChartLabels = timeRangObj.labels;

        console.log("number bar chart : " + this.barChartLabels);
    }
    getTotalEnergy() {

        const nodeName = this.floorPlanName;

        let key = this._dataService.key;
        var firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);

        var lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
        console.log("getTotalEnergy firstDay :" + firstDay);
        console.log("getTotalEnergy lastDay :" + lastDay);

        return this._httpService.getabsBinnedEvents(firstDay.getTime(), lastDay.getTime(), BinEnum.MONTH, 'Cost', nodeName)
            .subscribe(
                data => {
                    debugger
                    let averageValue: number = 0;
                    let min: number = 0;
                    let value: number = 0;
                    let eventBeans: EventBean[] = data.eventBean;
                    let dataBean: DataBean = eventBeans[0].dataBean[0];
                    this.energyCost = dataBean.value;
                },
                err => {
                    this.showMessagePopUp = true;
                }
            );
    }
    /**
     * Function to send request to the server, if User changes the package.
     * Task #908 : Implement UI to support ToU
     * @param checkInput Boolean value: True if User clicks on "Ok" button else False
     */
    changeStatus(checkInput){
        var value;
        if(checkInput) {
          //value = this.selectedPackage;
          this.Package11.nativeElement.setAttribute('style', "");
          this.Package12.nativeElement.setAttribute('style', "");
          this.Package21.nativeElement.setAttribute('style', "");
          this.Package22.nativeElement.setAttribute('style', "");
          this.Package13.nativeElement.setAttribute('style', "");
          this.Package23.nativeElement.setAttribute('style', "");
          if (this.packageIndex == 1) {
              this.Package11.nativeElement.setAttribute('style', "background-color: rgba(0, 0, 0, 0.09);");
              this.Package21.nativeElement.setAttribute('style', "background-color: rgba(0, 0, 0, 0.09);");
          } else if (this.packageIndex == 2) {
              this.Package12.nativeElement.setAttribute('style', "background-color: rgba(0, 0, 0, 0.09);");
              this.Package22.nativeElement.setAttribute('style', "background-color: rgba(0, 0, 0, 0.09);");
          } else if (this.packageIndex == 3) {
              this.Package13.nativeElement.setAttribute('style', "background-color: rgba(0, 0, 0, 0.09);");
              this.Package23.nativeElement.setAttribute('style', "background-color: rgba(0, 0, 0, 0.09);");
          }
          if(this.oldPackageId == undefined || this.oldPackageId == "")
            this.oldPackageId = this.currentPackageId;
          this._httpService.getBill(this.user, this.oldPackageId).subscribe(
            prevBillData => {
                //prevBillData.bill.name = value;
                prevBillData.bill.status = "In Active";
                let billGroups = prevBillData.groups;
                for(let item of billGroups){
                    prevBillData.bill.groupId = item.GID;
                    prevBillData.bill.groupOfBillID = item.GID;
                }
                this.prevTariffData = prevBillData.bill;
                let rates = prevBillData.rates;
                for(let rate of rates){
                    rate.active = 0;
                }
                this.prevAssingedRates = prevBillData.rates;
                this._httpService.updateBill(this.prevTariffData, this.prevAssingedRates).subscribe(
                    data => {
                        console.log("Update Billing" + JSON.stringify(data));
                        this.oldPackageId = this.currentPackageId;
                        this._httpService.getBill(this.user, this.currentPackageId).subscribe(
                            billData => {
                                //billData.bill.name = value;
                                billData.bill.status = "Active";
                                billData.bill.groupId = billData.groups[0].GID;
                                billData.bill.groupOfBillID = billData.groups[0].GID;
                                this.tariffData = billData.bill;
                                let rates = billData.rates;
                                for(let rate of rates){
                                    rate.active = 1;
                                }
                                this.assingedRates = billData.rates;
                                this._httpService.updateBill(this.tariffData, this.assingedRates).subscribe(
                                    data => {
                                        console.log("Update Billing" + JSON.stringify(data));
                                    },
                                    err => {
                                        this.showMessagePopUp = true;
                                    }
                                );
                            },
                            err => {
                                this.showMessagePopUp = true;
                            });
                    },
                    err => {
                        this.showMessagePopUp = true;
                    }
                );
            },
            err => {
                this.showMessagePopUp = true;
            });
        //this.packageName = value;
          
            } else {
                /* If User clicks on Cancel button,
                   reset the selection and assign previous package Id */
                if(this.currentPackageId)
                    (<HTMLInputElement>document.getElementById(this.currentPackageId)).checked = false;
                if(this.oldPackageId)
                    (<HTMLInputElement>document.getElementById(this.oldPackageId)).checked = true;
                this.currentPackageId = this.oldPackageId;
                this.isPackageActive = false;
            }
           this.showPopUp=false;
      }
    /**
     * Completed
     */

    /**
     * Function to change background color of the selected tariff package on click of radio button.
     * Task #908 : Implement UI to support ToU
     * @param event Click event
     * @param value Bill details and rates associated with selected package
     * @param index Index of the selected package
     */
    highlightSelectedPackage(event, index) {
        debugger
        this.showPopUp = true;
        var target = event.target || event.srcElement || event.currentTarget;
        var idAttr = target.attributes.id;
        /* ID, Name, Status and Index of selected package respectively */
        this.currentPackageId = idAttr.nodeValue;
        //this.selectedPackage = value.name;
        //this.isPackageActive = value.active;
        this.packageIndex = index;
    }
    /**
     * Completed
     */

    /**
     * Function to get the tariff rates and set the selected tariff package by default.
     * Task #908 : Implement UI to support ToU
     * @param value 
     */
    getTariffs(value) {
        this._httpService.getAvailableBills(value).subscribe(
            data => {
                console.log("Available Bills");
                console.log(data);

                if (data !== null && data !== undefined) {
                    this.numberOfBills = data.bills;
                    let count = 0;
                    for (let bill of data.bills) {
                        count++;
                        //debugger
                        //bill.name = "Package " + count;
                        /* Highlight and select the active package by default on page load. */
                        let rate = bill.rates;
                        for(let item of rate) {
                            if (bill.name == "Package 1") {
                                this.package1Id = bill.id;
                                if(bill.active) {
                                    this.oldPackageId = bill.id;
                                    this.isPackage1Active = true;
                                    this.Package11.nativeElement.setAttribute('style', "width:20%;background-color: rgba(0, 0, 0, 0.09);");
                                    this.Package21.nativeElement.setAttribute('style', "width:20%;background-color: rgba(0, 0, 0, 0.09);");
                                }
                                if(item.name == "Peak")
                                    this.peakRateP1 = "$"+item.rate.toFixed(4)+"/kWh";
                                if(item.name == "Off-Peak")
                                    this.offPeakRateP1 = "$" + item.rate.toFixed(4)+"/kWh";
                            } else if (bill.name == "Package 2") {
                                this.package2Id = bill.id;
                                if(bill.active) {
                                    this.oldPackageId = bill.id;
                                    this.isPackage2Active = true;
                                    this.Package12.nativeElement.setAttribute('style', "width:20%;background-color: rgba(0, 0, 0, 0.09);");
                                    this.Package22.nativeElement.setAttribute('style', "width:20%;background-color: rgba(0, 0, 0, 0.09);");
                                }
                                if(item.name == "Peak")
                                    this.peakRateP2 = "$" + item.rate.toFixed(4)+"/kWh";
                                if(item.name == "Off-Peak")
                                    this.offPeakRateP2 = "$" + item.rate.toFixed(4)+"/kWh";
                            } else if (bill.name == "Package 3") {
                                this.package3Id = bill.id;
                                if(bill.active){
                                    this.oldPackageId = bill.id;
                                    this.isPackage3Active = true;
                                    this.Package13.nativeElement.setAttribute('style', "width:20%;background-color: rgba(0, 0, 0, 0.09);");
                                    this.Package23.nativeElement.setAttribute('style', "width:20%;background-color: rgba(0, 0, 0, 0.09);");
                                }
                                if(item.name == "Peak")
                                    this.peakRateP3 = "$" + item.rate.toFixed(4)+"/kWh";
                                if(item.name == "Off-Peak") 
                                    this.offPeakRateP3 = "$" + item.rate.toFixed(4)+"/kWh";
                            }
                        }
                        bill.name = "Package " + count;
                        //console.log(dataName);
                    }
                }
            },
            err => {
                this.showMessagePopUp = true;
            });
    }
    /**
     * Completed
     */
    messageBox(){
        this.showMessagePopUp = false;
    }
}