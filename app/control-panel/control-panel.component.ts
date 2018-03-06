import { RouteDef } from '@angular/compiler-cli/src/ngtools_impl';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServiceService } from '../data-service.service';
import { GkCommonServiceService } from '../gk-common-service.service';
import { BasePage } from '../common/base-page';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',

})
export class ControlPanelComponent extends BasePage implements OnInit {


  acUsgaeNumber: number=0;
  acUsgaePercentage: number=0;

  lightUsgaeNumber: number =0;
  lightUsgaePercentage: number =0;

  waterHeaterUsgaeNumber: number = 0;
  waterHeaterUsgaePercentage: number = 0;

  applianceUsgaeNumber: number =0;
  applianceUsgaePercentage: number =0;

  styleForAC: string;
  styleForWaterHeater: string;
  styleForLighting: string;
  styleForAppliances: string;


  constructor(private _httpService: GkCommonServiceService, private _dataService: DataServiceService,
    private router: Router, private _translateService: TranslateService, private activatedROute: ActivatedRoute) {
    super(_dataService, router, _translateService);
    this.validateSession();

    // this.style1 = "display: block; height: 100%; transition: height 500ms ease 0ms";


  }

  onControlACClicked() {
    this.makeAllDisplaynone();
    this.styleForAC = 'block';
  }

  onControlWHClicked() {
    this.makeAllDisplaynone();
    this.styleForWaterHeater = 'block';
  }

  onControlAPClicked() {
    this.makeAllDisplaynone();
    this.styleForAppliances = 'block';
  }

  onControlLHClicked() {
    this.makeAllDisplaynone();
    this.styleForLighting = 'block';
  }

  makeAllDisplaynone() {
    this.styleForAC = 'none';
    this.styleForWaterHeater = 'none';
    this.styleForLighting = 'none';
    this.styleForAppliances = 'none';
  }

  ngOnInit() {
  }

}
