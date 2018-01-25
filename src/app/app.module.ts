import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { OneSignal } from '@ionic-native/onesignal';

import { LocalNotifications } from "@ionic-native/local-notifications";
import { NgCalendarModule  } from 'ionic2-calendar';
import { EventCreationModalPage } from "../pages/event-creation-modal/event-creation-modal";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EventCreationModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    NgCalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EventCreationModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneSignal,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
