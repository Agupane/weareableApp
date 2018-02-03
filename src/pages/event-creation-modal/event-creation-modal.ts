import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { EventReminder } from '../../model/EventReminder';
import {EventProvider} from "../../providers/event/event";

@IonicPage()
@Component({
  selector: 'page-event-creation-modal',
  templateUrl: 'event-creation-modal.html',
})
export class EventCreationModalPage {

  private newEvent:EventReminder;

  private startDate:any;
  private endDate:any;
  private eventName:string;
  private eventDescription:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public eventProvider:EventProvider) {
    this.startDate = navParams.get('startDate');
  }

  ionViewDidLoad() {
    let day = this.startDate.getDate();
    let month = this.startDate.getMonth()+1;
    if(month<10){
      /** We add 0 in front of the month in order to parse it **/
      month = "0"+month;
    }
    let year = this.startDate.getFullYear();

    /** This date is for obtain the actual hour and minutes **/
    let dateForHourAndMinutes = new Date();
    let hour = dateForHourAndMinutes.getHours();
    let minutes = dateForHourAndMinutes.getMinutes();
/*    let hour = this.startDate.getHours();
    let minutes = this.startDate.getMinutes();*/

    console.log("Date to create: ");
    console.log(this.startDate);
    console.log("Time in hours to create: ");
    console.log(hour);
    console.log("Time in minutes to create: ");
    console.log(minutes);
/*    if(hour === 0){
      hour = "00";
    }*/

    this.startDate = year + "-" + month + "-" + day+"T"+hour+":"+minutes;

    //console.log("Final start date: ");
    //console.log(this.startDate);

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  btnCreateClicked(){
    console.log("Btn create reminder clicked");
    if(!this.endDate){
      /** If we dont have end date we suppose it the same as the start date **/
      this.endDate = this.startDate;
    }

    this.startDate = this.stringToDateParser(this.startDate);
    this.endDate = this.stringToDateParser(this.endDate);

    this.newEvent = new EventReminder(
      this.eventName,
      this.eventDescription,
      this.startDate,
      this.endDate
    );

    this.eventProvider.saveEvent(this.newEvent);
    this.viewCtrl.dismiss(this.newEvent);
  }

  private stringToDateParser(stringDate:string){
    console.log("Parsing string date to date");
    let returnDate;
    let year = stringDate.substring(0,4);

    let month = stringDate.substring(5,7);


    let day = stringDate.substring(8,10);

    let hour = stringDate.substring(11,13);

    let minutes= stringDate.substring(14,17);


    //console.log("Final build: ");
    //console.log(year+"/"+month+"/"+day+"/"+hour+"/"+minutes);
    returnDate = new Date(parseInt(year),parseInt(month)-1,parseInt(day),parseInt(hour),parseInt(minutes),0,0);
    return returnDate;
  }

}
