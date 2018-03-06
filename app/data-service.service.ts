
import { BehaviorSubject } from 'rxjs/Rx';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class DataServiceService {

  public key: string;
  public userVO;

  public env = new EventEmitter<string>();

  private _loginSuccessItemSource = new BehaviorSubject<boolean>(false);

  loginItem$ = this._loginSuccessItemSource.asObservable();

  constructor() { }

  changeLogin(val) {
    
    this._loginSuccessItemSource.next(val);
  }

}
