import { Component, OnInit } from '@angular/core';
import { GkCommonServiceService } from '../../gk-common-service.service';
import { DataServiceService } from '../../data-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BasePage } from '../../common/base-page';
import { Observable } from 'rxjs/Rx';
import { EventStatistics } from '../../vo/event-statistics';
import { EventBean } from '../../vo/event-bean';
import { BinEnum } from '../../bin-enum';
import { DataBean } from '../../vo/data-bean';
import { HierarchyService } from './../../hierarchy.service';
import { NodeTreeDatas } from './../../node-tree-datas';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'app-add-devices',
    templateUrl: './add-devices.component.html',
    styleUrls: ['./add-devices.component.css'],
    providers: [HierarchyService]
})
export class AddDevicesComponent extends BasePage implements OnInit {

    private planName: Array < any > = Array < any > ();
    private newData: Array < any > = Array < any > ();
    private hierarchyData: Array < any > = Array < any > ();

    constructor(private _httpService: GkCommonServiceService, private _dataService: DataServiceService,
        private router: Router, private _translateService: TranslateService, private activatedROute: ActivatedRoute,
        private hierarchyService: HierarchyService
    ) {
        super(_dataService, router, _translateService);
        this.validateSession();
        if(sessionStorage.length == 0) {
            this.router.navigate(['./login']);
        } else {
        this.hierarchyService.allData$.asObservable()
            .filter(item => item != null)
            .subscribe(
                data => {
                    console.log(data);
                    if (data instanceof Array && data.length == 0)
                        return;
                    this.newData.push(data);
                    if(this.floorPlanName == ""){
                        this.floorPlanName = this.newData[0].nodeTreeDatas.name;
                        console.log("Floor Name");
                        console.log(this.floorPlanName);
                    }
                    let planName, plan = "";
                    if(!this.plan1 && !this.plan2 && !this.plan3) {
                        if(this.newData[0].nodeTreeDatas.title)
                        planName = this.newData[0].nodeTreeDatas.title.split("-").map((item) => item.trim());
                        plan = planName[0];
                        if (plan == "Plan 1") {
                            this.plan1 = true;
                        } else if (plan == "Plan 2") {
                            this.plan2 = true;
                        } else if (plan == "Plan 3") {
                            this.plan3 = true;
                        }
                        this.planLoaded = true;
                    }
                    this.planName = this.newData[0].nodeTreeDatas.title.split("-").map((item) => item.trim());
                    this.floorPlan = this.planName[0];
                    /**
                     * Read the hierarchy on page load
                     * to show devices for Master Bedroom by default.
                     */
                    //if(this.planLoaded) {
                        for (let item of this.newData) {
                            let temp = item.nodeTreeDatas as NodeTreeDatas;
                            let nodes = temp.nodes;
                            for (let node of nodes) {
                                if(document.getElementById(node.title) !== null) {
                                    if (node.hasChild == 0 && node.nodes.length == 0) {
                                        document.getElementById(node.title).setAttribute('src', './assets/images/circle-g.png');
                                    } else {
                                        document.getElementById(node.title).setAttribute('src', './assets/images/circle4.png');
                                    }
                                }
                            }
                        }
                   // }
                    // let planName, plan = "";
                    // if(!this.plan1 && !this.plan2 && !this.plan3) {
                    //     if(this.newData[0].nodeTreeDatas.title)
                    //     planName = this.newData[0].nodeTreeDatas.title.split("-").map((item) => item.trim());
                    //     plan = planName[0];
                    //     if (plan == "Plan 1") {
                    //         this.plan1 = true;
                    //     } else if (plan == "Plan 2") {
                    //         this.plan2 = true;
                    //     } else if (plan == "Plan 3") {
                    //         this.plan3 = true;
                    //     }
                    //     this.planLoaded = true;
                    // }
                    // this.planName = this.newData[0].nodeTreeDatas.title.split("-").map((item) => item.trim());
                    // this.floorPlan = this.planName[0];
                    this.selectNode(this.newData, false);
                    this.getEntireUnitUsage();
                },
                err => {
                    this.showMessagePopUp = true;
                });
            }
    }

    showMessagePopUp: boolean = false;
    isDisabled: boolean = false;
    floorPlan: string = "";
    plan1: boolean = false;
    plan2: boolean = false;
    plan3: boolean = false;
    floorPlanName: string = "";
    airConditionLabel: string = "";
    airConditionData: string = "";
    applianceLabel: string = "";
    applianceData: string = "";
    lightingSwitchData: Array < any > = Array < any > ();
    lightingSwitchControlData: Array < any > = Array < any > ();
    hasDevice: boolean = false;
    planLoaded: boolean = false;

    roomName: string = "";
    entireUnitUsage: number = 0;

