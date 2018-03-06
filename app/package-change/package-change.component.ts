import { Component, OnInit, ViewEncapsulation, Output,Input, EventEmitter } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-package-change',
  templateUrl: './package-change.component.html',
  styleUrls: ['./package-change.component.css']
})
export class PackageChangeComponent implements OnInit {

  @Output() selectPackage: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _dataService: DataServiceService,
    private router: Router,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
  }

  public changePackage(checkFlag): void {
    if(checkFlag)
      this.selectPackage.emit(true);
    else 
      this.selectPackage.emit(false);
  }
  
}
