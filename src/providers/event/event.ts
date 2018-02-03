import {EventEmitter, Injectable} from '@angular/core';
import {DbProvider} from "../db/db";
import {EventReminder} from "../../model/EventReminder";
import {NotificationSchedulerProvider} from "../notification-scheduler/notification-scheduler";

/*
  Generated class for the EventProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventProvider {

  private eventList: EventReminder[];
  public  eventListUpdated: EventEmitter<any>;

  constructor(public dbProvider:DbProvider, public notifScheduler:NotificationSchedulerProvider) {
    this.eventListUpdated = new EventEmitter<String>();
    this.loadEventList()
      .then((data)=>{
        console.log("Sucessfull loading event list from storage");
        this.createNotificationForEvents();
        this.eventListUpdated.emit(this.eventList);
        return data;
      })
      .catch((error)=>{
        console.log("Error loading event list from storage ", error);
        return error;
      });
  }

  public saveEvent(event:EventReminder){
    console.log("Saving event on event provider");
    event.setNotificationId(this.generateUniqueIdForEvents());
    this.eventList.push(event);
    /** We update the list on the DB **/
    this.saveListOnDb();
    /** Now we schedule the notification for that event **/
    this.notifScheduler.delayedNotification(event.getNotificationId(),event.title,event.description,event.startDate);

    //this.notifScheduler.singleNotification("Notification de test");
  }

  private generateUniqueIdForEvents(){
    /*
    let id;
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    id = '_' + Math.random().toString(36).substr(2, 9);
    return id;
    */
    var uid = Math.random() * Math.pow(10, 17) + Math.random() * Math.pow(10, 17) + Math.random() * Math.pow(10, 17) + Math.random() * Math.pow(10, 17);
    return uid;
  }

  private saveListOnDb(){
    console.log("Saving the event list on the DB");
    /** First we save the event on the DB **/
    this.dbProvider.saveEventList(this.eventList);
    /** We tell the GUI to update the interface **/
    this.eventListUpdated.emit(this.eventList);
  }

  private loadEventList(){
    return new Promise((resolve,reject)=>{
      this.dbProvider.getAllEvents()
        .then((eventList:any[])=>{
          console.log("Event list loaded on event provider");
          let eventReminderObjectsList = [];
          let eventIterator;
          let newEventObject;
          this.eventList = eventList;
          for(let iterator in eventList){
            eventIterator = eventList[iterator];
            newEventObject = new EventReminder(eventIterator.title,eventIterator.description,new Date(eventIterator.startDate),new Date(eventIterator.endDate));
            newEventObject.setNotificationId(eventIterator.notificationId);
            eventReminderObjectsList.push(newEventObject);
            this.eventList = eventReminderObjectsList;
          }
          resolve(this.eventList);
        })
        .catch((errorEventList)=>{
          console.log("Error while loading event list on the provider ", errorEventList);
          this.eventList = [];
          reject(this.eventList);
        })
    });
  }

  public getEvents(){
    console.log("Loading all the events from event provider");
    return this.eventList;
  }

  public getEventsInJsObjectFormat(){
    var returnObjects =[];
    var eventIterator;
    var objectIterator;
    for(let iterator in this.eventList){
      eventIterator = this.eventList[iterator];
      objectIterator = {
        title: eventIterator.title,
        description: eventIterator.description,
        notificationId:eventIterator.notificationID,
        startTime: eventIterator.startTime,
        endTime: eventIterator.endTime,
        allDay:false
      };
      returnObjects.push(objectIterator);
    }
 //   console.log("Returning objects: ", returnObjects);
    return returnObjects;
  }

  /**
   * Cleans all the current notifications delayed and creates one notification delayed
   * for each event on the list
   */
  private createNotificationForEvents(){
    let eventIterator;
    this.notifScheduler.clearAllScheduledNotifications()
      .then((notifCleared)=>{
        console.log("Previous existing scheduled notifications are now clear, generating new notifications: ");
        this.eventList.forEach((eventElement)=>{
          this.notifScheduler.delayedNotification(eventElement.getNotificationId(),eventElement.title,eventElement.description,eventElement.startDate);
        })
      })
      .catch((error)=>{
        console.log("There was an error clearing the delayed existing notifications, generating new notifications");
        this.eventList.forEach((eventElement)=>{
          this.notifScheduler.delayedNotification(eventElement.getNotificationId(),eventElement.title,eventElement.description,eventElement.startDate);
        })
      });
  }

  /**
   * Delete event param
   * @param {EventReminder} event
   */
  public deleteEvent(event:EventReminder){
    let itemIndex;
    let eventIterator:EventReminder;
    for(let iterator in this.eventList){
      eventIterator = this.eventList[iterator];
      if(event.getNotificationId() === eventIterator.getNotificationId()){
        itemIndex = iterator;
        break;
      }
    }
    if(!(itemIndex === null)){
      console.log("Deleting item on index ", itemIndex);
      this.eventList.splice(itemIndex,1);
      this.saveListOnDb();
      this.notifScheduler.deleteNotification(event.getNotificationId());
    }
  }
}
