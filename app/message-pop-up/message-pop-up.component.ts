import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-message-pop-up',
  templateUrl: './message-pop-up.component.html',
  styleUrls: ['./message-pop-up.component.css']
})
export class MessagePopUpComponent implements OnInit {

  @Output() exit: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private _dataService: DataServiceService,
    private router: Router,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
  }

  public handleMessageBox(): void {
      this.exit.emit(true);
  }
}