    ngOnInit() {

    }
    /**
     * Function called on page load and whenever user clicks on the rooms in a given floor plan.
     * Iterates through the main hierarchy dynamically and stores sub hierarchy in an array.  
     * @param event - click event
     * @param isClick - true if function called on clicking of rooms else false.
     */
    selectNode(event, isClick) {
        if (isClick) {
            var target = event.target || event.srcElement || event.currentTarget;

            if (target.src.lastIndexOf("circle-g.png") !== -1)
                this.isDisabled = true;
            else
                this.isDisabled = false;
            var idAttr = target.attributes.id;
            var value = idAttr.nodeValue;
        }
        debugger
        if (!this.isDisabled) {
            if(value == '' || value == undefined){
                if(this.floorPlan == 'Plan 1' ||this.floorPlan == 'Plan 2')
                    value = "Bedroom 2";
                else if(this.floorPlan == 'Plan 3')
                    value = "Master Bedroom";
            }
            let parentId;
            this.hierarchyData = [];
            for (let item of this.newData) {
                if (item instanceof Array) {
                    if (item.length == 0)
                        continue;
                }
                let temp = item.nodeTreeDatas as NodeTreeDatas;
                if (temp.title == value || parentId == item.nodeTreeDatas.parentId) {
                    let nodes = temp.nodes;
                    for (let node of nodes) {
                        if (node.hasChild > 0 && temp.id == node.parentId) {
                            parentId = node.parentId;
                        }
                        this.hierarchyData.push(node);
                    }
                }
            }
            this.displayDevices(value);
        }
    }
    /**
     * Function to display devices associated with the selected room.
     * @param value - Room name
     */
    displayDevices(value) {
        debugger
        let lightingSwitch = false,
            appliance = false,
            aircon = false;
        //this.lightingSwitchData = [];
        this.lightingSwitchControlData = [];
        for (let checkControl of this.hierarchyData) {
            this.roomName = value;
            // if (checkControl.nodeGroup == "Appliance" && checkControl.nodeGroupTag == 'Lighting Switch') {
            //     this.lightingSwitchData.push(checkControl);
            // }
            if (checkControl.nodeGroup == "Control") {
                if (checkControl.nodeGroupTag == 'Lighting Switch') {
                    lightingSwitch = true;
                    this.lightingSwitchControlData.push(checkControl);
                } else if (checkControl.nodeGroupTag == "AC") {
                    aircon = true;
                    this.airConditionData = checkControl.name;
                    this.airConditionLabel = checkControl.title;
                } else if (checkControl.nodeGroupTag == "Smart Plug") {
                    appliance = true;
                    this.applianceData = checkControl.name;
                    this.applianceLabel = checkControl.title;
                }
            }
        }
        if (!appliance) {
            document.getElementById("appliance").hidden = true;
        } else {
            document.getElementById("appliance").hidden = false;
            this.getControlNodes(this.applianceData);
        }
        if (!aircon) {
            document.getElementById("li-column-bed3").hidden = true;
        } else {
            document.getElementById("li-column-bed3").hidden = false;
            this.getControlNodes(this.airConditionData);
        }
        if (this.lightingSwitchControlData.length > 0) {
            this.getControlNodes(this.lightingSwitchControlData);
        }
        if(appliance || aircon || this.lightingSwitchControlData.length > 0) {
            this.hasDevice = true;
        }
    }

    getDataForBedRoom1(): Observable < EventStatistics[] > {
        const appliance = "1503555011157";
        const lightingConsumption = "1503555037394";

        let applianceMap = this._httpService.getInstantaneousEvents(appliance, 'Power', 'GetInstantPower')
            .map(
                data => {

                    return (data.statistics[0] as EventStatistics);
                }
            );
        let lightingConsumptionMap = this._httpService.getInstantaneousEvents(lightingConsumption, 'Power', 'GetInstantPower')
            .map(
                data => {

                    return (data.statistics[0] as EventStatistics);
                }
            );
        return Observable.forkJoin(
            [lightingConsumptionMap, applianceMap]
        ).map(data => {
            return data;
        });
    }

    // getEntireUnitUsage(){
    //   const nodeName = AddDevicesComponent.appliances +","+ AddDevicesComponent.airConPowerConsumption
    //   +","+ AddDevicesComponent.totalPowerConsumption  +","+ AddDevicesComponent.lightingPowerConsumption ;
    //   let key = this._dataService.key ;
    //   let now  = new Date();
    //   var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    //   return this._httpService.getBinnedEvents(firstDay.getTime(), now.getTime(), BinEnum.MONTH, 'Energy', nodeName)
    //   .subscribe(
    //     data => {
    //       let eventBeans : EventBean [] = data.eventBean ;
    //       for(let item of eventBeans){

    //           let dataBean : DataBean[] = item.dataBean ;
    //           if(dataBean == null || dataBean.length == 0|| (typeof dataBean == "undefined") ){
    //             continue ;
    //           }

