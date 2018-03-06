import { Component, OnInit } from '@angular/core';
import { BasePage } from './../common/base-page';
import { GkCommonServiceService } from '../gk-common-service.service';
import { DataServiceService } from '../data-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Http, Response, RequestOptions, Headers } from "@angular/http";

@Component({
  selector: 'app-demand-response',
  templateUrl: './demand-response.component.html',
  styleUrls: ['./demand-response.component.css']
})
export class DemandResponseComponent implements OnInit {

  constructor(private _httpService: GkCommonServiceService, private _dataService: DataServiceService,
      private router: Router, private _translateService: TranslateService, private activatedROute: ActivatedRoute,
      private http: Http) {
  }

  ngOnInit() {

  }
}