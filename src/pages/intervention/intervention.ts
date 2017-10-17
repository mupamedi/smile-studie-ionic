import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {SmileQueryService} from "../../services/SmileQueryService";
import {AuthenticationService} from "../../services/AuthenticationService";
import {WelcomePage} from "../welcome/welcome";
import {QuestionairePage} from "../questionaire/questionaire";
import {InterventionActionPage} from "../intervention-action/intervention-action";
import {LocalNotifications} from "@ionic-native/local-notifications";
@Component({
  selector: 'intervention-page',
  templateUrl: 'intervention.html'
})
export class InterventionPage implements OnInit {

  alertTime: string;
  alertActive: boolean;
  interventionReadyTime: boolean;
  interventionReadyGroup: boolean;

  constructor(public navCtrl: NavController,
              public smileQueryService: SmileQueryService,
              public authenticationService: AuthenticationService,
              private localNotifications: LocalNotifications) {

    this.getLocalstorageValues();
  }

  ngOnInit(): void {
    this.checkForQuestionaire();
  }

  getLocalstorageValues() {
    let active = localStorage.getItem('alertActive');
    let time = localStorage.getItem('alertTime');
    let lastIntervention = localStorage.getItem('lastInterventionSubmission');
    let userGroup = localStorage.getItem('userGroup');

    this.handleNotificationActive(active);
    this.handleAlertTime(time);
    this.handleLastInterventionTime(lastIntervention);
    this.handleUserGroup(userGroup);
  }

  private handleNotificationActive(active: string) {
    if (active == 'true') {
      this.alertActive = true;
    } else if (active == 'false') {
      this.alertActive = false;
    } else {
      // unitialized
      this.alertActive = true;
      this.updateAlertActivation();
    }

  }

  private handleAlertTime(time: string) {
    if (time) {
      this.alertTime = time;
    } else {
      // uninitialized
//
      let newDate = new Date();
      newDate.setUTCHours(17);
      newDate.setUTCMinutes(0);
      this.alertTime = (newDate).toISOString();
      this.updateAlertTime();
    }
  }

  private handleLastInterventionTime(lastIntervention: string) {
    if (lastIntervention) {
      let lastInterventionTime = Date.parse(lastIntervention);
      lastInterventionTime.toString()
      //TODO check if it is past 17:00 the next day
      this.interventionReadyTime = true;
    } else {
      //TODO ask server when last intervention happened
      this.interventionReadyTime = true;
    }
  }

  private handleUserGroup(userGroup: string) {
    if (Number(userGroup) >= 1) {
      console.log('usergroup valid?', userGroup);
      this.interventionReadyGroup = true;
      // we have a group and it is initialized -> all is well
    } else {
      // check our group, it may be > -1 now
      this.smileQueryService.getInterventionGroup().subscribe(result => {
        if (result > 0) {
          this.interventionReadyGroup = true;
          localStorage.setItem('userGroup', result);
        }
      })
    }
  }

  updateAlertActivation() {
    localStorage.setItem('alertActive', String(this.alertActive));
    this.setNotification();
  }

  updateAlertTime() {
    localStorage.setItem('alertTime', this.alertTime);
    this.setNotification();
  }

  setNotification() {
    console.log(this.localNotifications);
    this.localNotifications.schedule({
      text: 'Deine Intervention für heute ist bereit!',
      title: "Smile Studie",
      //TODO icon doesn't work :(
      icon: "https://smile-studie.de/static/images/favicon.ico"
    })
  }

  private checkForQuestionaire() {
    this.smileQueryService.getQuestionaire().subscribe((result) => {
      if (result) {
        this.openQuestionaire(result);
      } else {
        // Not sure when this happens
        this.authenticationService.clearSavedAccount();
        this.navCtrl.setRoot(WelcomePage);
      }
    }, error => {
      // probably 401 unauthorized
      this.authenticationService.clearSavedAccount();
      this.navCtrl.setRoot(WelcomePage);
    });
  }

  private openQuestionaire(result: any) {
    if (result.id != null) {
      // we have a questionaire!
      this.navCtrl.setRoot(QuestionairePage, {questionaire: result});
    }
  }

  startIntervention() {
    this.navCtrl.push(InterventionActionPage);
  }


}
