import { MainPanelComponent } from './control-panel/main-panel/main-panel.component';
import { ConfirmDevicesComponent } from './control-panel/confirm-devices/confirm-devices.component';
import { SelectRoomComponent } from './control-panel/select-room/select-room.component';
import { AddDevicesComponent } from './control-panel/add-devices/add-devices.component';
import { CofigurationComponent } from './cofiguration/cofiguration.component';
import { DemandResponseComponent } from './demand-response/demand-response.component';
import { LoginComponent } from './login/login.component';

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, RouterOutlet, RouterLink, RouterLinkActive, RouterLinkWithHref } from '@angular/router';


import { DashboardComponent } from './dashboard/dashboard.component';
import { EnergyBreakdownComponent } from './energy-breakdown/energy-breakdown.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';


const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'demand', component: DemandResponseComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'energy', component: EnergyBreakdownComponent },
    { path: 'control', component: AddDevicesComponent },
    { path: 'configuration', component: CofigurationComponent },
    { path: 'addDevice', component: AddDevicesComponent },
    { path: 'selectRoom', component: SelectRoomComponent },
    { path: 'confirmDevice', component: ConfirmDevicesComponent },
    { path: 'mainPanel', component: MainPanelComponent },

    
];

export const appRoutingProviders: any[] = [

];



export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