    //           if(item.name == AddDevicesComponent.totalPowerConsumption){
    //             this.entireUnitUsage = Number((Number(dataBean[0].value)/1000).toFixed(2));
    //           }
    //       }

    //     }
    //   );
    // }

    getEntireUnitUsage() {
        this._httpService.getInstantaneousEvents(this.floorPlanName, 'Power', 'GetInstantPower')
            .subscribe(data => {
                if (data !== null && data !== undefined) {
                    this.entireUnitUsage = (data.statistics[0] as EventStatistics).lastValue / 1000;
                }
            },
            err => {
                this.showMessagePopUp = true;
            });
    }
    /**
     * Function to change status of the devices.
     * @param event 
     * @param device To check if device is Light Switch, Air Con or Smart Plug 
     */
    handleDeviceStatus(event, device) {
        debugger
        let target = event.target || event.srcElement || event.currentTarget;
        let idAttr = target.attributes.id;
        let value = idAttr.nodeValue;
        let selectedDevice = document.getElementById(value);
        let command = "";
        if (device == "appliance" || device == "aircon" || device == "lightSwitch") {
            if (selectedDevice.getAttribute('src').indexOf("toggle on") == -1) {
                command = 'Relay Status=' + 1 + ';Analog Output=' + 100;
                this._httpService.controlNode(value, command)
                    .subscribe(
                        data => {
                            selectedDevice.setAttribute('src', './assets/images/toggle on.jpg');
                        },
                        err => {
                            this.showMessagePopUp = true;
                        });
            } else {
                command = 'Relay Status=' + 0 + ';Analog Output=' + 0;
                this._httpService.controlNode(value, command)
                    .subscribe(
                        data => {
                            selectedDevice.setAttribute('src', './assets/images/toggle off.jpg');
                        },
                        err => {
                            this.showMessagePopUp = true;
                        });
            }
        } else if (device == 'increase') {
            let temperature = Number(document.getElementById("temperature").innerHTML);
            if(temperature > 26) {
                console.log("Max temperature");
            } else {
                command = 'Relay Status=' + 1 + ';Analog Output=' + 100;
                this._httpService.controlNode(value, command)
                    .subscribe(
                        data => {
                            temperature = +"" + Number(document.getElementById("temperature").innerHTML) + 1;
                            document.getElementById("temperature").innerHTML = temperature + "";
                            selectedDevice.setAttribute('src', './assets/images/toggle on.jpg');
                        },
                        err => {
                            this.showMessagePopUp = true;
                        });
            }
        } else if (device == 'decrease') {
            let temperature = Number(document.getElementById("temperature").innerHTML);
            if(temperature < 19) {
                console.log("Min temperature");
            } else {
            command = 'Relay Status=' + 1 + ';Analog Output=' + 100;
            this._httpService.controlNode(value, command)
                .subscribe(
                    data => {
                        temperature = +"" + Number(document.getElementById("temperature").innerHTML) - 1;
                        document.getElementById("temperature").innerHTML = temperature + "";
                        selectedDevice.setAttribute('src', './assets/images/toggle on.jpg');
                    },
                    err => {
                        this.showMessagePopUp = true;
                    });
            }
        }
    }

    /**
     * Function to load the current status of the devices.
     * @param deviceData data associated with the device
     */
    getControlNodes(deviceData) {
        let now = new Date();
        now.setMinutes(0);
        now.setSeconds(0);
        now.setHours(now.getHours());
        let beginTime = new Date();
        beginTime.setHours(now.getHours());
        beginTime.setMinutes(0);
        beginTime.setSeconds(0);
        debugger
        if (deviceData instanceof Array) {
            for(let node of deviceData){
                this._httpService.getBinnedEvents(beginTime.getTime(), now.getTime(), BinEnum.HOUR, "Relay Status", node.name)
                    .subscribe(
                        data => {
                            let currentValue: number = (data.statistics[0] as EventStatistics).current;
                            if (currentValue == 1) {
                                document.getElementById(node.name).setAttribute('src', './assets/images/toggle on.jpg');
                            } else if (currentValue == 0) {
                                document.getElementById(node.name).setAttribute('src', './assets/images/toggle off.jpg');
                            }
                        },
                        err => {
                            this.showMessagePopUp = true;
                        });
            }
        } else {
            this._httpService.getBinnedEvents(beginTime.getTime(), now.getTime(), BinEnum.HOUR, "Relay Status", deviceData)
                .subscribe(
                    data => {
                        let currentValue: number = (data.statistics[0] as EventStatistics).current;
                        if (currentValue == 1) {
                            document.getElementById(deviceData).setAttribute('src', './assets/images/toggle on.jpg');
                        } else if (currentValue == 0) {
                            document.getElementById(deviceData).setAttribute('src', './assets/images/toggle off.jpg');
                        }
                    },
                    err => {
                        this.showMessagePopUp = true;
                    });
        }
    }

    messageBox(){
        this.showMessagePopUp = false;
    }
}