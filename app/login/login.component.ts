import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { UserVO } from '../vo/user-vo';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GkCommonServiceService } from '../gk-common-service.service';
import { DataServiceService } from '../data-service.service';

import { Animations } from '../animation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [':host { width: 100%; display: block; position: relative; }'],
  host: { '[@routeAnimation]': 'true' },
  animations: Animations.page,
})
export class LoginComponent implements OnInit, AfterViewInit {

  username: string;
  credential: string;
  key: string;
  userVO: UserVO;
  rememberMe: boolean = false;
  public itemheight = 0;

  constructor(private _httpService: GkCommonServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataServiceService, private translate: TranslateService) {
    translate.addLangs(["en", "fr", "jp"]);
    translate.setDefaultLang('en');
    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr|jp/) ? browserLang : 'en');
    // window.scrollTo(0, 0);
  }



  onSubmitClicked() {



    if (this.rememberMe == true) {
      Cookie.set('username', this.username);
      Cookie.set('credential', this.credential);
      Cookie.set('rememberMe', 'true');
    } else {
      Cookie.set('username', '');
      Cookie.set('credential', '');
      Cookie.set('rememberMe', '');
    }

    sessionStorage.clear();

    this._httpService.getLogin(this.username, this.credential)
      .subscribe(
      data => {

        this.userVO = data;

        if (this.userVO.errorBean == null) {
          if (data.hasOwnProperty('username') === false || data.username === null || data.username === undefined) {
            data.username = '';
          }
          this.dataService.userVO = data;
          this.key = data.key;
          this.dataService.key = data.key;
          sessionStorage.setItem('key', data.key);
          sessionStorage.setItem('username', data.username);
          sessionStorage.setItem('firstName', data.firstName);
          sessionStorage.setItem('lastName', data.lastName);
          this.dataService.changeLogin(true);

          this.router.navigate(['./dashboard']);



        } else {
          alert('username or password invalid.');
        }


      },
      error => alert(error)


      );

  }

  ngAfterViewInit() {
    let top =(document.getElementById('loginDiv') && document.getElementById('loginDiv').getBoundingClientRect().top) || 0 ;
    let footerH = (document.getElementById('footer') && document.getElementById('footer').getBoundingClientRect()) || null ;
  
    let h = window.innerHeight - top - ((footerH && footerH.height) || 0);
    this.itemheight = h;

  }


  ngOnInit() {
    this.dataService.changeLogin(false);
    this.username = Cookie.get('username');
    this.credential = Cookie.get('credential');
    if (Cookie.get('rememberMe') == 'true') {
      this.rememberMe = true;
    }

    let sessionExpired = this.route.params.subscribe(params => {
      let session = params['id'];
          sessionStorage.clear();
          this.router.navigate(['./login']);
      if (session === 'sessionexpired') {
        setTimeout(function () {
          alert('Session expired.')
        }, 0);
      }
    });
  }

}
