import { GkCommonServiceService } from "../gk-common-service.service";
import { DataServiceService } from "../data-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from 'ng2-translate/ng2-translate';
export class BasePage {
  // private  httpService: GkCommonServiceService;
  private dataService: DataServiceService;
  private baserouter: Router
  private translate: TranslateService

  constructor(tdataService: DataServiceService, tRouter: Router,tTranslate:TranslateService) {
    this.dataService = tdataService;
    this.baserouter = tRouter;
    this.translate = tTranslate;
  }

  validateSession() {
    if (this.dataService === undefined || this.dataService.userVO === undefined) {

      let key = sessionStorage.getItem('key');
      let username = sessionStorage.getItem('username');
      let firstName = sessionStorage.getItem('firstName');
      let lastName = sessionStorage.getItem('lastName');
      if (key === null || key === undefined) {
        this.baserouter.navigate(['/']);
      } else {
        this.translate.use('en');
        this.dataService.key = key;
        this.dataService.userVO = { key: key, username: username ,firstName:firstName,lastName:lastName};
        this.dataService.changeLogin(true);
      }

    }
  }

 

  
}
