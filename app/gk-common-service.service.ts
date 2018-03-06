import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { DataServiceService } from './data-service.service';

import 'rxjs/Rx';


@Injectable()
export class GkCommonServiceService {
  key: string;
  env: string = 'test';
  serverURL: string = 'https://kem.greenkoncepts.com/';
  cityName = "Singapore";
  u = 'c';
  countryCode = "sg";
  cacheBuster = Math.floor((new Date().getTime()) / 1200 / 1000);
  query:string = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + this.cityName + ',' + this.countryCode + '") AND u="' + this.u + '"';
  
  weatherAPIURL = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(this.query) + '&format=json&_nocache=' + this.cacheBuster;


  constructor(private _http: Http,
    private router: Router,
    private dataService: DataServiceService) {

    this.dataService.env.subscribe(mode => {
      this.env = mode;
    })

  }

  getWeatherData()
  {
    return this._http.get(this.weatherAPIURL)
      .map((res) => res.json());
  }

  getSiteVerify(resonse: string) {
    // let body = { 'secret':'6Lfi6h4UAAAAAB7PKumwftpug9tG-ikbIun4xgTT', 'response':resonse};
    // let bodyString = JSON.stringify(body);

    // let headers = new Headers({ 'Content-Type': 'application/json' });

    // headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');

    // let options = new RequestOptions({ headers: headers });

    return this._http.get(this.serverURL + 'ems/services/ResourceService/recaptcha?response=' + resonse)
      .map((res) => res.json());
  }

  getLogin(username: string, credential: string) {

    var params = "username=iec&credential=greenkoncepts&callerID=callerID";
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this._http.get(this.serverURL + 'ems/services/ResourceService/login?username=' + username + '&credential=' + credential + '&callerID=callerID')
      .map(res => this.checkForSessionEnd(res));

  }

  getNodes() {

    return this._http.get(this.serverURL + 'ems/services/ResourceService/nodes?key=' + this.dataService.key + '&callerID=callerID')
      .map(res => this.checkForSessionEnd(res));
  }

  getNodesData() {

    return this._http.get(this.serverURL + 'ems/services/ResourceService/get-nodes-data?key=' + this.dataService.key + '&id=0&account=&callerID=callerID')
      .map(res => this.checkForSessionEnd(res));
  }

  getConfigurationByUser() {


    return this._http.get(this.serverURL + 'ems/services/ResourceService/getConfigurationByUser?key=' + this.dataService.key + '&id=0&account=&callerID=callerID')
      .map(res => this.checkForSessionEnd(res));
  }

  getStructureEntities() {

    return this._http.get(this.serverURL + 'ems/services/ResourceService/getStructureType?key=' + this.dataService.key + '&callerID=callerID')
      .map(res => this.checkForSessionEnd(res));
  }

  getStructureCategories() {

    return this._http.get(this.serverURL + 'ems/services/ResourceService/getStructureUsageTypes?key=' + this.dataService.key + '&callerID=callerID')
      .map(res => this.checkForSessionEnd(res));
  }

  getGreenMarkCertificates() {

    return this._http.get(this.serverURL + 'ems/services/ResourceService/getGreenMarkCertificates?key=' + this.dataService.key + '&callerID=callerID')
      .map(res => this.checkForSessionEnd(res));
  }

  getNodeListHierarchyByLocationType(locationType: string) {

    return this._http.get(this.serverURL + 'ems/services/ResourceService/getNodeListHierarchyByLocationType?key=' + this.dataService.key + '&locationType=' + locationType + '&callerID=callerID')
      .map(res => this.checkForSessionEnd(res));
  }

  getStatistics(nodeName: string) {
    

    return this._http.get(this.serverURL + 'ems/services/ResourceService/statistics?key=' + this.dataService.key + '&nodeName=' + nodeName + '&dataName=Power&beginDate=1474882029000&endDate=1475054829000&callerID=getHeader')
      .map(res => this.checkForSessionEnd(res));

  }

  getBudget(nodeName: string) {

    return this._http.get(this.serverURL + 'ems/services/ResourceService/getBudget?key=' + this.dataService.key + '&nodeName=' + nodeName + '&callerID=getBudget')
      .map(res => this.checkForSessionEnd(res));

  }

