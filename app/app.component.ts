import { Router } from '@angular/router';
import { GkCommonServiceService } from './gk-common-service.service';
import { DataServiceService } from './data-service.service';
import { Subscription } from 'rxjs/Rx';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  subscription: Subscription;
  hamvisibility: string = "visible";
  loginSuccess: boolean = true


  constructor(private _dataService: DataServiceService, private _httpService: GkCommonServiceService, private router: Router
  ) {
  }
  ngOnInit() {
    this.subscription = this._dataService.loginItem$
      .subscribe(login => {
        debugger
        this.loginSuccess = login;
        this.hamvisibility = login == true ? "visible" : "hidden";
        console.log("login : "+ login);
        console.log("hamvisibility : "+ this.hamvisibility);
      });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    

  }
}
