import {EventEmitter, Injectable, NgZone} from '@angular/core';
import {BLE} from "@ionic-native/ble";
import {ToastController} from "ionic-angular";
import {isSuccess} from "@angular/http/src/http_utils";

/*
  Generated class for the WearableBleProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WearableBleProvider {

  // Service/Characteristics for TECO Vibration Wearable.
  private VIB_SERVICE	       	= "713D0000-503E-4C75-BA94-3148F18D941E";
  private VIB_CHARACTERISTIC_MOTORS_ON	= "713D0003-503E-4C75-BA94-3148F18D941E";
  private VIB_CHARACTERISTIC_MAX_MOTOR_FRECUENCE	= "713D0002-503E-4C75-BA94-3148F18D941E";
  private VIB_CHARACTERISTIC_NR_MOTORS_ON	= "713D0001-503E-4C75-BA94-3148F18D941E";

  public bleConnected: EventEmitter<boolean>;
  private WEARABLE_UID = 'CE:13:F7:B3:49:17';
  private WEARABLE_NAME = 'TECO Wearable';
  private secondsToScan = 60; /** 1 minute scaning **/
  private wearable:any = {};
  private statusMessage: string;
  private scanTimeOut;
  private vibrationTimeOut;

  devices: any[] = [];

  // TypedArray for data we want to send (5 bytes)
  private dataWearable = new Uint8Array(4);
  private lastDataWearable = new Uint8Array(4);

  constructor(private ble: BLE,
              private ngZone: NgZone,
              private toastCtrl: ToastController) {
    this.bleConnected = new EventEmitter<boolean>();
    // Reset data to initial state
    this.dataWearable[0] = 0x00;
    this.dataWearable[1] = 0x00;
    this.dataWearable[2] = 0x80;
    this.dataWearable[3] = 0x80;
  }

  private connectToBle(){
    console.log("Connecting to BLE");
    let scanedValues = [];
    let errorFound;
    this.ble.isEnabled()
      .then((isEnabled)=>{
        console.log("BLE enabled, scaning devices: ", isEnabled);
        /** BLE Already enabled, just scan for devices **/
        this.scanDevices();
      })
      .catch((error)=>{
        console.log("BLE is Disabled, activating the BLE ");
        console.log(error);
        this.ble.enable()
          .then((enabled) => {
            console.log("BLE activated ", enabled);
            this.scanDevices();
          })
          .catch((error) => {
            console.log("Error found activating BLE ", error);
          });
      });
  }

  private readNumberOfMotors(){
    console.log("Reading number of motors of the Wearable");
    //this.ble.read(this.WEARABLE_UID)
  }

  private readMaxFrecuenceOfMotors(){
    console.log("Reading max frecuence of the motors");
  }

  private connectToDevice(uid:string){
    console.log("Connecting to wearable");
    this.ble.connect(uid)
      .subscribe(
        wearable => this.onConnected(wearable),
        wearable => this.onDeviceDisconnected(wearable)
      );
  }

  private onConnected(wearable){
    console.log("Service connected sucessfull ", wearable);
    let cycleInterval;
    this.ngZone.run(() => {
      this.setStatus('');
      this.wearable = wearable;
      /** We alert the GUI that there is an established connection with the wearable **/
      this.bleConnected.emit(true);

      // Reset data to initial state
      this.dataWearable[0] = 0x00;
      this.dataWearable[1] = 0x00;
      this.dataWearable[2] = 0x80;
      this.dataWearable[3] = 0x80;
    });

    // Start interval: Send data and shift bytes every 0.1 seconds with a duration of 5 seconds
    cycleInterval = setInterval(this.shiftByteAndSend(), 100);
  }

  private shiftByteAndSend() {
    console.log("Shift and sending bytes");
    // Shift ("rotate") byte by one, so FF000000 becomes 00FF000000 and so on.
    for (let i = 0; i < 5; i++) {
      this.lastDataWearable[i] = this.dataWearable[i];
    }
    for (var i = 0; i < 5; i++) {
      this.dataWearable[i] = this.lastDataWearable[(i + 1) % 5];
    }

    // Send byte array to wearable.
 /*   this.ble.writeWithoutResponse(this.wearable.id, this.VIB_SERVICE, this.VIB_CHARACTERISTIC_MOTORS_ON, this.dataWearable.buffer)
      .then((sucess)=>{
        console.log("Data sucessfully writed ",sucess);
      })
      .catch((error)=>{
        console.log("Error writing on the wearable: ", error);
      });*/
    this.ble.write(this.wearable.id, this.VIB_SERVICE, this.VIB_CHARACTERISTIC_MOTORS_ON, this.dataWearable.buffer)
      .then((sucess)=>{
        console.log("Data sucessfully writed ",sucess);
      })
      .catch((error)=>{
        console.log("Error writing on the wearable: ", error);
      });
  }

  private shiftByte() {
    console.log("Shift and sending bytes");
    // Shift ("rotate") byte by one, so FF000000 becomes 00FF000000 and so on.
    for (let i = 0; i < 5; i++) {
      this.lastDataWearable[i] = this.dataWearable[i];
    }
    for (var i = 0; i < 5; i++) {
      this.dataWearable[i] = this.lastDataWearable[(i + 1) % 5];
    }
  }

  private onDeviceDisconnected(wearable){
    console.log("Device disconnected ",wearable);
    let toast = this.toastCtrl.create({
      message: 'The wearable unexpectedly disconnected',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
    this.bleConnected.emit(false);
  }

  private setStatus(message) {
    console.log("Status BLE: "+ message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  private scanDevices(){
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list
    this.ble.scan([], 10).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.scanError(error)
    );
   // this.scanTimeOut = setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  private onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
      let deviceName = device.name || '';
      if(deviceName.toUpperCase().includes(this.WEARABLE_NAME.toUpperCase())){
        this.ble.stopScan()
          .then((stopSucess)=>{
            console.log("Scan stoped successfully ", stopSucess);
            clearTimeout(this.scanTimeOut);
            this.connectToDevice(device.id);
          })
          .catch((error)=>{
            console.log("There was an error trying to stop the scan ", error);
          });
      }
    });
  }

  // If location permission is denied, you'll end up here
  private scanError(error) {
    console.log("There was an error runing the scanning devices");
    this.setStatus('Error ' + error);
    let toast = this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 5000
    });
    toast.present();
    this.bleConnected.emit(false);
  }

  /**
   * Sends a notification to the wearable in order to make it vibrate
   * with a parameter of the duration
   * @param {number} intensity
   */
  public vibrateWearable(duration:number){
    console.log("Making the wearable vibrate for: "+duration+" seconds");
    this.turnOnMotors([1,1,1,1],duration);
  }

  /**
   * Receives an array of motors with the intensity (0, 0.5, 1) and the duration (in seconds) of the vibration
   * and turns on the motors with these specifications
   * @param {number[]} numberOfMotors
   * @param {number} duration
   */
  private turnOnMotors(numberOfMotors:number[], duration:number){
    console.log("Turning on motors for: "+duration+" seconds");
    let cycleInterval;

    /** First we configure the intensity of the motors on the wearable data object **/
    this.defineMotorIntensity(numberOfMotors);

    /** Then we turn on the motors with the duration specified **/
    // Start interval: Send data and shift bytes every 0.1 seconds
    cycleInterval = setInterval(this.shiftByte(), 0.1);

    // Send byte array to wearable.
    this.ble.writeWithoutResponse(this.wearable.id, this.VIB_SERVICE, this.VIB_CHARACTERISTIC_MOTORS_ON, this.dataWearable.buffer)
      .then((sucess)=>{
        console.log("Data sucessfully writed ",sucess);
        console.log("Setting time out of "+duration+" seconds");
        let savedThis = this;
        setTimeout(function(){
          savedThis.disconnectWearable();
        },1000*duration);

      })
      .catch((error)=>{
        console.log("Error writing on the wearable: ", error);
      });


    //this.scanTimeOut = setTimeout(this.disconnectWearable(), 1000*duration, 'Turn on motors complete');

  }

  /**
   * Receives an array with the intensity of each motor and configures
   * the wearable object to act like that frecuencies, returns the wearable
   * data object
   * @param {number[]} numberOfMotors
   * @returns {Uint8Array}
   */
  private defineMotorIntensity(numberOfMotors:number[]){
    for(let iterator in numberOfMotors){
      let intensityIterator;
      switch(numberOfMotors[iterator]){
        case 0:{
          /** In this case the motor is off **/
          this.dataWearable[iterator] = 0x00;
          break;
        }
        case 0.5:{
          /** In this case the motor is half on (just lights) **/
          this.dataWearable[iterator] = 0x80;
          break;
        }
        case 1:{
          /** In this case the motor is full power on **/
          this.dataWearable[iterator] = 0xff;
          break;
        }
      }
    }
    return this.dataWearable;
  }

  /**
   * If not connected already, connects to the wearable
   */
  public connectToWearable(){
    console.log("Connecting to the wearable");
    this.connectToBle();
  }

  /**
   * If connected to the wearable, disconnects
   */
  public disconnectWearable(){
    console.log("Disconnecting from the wearable");
    this.ble.disconnect(this.WEARABLE_UID)
      .then((success)=>{
        console.log("Disconection from wearable successfull ", success);
        let toast = this.toastCtrl.create({
          message: 'Disconection from wearable successfull',
          duration: 1500,
          position: 'middle'
        });
        toast.present();
        this.bleConnected.emit(false);
      })
      .catch((error)=>{
        console.log("Error while trying to disconnect from the wearable ",error);
      })
  }


}
