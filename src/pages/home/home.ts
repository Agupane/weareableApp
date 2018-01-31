import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, AlertController, Item} from 'ionic-angular';
import { EventCreationModalPage } from "../event-creation-modal/event-creation-modal";
import {EventProvider} from "../../providers/event/event";
import {CalendarComponent} from "ionic2-calendar/calendar";
import {NotificationSchedulerProvider} from "../../providers/notification-scheduler/notification-scheduler";
import {EventReminder} from "../../model/EventReminder";
import {WeareableBleProvider} from "../../providers/weareable-ble/weareable-ble";
//import { LocalNotifications } from "@ionic-native/local-notifications";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  @ViewChild(CalendarComponent) myCalendar:CalendarComponent;
  public isToday:boolean;
  public viewTitle;
  public eventSource;
  public canCreateEvent;
  public bleConnected:boolean;
  public bleConnectedToggle:boolean;
  public bleConnectedColor:string;


  calendar = {
    mode: 'month',
    currentDate: new Date(),
    /** At the beginning the current selected is the same as the current date **/
    currentDateSelected: new Date(),
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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public eventProvider:EventProvider,
              public notifScheduler:NotificationSchedulerProvider,
              public bleProvider:WeareableBleProvider) {

    this.eventProvider.eventListUpdated.subscribe(
      (eventListUpdate:any)=>{
        console.log("Detecting changes on the event list, updating the GUI");
        this.loadEvents();
      }
    );

    this.bleProvider.bleConnected.subscribe(
      (bleConnected:boolean)=>{
        console.log("Detecting changes on the BLE conection, updating the gui to: "+ bleConnected);
        this.bleConnected = bleConnected;
      }
    )
  }

  ionViewDidLoad() {
    this.eventSource = this.eventProvider.getEventsInJsObjectFormat();
  }

  public btnSearchClicked() {
    console.log("Btn search clicked");
  }

  public onCurrentDateChanged(event:any){
    console.log("Current datechanged", event);
    var today = new Date();
    var eventTimeComparator = event.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    if(event.getTime() < today.getTime()){
      this.canCreateEvent = true;
    }
    else{
      this.canCreateEvent = false;
    }
    //today.setHours(0, 0, 0, 0);
    //event.setHours(0, 0, 0, 0);
    today = new Date();
    this.isToday = today.getTime() === event.getTime();
  }

  public reloadSource(startTime:any, endTime:any){
    console.log("Range changed from: " + startTime +" to: "+endTime);
  }

  public onEventSelected(event:any){
    console.log("Event selected: ", event);
    let eventToDelete:EventReminder = new EventReminder(event.title,"",event.startTime,event.endTime);
    this.onDeleteEvent(eventToDelete);
  }

  public onViewTitleChanged(title:any){
    console.log("View tittle changed: ", title);
    let month = title.substr(0,3);
    let year = title.substr(6,10);
    this.viewTitle = month+" "+year;
  }

  public onTimeSelected(ev:any){
    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
    this.calendar.currentDateSelected = ev.selectedTime;
  }

  public loadEvents() {
    console.log("Load events clicked");
    //this.eventSource = this.createRandomEvents();
    this.eventSource = this.eventProvider.getEventsInJsObjectFormat();
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

  /**
   * Called when the users want to create a reminder on the current day
   */
  public onCreateEvent(){
    console.log("Create event button clicked");
    let alert = this.alertCtrl.create({
      title: 'Confirm reminder',
      message: 'Do you want to create reminder for '+this.calendar.currentDateSelected+' ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () =>{
            console.log("Cancel reminder clicked");
          }
        },
        {
          text: 'Accept',
          handler: () =>{
            console.log("Accept reminder creation clicked");
            this.displayEventCreationDialog();
          }
        }
      ]
    });

    alert.present();
  }

  /**
   * Called when the users want to delete a reminder
   */
  public onDeleteEvent(event:EventReminder){
    console.log("Delete event open");
    let alert = this.alertCtrl.create({
      title: 'Confirm reminder deletion',
      message: 'Do you want to delete the reminder '+event.startDate+' ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () =>{
            console.log("Cancel reminder deletion clicked");
          }
        },
        {
          text: 'Accept',
          handler: () =>{
            console.log("Accept reminder deletion clicked");
            this.eventProvider.deleteEvent(event);
          }
        }
      ]
    });

    alert.present();
  }

  public btnExampleClicked(){
    var a = new Date();
    a = new Date(new Date().getTime()+1000*60);
    console.log("Generando delayed para las : ");
    console.log(a);
    this.notifScheduler.delayedNotification(0,"Delayed notif","Descripcion ejemplo", a);
  }


  /**
   * Displays a dialog to create a event reminder
   */
  private displayEventCreationDialog(){
      console.log("Current date to generate event: ", this.calendar.currentDateSelected);
      let eventCreationModal = this.modalCtrl.create(EventCreationModalPage, { startDate: this.calendar.currentDateSelected });
      eventCreationModal.present();
  }

  createRandomEvents() {
    var events = [];
    for (var i = 0; i < 10; i += 1) {
      var date = new Date();
      var eventType = Math.floor(Math.random() * 2);
      var startDay = Math.floor(Math.random() * 90) - 45;
      var endDay = Math.floor(Math.random() * 2) + startDay;
      var startTime;
      var endTime;
      if (eventType === 0) {
        startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
        if (endDay === startDay) {
          endDay += 1;
        }
        endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
        events.push({
          title: 'All Day - ' + i,
          startTime: startTime,
          endTime: endTime,
          allDay: true
        });
      } else {
        var startMinute = Math.floor(Math.random() * 24 * 60);
        var endMinute = Math.floor(Math.random() * 180) + startMinute;
        startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
        endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
        events.push({
          title: 'Event - ' + i,
          startTime: startTime,
          endTime: endTime,
          allDay: false
        });
      }
    }

    return events;
  }

  /**
   * Returns true if the date selected is the current day of after (not before)
   */
  public isEventPossible(){
    return this.canCreateEvent;
  }

  /**
   * Connects the phone to the weareable
   */
  public toggleWearable(event: any){
    console.log("Toggle button clicked ", event.value);
    if(event.value) {
      this.bleProvider.connectToWearable();
      /** TODO - We can use this as a promise **/
      console.log("Connected to the wearable");
      this.bleConnected = true;
    }
    else{
      this.bleProvider.disconnectWearable();
      /** TODO - We can use this as a promise **/
      this.bleConnected = false;
    }
  }

  public getToggleColor(){
    this.bleConnectedToggle = this.bleConnected;
    if(this.bleConnected){
      this.bleConnectedColor = 'green';
    }
    else{
      this.bleConnectedColor = 'red';
    }
    return this.bleConnectedColor;
  }
}
