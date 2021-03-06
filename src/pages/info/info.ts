import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Slides} from "ionic-angular";
import {InterventionPage} from "../intervention/intervention";

export interface Slide {
  title: string,
  description: string,
  link?: string,
  afterLink?: string,
  phoneNumber?: string
}

@Component({
  selector: 'info-page',
  templateUrl: 'info.html'
})
export class InfoPage {
  @ViewChild('slider')
  slider: Slides;
  slides: Slide[];
  redirectTo;

  constructor(private navParams: NavParams,
              private navCtrl: NavController) {
    this.redirectTo = navParams.get('redirectTo');
    this.slides = navParams.get('slides');
  }

  okay() {
    if (this.slider.isEnd()) {
      if (this.redirectTo) {
        this.navCtrl.setRoot(this.redirectTo);
      }
      this.navCtrl.setRoot(InterventionPage);
    } else {
      this.slider.slideNext();
    }
  }
}
