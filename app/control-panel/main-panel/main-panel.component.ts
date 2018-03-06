import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.css']
})
export class MainPanelComponent implements OnInit {
  waterHeaterUsgaePercentage : number =0;
  instantPower : number = 0 ;
  lightUsgaeNumber : number = 0 ;
  acUsgaePercentage : number = 0 ;
  applianceUsgaeNumber : number = 0 ;
  styleForAC : string ="";
  styleForWaterHeater : string = "";
  styleForAppliances : string = "";
  styleForLighting : string = "" ;
  acUsgaeNumber: number = 0;
  lightUsgaePercentage : number = 0 ;
  waterHeaterUsgaeNumber :number = 0 ;
  applianceUsgaePercentage: number = 0 ;
 



  constructor() { }

  ngOnInit() {
  }
  onControlACClicked(){

  }
  onControlWHClicked(){

  }
  onControlLHClicked(){

  }
  onControlAPClicked(){

  }

}