  getBinnedEvents(beginDate: number, endDate: number, binEnum: number, dataNames: string, nodeName: string) {
    
    return this._http.get(this.serverURL + 'ems/services/ResourceService/binnedEvents?key=' + this.dataService.key +
      '&callerID=getNodesBinnedEvents&nodeNames=' + nodeName +
      '&endDate=' + endDate + '&beginDate=' + beginDate + '&binEnum=' + binEnum + '&dataNames=' + dataNames)
      .map(res => this.checkForSessionEnd(res));

  }

  getabsBinnedEvents(beginDate: number, endDate: number, binEnum: number, dataNames: string, nodeName: string) {
    console.log(
      this.serverURL + 'ems/services/ResourceService/absBinnedEvents?key=' + this.dataService.key +
      '&callerID=getABSBinnedEvents&nodeName=' + nodeName +
      '&endDate=' + endDate + '&beginDate=' + beginDate + '&binEnum=' + binEnum + '&dataNames=' + dataNames
    );
    return this._http.get(this.serverURL + 'ems/services/ResourceService/absBinnedEvents?key=' + this.dataService.key +
      '&callerID=getABSBinnedEvents&nodeName=' + nodeName +
      '&endDate=' + endDate + '&beginDate=' + beginDate + '&binEnum=' + binEnum + '&dataNames=' + dataNames)
      .map(res => this.checkForSessionEnd(res));

  }

  getNodesByEfficiency(structureUsageType: number, beginDate: number, endDate: number, binEnum: number, dataNames: string, structureType: number, callerID: string) {
    
    return this._http.get(this.serverURL + 'ems/services/ResourceService/getBinnedEventsByStructureType?key=' + this.dataService.key + '&structureUsageType=' + structureUsageType +
      '&endDate=' + endDate + '&beginDate=' + beginDate + '&binEnum=' + binEnum + '&dataNames=' + dataNames + '&structureType=' + structureType + '&callerID=' + callerID)
      .map(res => this.checkForSessionEnd(res));

  }

  getInstantaneousEvents(nodeName: string, dataName: string, callerID: string) {
    
    return this._http.get(this.serverURL + 'ems/services/ResourceService/getInstantEventsByNode?key=' + this.dataService.key + '&nodeName=' + nodeName + '&dataName=' + dataName + '&callerID=' + callerID)
      .map(res => this.checkForSessionEnd(res));

  }

  getLoadTypeConsumption(nodeName: string, dataName: string, loadTypes: string, start: number, end: number, callerID: string) {
    return this._http.get(this.serverURL + 'ems/services/ResourceService/loadTypeConsumption?key=' + this.dataService.key + '&nodeName=' + nodeName + '&dataNames=' + dataName + '&loadTypes=' + loadTypes +
      '&start=' + start + '&end=' + end + '&callerID=' + callerID)
      .map(res => this.checkForSessionEnd(res));
  }

  getInstantaneousEventsByStructureType(dataName: string, structureType: number, structureUsageType: number, callerID: string) {

    return this._http.get(this.serverURL + 'ems/services/ResourceService/getInstantaneousEventsByStructureType?key=' + this.dataService.key + '&dataName=' + dataName + '&structureType=' + structureType + '&structureUsageType=' + structureUsageType + '&callerID=' + callerID)
      .map(res => this.checkForSessionEnd(res));

  }

  getAllTagData(tagName: string, start: number, end: number, dataName: string, binEnum: number, callerID: string) {
    return this._http.get(this.serverURL + 'ems/services/ResourceService/getAllTagData?key=' + this.dataService.key + '&tagName=' + tagName + '&dataNames=' + dataName + '&binEnum=' + binEnum +
      '&beginDate=' + start + '&endDate=' + end + '&callerID=' + callerID)
      .map(res => this.checkForSessionEnd(res));
  }

