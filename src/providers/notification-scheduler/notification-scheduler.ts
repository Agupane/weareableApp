
import { Injectable } from '@angular/core';
import {LocalNotifications} from "@ionic-native/local-notifications";
import {WearableBleProvider} from "../weareable-ble/weareable-ble";

/*
  Generated class for the NotificationSchedulerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationSchedulerProvider {

  private bleConnected:boolean;

  constructor(private localNotifications: LocalNotifications, public wearableProvider:WearableBleProvider ) {
    this.wearableProvider.bleConnected.subscribe(
      (bleConnected:boolean)=>{
        console.log("Detecting changes on the BLE conection, updating the notification provider to: "+ bleConnected);
        this.bleConnected = bleConnected;
      }
    )
  }

  // Schedule delayed notification
  public delayedNotification(notificationId:number,text:string,description:string,dateScheduled:Date){
    let timeToNotification = new Date(dateScheduled.getTime());
/*    console.log("Creating delayed notification to notify at", timeToNotification);
    console.log("Date scheduled: ");
    console.log(dateScheduled);
    console.log("Time scheduled: ");
    console.log(dateScheduled.getTime());*/
    if(text === null){
      text = 'ReminderApp!'

    }
    if(description === null){
      description = 'Your event is now'
    }

    console.log("Scheduling notification with title: "+text+" and description: "+description);
    this.localNotifications.schedule({
      id: notificationId,
      title: text,
      text: description,
      at: timeToNotification
    });

    this.localNotifications.on('trigger', ()=>{
      console.log("Notification callback called");
      /** If there is an wearable connected, we make it vibrate **/
      if(this.bleConnected){
        console.log("Vibration wearable by notification");
        this.wearableProvider.vibrateWearable(2);
      }

    })
  }

  public singleNotification(text:string){
    // Schedule a single notification
    console.log("Sending normal notification");
    this.localNotifications.schedule({
      id: 1,
      text: text
    });
  }

  public clearAllScheduledNotifications(){
    return this.localNotifications.cancelAll();
  }

  public deleteNotification(notificationId:number){
    this.localNotifications.clear(notificationId)
      .then((msg)=>{
        console.log("Notification with id "+notificationId+" successfull deleted");
        console.log(msg);
      })
      .catch((error) =>{
        console.log("There was an error deleting the notification "+notificationId);
        console.log(error);
      })
  }
}
