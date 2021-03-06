import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {WelcomePage} from "../pages/welcome/welcome";
import {TranslateService} from "@ngx-translate/core";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = WelcomePage;

  constructor(private translate: TranslateService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    this.initTranslate();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }


  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('de');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('de'); // Set your language here
    }
  }

}