  getCommonTypeConsumption(nodeName: string, dataName: string, loadTypes: string, start: number, end: number, callerID: string) {
    return this._http.get(this.serverURL + 'ems/services/ResourceService/getCommonTypeConsumption?key=' + this.dataService.key + '&nodeNames=' + nodeName + '&dataNames=' + dataName + '&commonTypes=' + loadTypes +
      '&beginDate=' + start + '&endDate=' + end + '&type=1&tag=0&callerID=' + callerID)
      .map(res => this.checkForSessionEnd(res));
  }

  getAvailableBills(utility: string) {
    return this._http.get(this.serverURL + 'ems/services/ResourceService/getAvailableBills?key=' + this.dataService.key + '&utility=' + utility + '&callerID=getTariff')
      .map(res => this.checkForSessionEnd(res));
  }

  getContributionByNode(nodeName: string, start: number, end: number, dataName: string) {
    return this._http.get(this.serverURL + 'ems/services/ResourceService/getContributionByNode?key=' + this.dataService.key + '&nodeName=' + nodeName + '&start=' + start + '&end=' + end + '&dataName=' + dataName + '&callerID=getContribution')
      .map(res => this.checkForSessionEnd(res));
  }

  getEfficiencyFloating(nodeName: string, tagName: string, beginDate: number, endDate: number, binEnum: number, dataNames: string) {
    return this._http.get(this.serverURL + 'ems/services/ResourceService/getEfficiencyFLoating?key=' + this.dataService.key + '&nodeName=' + nodeName + '&nodeGroup=DataCenter' +
      '&beginDate=' + beginDate + '&endDate=' + endDate + '&tagName=' + tagName + '&binEnum=' + binEnum + '&dataNames=' + dataNames + '&callerID=getEfficiencyFLoating')
      .map(res => this.checkForSessionEnd(res));
  }

  getWaterTags(nodeName: string, tagPrefix: string, timeInterval: number, nor: number) {
    //Chilled Water
    return this._http.get(this.serverURL + 'ems/services/ResourceService/getWaterTags?key=' + this.dataService.key + '&nodeName=' + nodeName + '&nor=' + nor + '&tagPrefix=' + tagPrefix + '&timeInterval=' + timeInterval + '&callerID=getWaterTags')
      .map(res => this.checkForSessionEnd(res));
  }

  getNodesByTag(nodeName: string, tagName: string, inculudeChildren: boolean) {

    return this._http.get(this.serverURL + 'ems/services/ResourceService/getNodesByTag?key=' + this.dataService.key + '&nodeName=' + nodeName + '&tagName=' + tagName + '&inculudeChildren=' + inculudeChildren + '&callerID=getNodesByTag')
      .map(res => this.checkForSessionEnd(res));
  }

  getNodesByTagGroup(groupNode: string, tagName: string) {

    return this._http.get(this.serverURL + 'ems/services/ResourceService/getNodesByTagGroup?key=' + this.dataService.key + '&groupNode=' + groupNode + '&tagName=' + tagName + '&callerID=getNodesByGroupTag')
      .map(res => this.checkForSessionEnd(res));
  }

  getAllInstantEventsByNode(nodeName: string, measureName: string) {
    return this._http.get(this.serverURL + 'ems/services/ResourceService/getAllInstantEventsByNode?key=' + this.dataService.key + '&nodeName=' + nodeName + '&measureName=' + measureName + '&callerID=getNodesByTag')
      .map(res => this.checkForSessionEnd(res));
  }

  getGreenMarkByNodeID(nodeId: number) {
    return this._http.get(this.serverURL + 'ems/services/ResourceService/getGreenMarkByNodeID?key=' + this.dataService.key + '&id=' + nodeId + '&callerID=getGreenMarkReference')
      .map(res => this.checkForSessionEnd(res));
  }

  getMaps(nodeName: string, type: string, measure: string, callerID: string) {
    return this._http.get(this.serverURL + 'ems/services/ResourceService/getMaps?key=' + this.dataService.key + '&nodeName=' + nodeName + '&type=' + type + '&measure=' + measure + '&callerID=' + callerID)
      .map(res => this.checkForSessionEnd(res));
  }
  controlNode(nodeName :string , cmd : string){
    return this._http.get(this.serverURL + 'ems/services/ResourceService/control?key=' + this.dataService.key + '&id=' + nodeName + '&command='+ cmd +'&isGroupControl=false&callerID=callerID&gkc.nodeControlCallBack')
    .map(res => this.checkForSessionEnd(res));
    
  }

