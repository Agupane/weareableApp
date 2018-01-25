import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { LocalNotifications } from "@ionic-native/local-notifications";

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

  public isToday:boolean;
  public viewTitle;
  public eventSource;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
    dateFormatter: {
      formatMonthViewDay: function(date:Date) {
        return date.getDate().toString();
      },
      formatMonthViewDayHeader: function(date:Date) {
        return 'MonMH';
      },
      formatMonthViewTitle: function(date:Date) {
        return 'testMT';
      },
      formatWeekViewDayHeader: function(date:Date) {
        return 'MonWH';
      },
      formatWeekViewTitle: function(date:Date) {
        return 'testWT';
      },
      formatWeekViewHourColumn: function(date:Date) {
        return 'testWH';
      },
      formatDayViewHourColumn: function(date:Date) {
        return 'testDH';
      },
      formatDayViewTitle: function(date:Date) {
        return 'testDT';
      }
    }
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {

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
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }

  public reloadSource(startTime:any, endTime:any){
    console.log("Range changed from: " + startTime +" to: "+endTime);
  }

  public onEventSelected(event:any){
    console.log("Event selected: ", event);
  }

  public onViewTitleChanged(title:any){
    console.log("View tittle changed: ", title);
    this.viewTitle = title;
  }

  public onTimeSelected(ev:any){
    console.log("Time selected: ", ev);
    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
      (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
  }

  public loadEvents() {
    console.log("Load events clicked");
   // this.eventSource = this.createRandomEvents();
  }

  public changeMode(mode) {
    console.log("Change mode clicked, new mode: ", mode);
    this.calendar.mode = mode;
  }

  public today() {
    this.calendar.currentDate = new Date();
  }

  markDisabled = (date:Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return date < current;
  };

}
