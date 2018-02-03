import { Injectable } from '@angular/core';
import { EventReminder } from "../../model/EventReminder";
import {Platform} from "ionic-angular";
import { Storage } from "@ionic/storage";

@Injectable()
export class DbProvider {

  constructor(public storage: Storage, private platform:Platform) {
  }

  public getAllEvents(){
    console.log("Loading events from db");
    return new Promise((resolve,reject)=>{
      if(this.platform.is('cordova')){
        /** Android **/
        this.storage.ready()
          .then(()=>{
            this.storage.get('eventList')
              .then((events)=>{
                console.log("Event list: ", events);
                if(events){
                  resolve(events);
                }

                else{
                  resolve([]);
                }
              })
              .catch((error)=>{
                console.log("Error loading event list ",error);
                reject([]);
              })
          })
      }
      else{
        /** PC **/
        let eventList;
        eventList = JSON.parse(localStorage.getItem('eventList'));
        if(eventList){
          resolve(eventList);
        }
        else{
          reject([]);
        }
      }
    })
  }

  public saveEventList(eventList:EventReminder[]){
    console.log("Saving event list on db");
    if(this.platform.is('cordova')){
      /** Android **/
      this.storage.set('eventList', eventList);
    }
    else{
      /** PC **/
      localStorage.setItem('eventList', JSON.stringify(eventList));
    }

  }

}
