import { Component, OnInit } from '@angular/core';
import { GkCommonServiceService } from '../../gk-common-service.service';
import { EventStatistics } from '../../vo/event-statistics';
import { HierarchyService } from '../../hierarchy.service';
import { Observable } from 'rxjs/Observable';
import { NodeTreeDatas } from '../../node-tree-datas';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css'],
  providers: [HierarchyService]
})

export class ContractComponent implements OnInit {

  constructor(private _httpService: GkCommonServiceService, private hierarchyService: HierarchyService,
    private router: Router) {}

  floorPlanName: string = "";
  instantPower: number = 0;
  private newData: Array < any > = Array < any > ();

  ngOnInit() {
    if(sessionStorage.length == 0) {
        this.router.navigate(['./login']);
    } else {
      this.hierarchyService.allData$.asObservable()
          .filter(item => item != null)
          .subscribe(
              data => {
                //   debugger
                  if (data instanceof Array && data.length == 0)
                      return;
                  this.newData.push(data);
                  for (let item of this.newData) {
                      if (this.floorPlanName == "") {
                          this.floorPlanName = item.nodeTreeDatas.name;
                      }
                      if (item.nodeTreeDatas.isRoot == '0') {
                          this.getInstantPower()
                              .subscribe(data => {});
                      }
                  }
                  console.log(data);
              });
            }
  }

  getInstantPower(): Observable < any > {
      return this._httpService.getInstantaneousEvents(this.floorPlanName, 'Power', 'GetInstantPower')
          .map(data => {
              debugger
              if (data !== null && data !== undefined) {
                  this.instantPower = (data.statistics[0] as EventStatistics).lastValue / 1000;
                  console.log("app-energy-breakdown :" + this.instantPower);
              }
          });
  }
}