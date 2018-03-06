import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';
import { GkCommonServiceService } from './gk-common-service.service';
import { DataServiceService } from './data-service.service';
import { routing } from './app.routing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Http } from '@angular/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { EnergyBreakdownComponent } from './energy-breakdown/energy-breakdown.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { CofigurationComponent } from './cofiguration/cofiguration.component';
import { DemandResponseComponent } from './demand-response/demand-response.component';

import { LoginComponent } from './login/login.component';
import { ContractComponent } from './demand-response/contract/contract.component';
import { TotalSavingComponent } from './demand-response/total-saving/total-saving.component';
import { AddEditDeviceComponent } from './demand-response/add-edit-device/add-edit-device.component';
import { RewardPenalityComponent } from './demand-response/reward-penality/reward-penality.component';
import { SelectRoomComponent } from './control-panel/select-room/select-room.component';
import { AddDevicesComponent } from './control-panel/add-devices/add-devices.component';
import { ConfirmDevicesComponent } from './control-panel/confirm-devices/confirm-devices.component';
import { MainPanelComponent } from './control-panel/main-panel/main-panel.component';

import {HierarchyService} from './hierarchy.service';
import { PackageChangeComponent } from './package-change/package-change.component';
import { MessagePopUpComponent } from './message-pop-up/message-pop-up.component';


export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EnergyBreakdownComponent,
    ControlPanelComponent,
    CofigurationComponent,
    DemandResponseComponent,
    LoginComponent,
    ContractComponent,
    TotalSavingComponent,
    AddEditDeviceComponent,
    RewardPenalityComponent,
    SelectRoomComponent,
    AddDevicesComponent,
    ConfirmDevicesComponent,
    MainPanelComponent,
    PackageChangeComponent,
    MessagePopUpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  providers: [DataServiceService, GkCommonServiceService,HierarchyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
