export class EventReminder {

//Fields
  private title:string;
  private description:string;
  private eventType:number;
  private startDate:Date;
  private endDate:Date;
  private startTime:Date;
  private endTime:Date;
  private allDay:boolean;

  constructor (name:string, description:string, startDate:Date, endDate:Date){
    this.title = name;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startDate;
    this.endTime = endDate;
  }

}
