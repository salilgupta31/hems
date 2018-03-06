import { Component, OnInit } from '@angular/core';
import { HierarchyService } from './../../hierarchy.service';
import { NodeTreeDatas } from './../../node-tree-datas';
import { GkCommonServiceService } from '../../gk-common-service.service';
import { DataServiceService } from '../../data-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { Observable } from 'rxjs/Observable';
import { EventStatistics } from '../../vo/event-statistics';
import { EventBean } from '../../vo/event-bean';
import { DataBean } from '../../vo/data-bean';
import { BinEnum } from '../../bin-enum';
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Cookie } from 'ng2-cookies/src/services/cookie';

@Component({
    selector: 'app-add-edit-device',
    templateUrl: './add-edit-device.component.html',
    styleUrls: ['./add-edit-device.component.css'],
    providers: [HierarchyService]
})
export class AddEditDeviceComponent implements OnInit {

    //serverURL = 'http://nginx.greenkoncepts.com:8000';
    serverURL = 'https://nginx.greenkoncepts.com:9001';
    constructor(private _httpService: GkCommonServiceService, private _dataService: DataServiceService,
        private hierarchyService: HierarchyService, private router: Router,
        private http: Http) {
            this.http.get(this.serverURL + '/userParticipation/')
            .subscribe(
                data => {
                    // debugger;
                    console.log(data.json());
                    let participationData  = data.json();
                    for(let item of participationData) {
                        if(item.user == this.user) {
                            if(item.contractedPower) {
                                this.contractedPower = item.contractedPower.toFixed(2);
                            }
                            (<HTMLInputElement>document.getElementById("airCondition")).checked = item.airCon;
                            this.isAirCondition = item.airCon;
                            (<HTMLInputElement>document.getElementById("appliance")).checked = item.appliance;
                            this.isAppliance = item.appliance;
                            (<HTMLInputElement>document.getElementById("lighting")).checked = item.lighting;
                            this.isLighting = item.lighting;
                            (<HTMLInputElement>document.getElementById("waterHeater")).checked = item.waterHeater;
                            this.isWaterHeater = item.waterHeater;
                        }
                    }
                });
        }
      
    showMessagePopUp: boolean = false;
    user: string;
    credential: string;
    private newData: Array < any > = Array < any > ();
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
    instantPower: number = 0;
    contractedPower: string = "-";

    ngOnInit() {
        this.user = sessionStorage.getItem('username');
        this.credential = Cookie.get('credential');
        this.hierarchyService.allData$.asObservable()
            .filter(item => item != null)
            .subscribe(
                data => {
                    debugger
                    if (data instanceof Array && data.length == 0)
                        return;
                    this.newData.push(data);
                    for (let item of this.newData) {
                        if (this.floorPlanName == "") {
                            this.floorPlanName = item.nodeTreeDatas.name;
                        }
                        if (item.nodeTreeDatas.isRoot == '0') {
                            this.getInstantPower()
                                .subscribe(data => {
                                    this.getEnergyBreakDown().subscribe(
                                        data => {
                                    });
                                });
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
                    console.log(data);
                });
    }
    getInstantPower(): Observable < any > {

        return this._httpService.getInstantaneousEvents(this.floorPlanName, 'Power', 'GetInstantPower')
            .map(data => {
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
                    if(this.isAirCondition)
                        this.instantPower += this.airCondition;
                    if(this.isAppliance)
                        this.instantPower += this.appliance;
                    if(this.isLighting)
                        this.instantPower += this.lighting;
                    if(this.isWaterHeater)
                        this.instantPower += this.waterHeater;
                }
            );
    }

    changeParticipation(event) {
        console.log("Participation")
        debugger
        let nodeName = "";
        let target = event.target || event.srcElement || event.currentTarget;
        let idAttr = target.attributes.id;
        let value = idAttr.nodeValue;
        if(value == "airCondition") {
            nodeName = this.airConName;
        } else if(value == "appliance") {
            nodeName = this.applianceName;
        } else if(value == "lighting") {
            nodeName = this.lightingName;
        } else if(value == "waterHeater") {
            nodeName = this.waterHeaterName;
        }
        (<HTMLInputElement>document.getElementById(value)).disabled = true;
        let appliance = (<HTMLInputElement>document.getElementById("appliance")).checked;
        let airCon = (<HTMLInputElement>document.getElementById("airCondition")).checked;
        let lighting = (<HTMLInputElement>document.getElementById("lighting")).checked;
        let waterHeater = (<HTMLInputElement>document.getElementById("waterHeater")).checked;

        let body = 'user=' + this.user + "&floorPlan=" + this.floorPlanName + "&airConName=" + this.airConName + "&waterHeaterName=" + this.waterHeaterName + "&applianceName=" + this.applianceName + "&lightingName=" + this.lightingName  + "&airCon=" + airCon + "&appliance=" + appliance + "&waterHeater=" + waterHeater + "&lighting=" + lighting + '&callerID=callerID';
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        console.log(nodeName);
        let selectedDevice = document.getElementById(value);
        return this.http.post(this.serverURL + '/userParticipation/', body, { headers: headers })
        .subscribe(
            data => {
                (<HTMLInputElement>document.getElementById(value)).disabled = false;
                this.isLighting = (lighting)?true:false;
                this.isAppliance = (appliance)?true: false;
                this.isAirCondition = (airCon)?true:false;
                this.isWaterHeater = (waterHeater)?true : false;
                console.log(data.json());
            });
    }
}