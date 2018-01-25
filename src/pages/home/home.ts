import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalNotifications } from "@ionic-native/local-notifications";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  public calendar:any = {

  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private localNotificationProvider: LocalNotifications) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  public btnSearchClicked() {
    console.log("Btn search clicked");
  }

  public onCurrentDateChanged(event:any){
    console.log("Current datechanged");
    console.log(event);
  }

  public reloadSource(startTime:any, endTime:any){
    console.log("Range changed from: " + startTime +" to: "+endTime);
  }

  public onEventSelected(event:any){
    console.log("Event selected: ", event);
  }

  public onViewTitleChanged(event:any){
    console.log("View tittle changed: ", event);
  }

  public onTimeSelected(event:any){
    console.log("Time selected: ", event);
  }

}