  getControlNodes(){
    debugger
    return this._http.get(this.serverURL + 'ems/services/ResourceService/controlNodes?key=' + this.dataService.key +'&callerID=callerID')
    .map(res => this.checkForSessionEnd(res));
    
  }

  getNodesDataByNodeId(id){
    return this._http.get(this.serverURL + 'ems/services/ResourceService/get-nodes-data?key=' + this.dataService.key + '&id=' + id +'&account=&callerID=callerID&callback')
    .map(res => this.checkForSessionEnd(res));
  }
  getNodeAssociate(nodeName){
    return this._http.get(this.serverURL + 'ems/services/ResourceService/get-Node-Associate?key=' + this.dataService.key + '&nodeName=' + nodeName +'&callerID=callerID&callback')
    .map(res => this.checkForSessionEnd(res));
  }
  getAllLocationTypeData(beginDate:number , endDate : number,dataName: string , binEnum :number){
    console.log(
      this.serverURL + 'ems/services/ResourceService/getCostComparisonData?key=' + this.dataService.key +
      '&locationType='+"Segment"+
      '&beginDate='+beginDate+
      '&endDate='+endDate+
      '&dataNames=' + dataName+
      '&binEnum='+binEnum
      +'&callerID=callerID&callback'
    );
    return this._http.get(this.serverURL + 'ems/services/ResourceService/getCostComparisonData?key=' + this.dataService.key +
    '&locationType='+"Segment"+
    '&beginDate='+beginDate+
    '&endDate='+endDate+
    '&dataNames=' + dataName+
    '&binEnum='+binEnum
    +'&callerID=callerID&callback')
    .map(res => this.checkForSessionEnd(res));
  }


  logout() {
    return this._http.get(this.serverURL + 'ems/services/ResourceService/logout?key=' + this.dataService.key + '&callerID=logout')
      .map(res => res.json());
  }



  createUpdatePDConfiguration(data: string) {
    ////console.log(data);

    let body = 'key=' + this.dataService.key + '&data=' + data + '&callerID=callerID';


    // let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded','Access-Control-Allow-Origin': '*' });

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    //headers.append('charset', 'UTF-8');
    let options = new RequestOptions({ headers: headers });

    return this._http.post(this.serverURL + 'ems/services/ResourceService/createUpdatePDConfiguration', body, { headers: headers })
      .map(res => this.checkForSessionEnd(res));
    //  .catch(this.handleError);
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Promise.reject(errMsg);
  }

  logOutUser() {


    this.logout()
      .subscribe(
      data => {
      }
      );
    sessionStorage.clear();
    this.router.navigate(['./login', 'sessionexpired']);
    // window.location.replace('./');
  }
  
  getBill(user,id) {
    return this._http.get(this.serverURL + 'ems/services/ResourceService/get-bill?key=' + this.dataService.key + "&id="+ id +'&login=' + user + '&callerID=callerID')
      .map(res => this.checkForSessionEnd(res));
  }
  updateBill(dataObject,assingedRates) {
    let body = 'key=' + this.dataService.key + '&object=' + JSON.stringify(dataObject) + '&assingedRates=' + JSON.stringify(assingedRates) + '&callerID=callerID';
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(this.serverURL + 'ems/services/ResourceService/update-billing',body, { headers: headers }) 
    .map(res => this.checkForSessionEnd(res));
  }
  checkForSessionEnd(response: any) {
    let res = response.json();
    if (res.hasOwnProperty('errorBean') && (res.errorBean !== null || res.errorBean !== undefined)) {
      if (res.errorBean.hasOwnProperty('data')
        && res.errorBean.data.length === 2 &&
        res.errorBean.data[1].name === 'ErrorCode' && res.errorBean.data[1].value === '013') {
        this.logOutUser();
        return;
      } else if (res.errorBean.dataBean !== null && res.errorBean.dataBean.length == 2) {
        if (res.errorBean.dataBean[1].value === '013') {
          this.logOutUser();
          return;
        }
      }
    }
    return res;
  }

  

}
