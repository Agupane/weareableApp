export class EventReminder {

//Fields
  public title:string;
  public description:string;
  private eventType:number;
  public startDate:Date;
  private endDate:Date;
  private startTime:Date;
  private endTime:Date;
  private allDay:boolean;
  private notificationId:number;

  constructor (name:string, description:string, startDate:Date, endDate:Date){
    this.title = name;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startDate;
    this.endTime = endDate;
    this.notificationId = 0;
  }

  public setNotificationId(notificationId:number){
    this.notificationId = notificationId;
  }

  public getNotificationId(){
    return this.notificationId;
  }

}
