import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCreationModalPage } from './event-creation-modal';

@NgModule({
  declarations: [
    EventCreationModalPage,
  ],
  imports: [
    IonicPageModule.forChild(EventCreationModalPage),
  ],
})
export class EventCreationModalPageModule {}
