import { Component, OnInit } from '@angular/core';
import { ScheduleService } from './../../services/schedule-services/schedule.service';
import { ConvertTimeService } from './../../services/convertTimeServices/convert-time.service';
import { ActivatedRoute } from "@angular/router";
import { BookingRequest } from 'src/app/models/bookingRequest';
import { Schedule } from 'src/app/models/schedule';
import { Time } from 'src/app/models/time';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  private ROLE: string;
  private data: any;
  private isLoading: boolean = true;
  constructor(
    private scheduleService: ScheduleService,
    private convertTimeService: ConvertTimeService,
    private route: ActivatedRoute
  ) { }
  private dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  private dates: number[] = [];
  private open_confirm: boolean = false;
  private open_notif: boolean = false;
  private open_update: boolean = false;

  private userdoctor: string;
  private currentDate: number;

  private scheduleResponse: any;
  private message: string;
  private schedules: any[] = [];
  private times: any[] = [];
  private weeks: string[] = [];

  private weekSelected: number = 0;
  private actionType: String = "default";

  private timeSelected: Time[] = [];
  private timeBook:any;
  private doctor:any;
  ngOnInit() {
    this.message = null;
    var date = new Date();
    var dateToInt = new Date((date.getMonth() + 1) + "/" + date.getDay() + "/" + date.getFullYear()).getTime();
    this.currentDate = new Date().getDay();

    // this.dayName = this.sortArrayByDay(this.dayName,this.currentDate);
    this.ROLE = JSON.parse(localStorage.getItem("token")).role[0].authority;
    if (this.ROLE == "ROLE_DOCTOR") {
      this.scheduleService.getSchedule(this.weekSelected).subscribe(data => {
        console.log(data);
        this.doctor = data.doctor;
        if (data.scheduleEntity == null) {
          this.message = "Not found schedule";
        }
        else {
          for (let index = 0; index < data.dayResponses[0].timeResponses.length; index++) {
            this.dates[index] = data.dayResponses[0].timeResponses[index].startTime;
          }
          for (let index = 0; index < data.scheduleEntity.preBooking; index++) {
            if (index == 0)
              this.weeks[index] = "This week";
            else if (index == 1)
              this.weeks[index] = "Next week";
            else
              this.weeks[index] = index + 1 + " week later";
          }
          var length = (data.scheduleEntity.endAt - data.scheduleEntity.startAt) / data.scheduleEntity.timePerAppointment;
          for (var i = 0; i < length + 1; i++) {
            this.times[i] = data.scheduleEntity.startAt + data.scheduleEntity.timePerAppointment * i;
          }
          this.schedules = data.dayResponses;
          console.log(this.schedules);
        }
        this.data = data;
        this.isLoading = false;
      },
        error => {
          console.log(error);
          this.isLoading = false;
        })
    }
    else {
      this.userdoctor = this.route.snapshot.paramMap.get("userdoctor");
      this.scheduleService.getScheduleByUsername(this.userdoctor,this.weekSelected).subscribe(data => {
        console.log(data);
        this.doctor = data.doctor;
        if (data.scheduleEntity == null) {
          this.message = "Not found schedule";
        }
        else {
          for (let index = 0; index < data.dayResponses[0].timeResponses.length; index++) {
            this.dates[index] = data.dayResponses[0].timeResponses[index].startTime;
          }
          for (let index = 0; index < data.scheduleEntity.preBooking; index++) {
            if (index == 0)
              this.weeks[index] = "This week";
            else if (index == 1)
              this.weeks[index] = "Next week";
            else
              this.weeks[index] = index + 1 + " week later";
          }
          var length = (data.scheduleEntity.endAt - data.scheduleEntity.startAt) / data.scheduleEntity.timePerAppointment;
          for (var i = 0; i < length + 1; i++) {
            this.times[i] = data.scheduleEntity.startAt + data.scheduleEntity.timePerAppointment * i;
          }
          this.schedules = data.dayResponses;
          console.log(this.schedules);
        }
        this.data = data;
        this.isLoading = false;
      },
        error => {
          console.log(error);
          this.isLoading = false;
        })
    }
    this.isLoading = false;

    console.log(this.currentDate);

    console.log(this.dayName);
  }

  public changeWeek(index) {
    this.weekSelected = index;
    this.ngOnInit();
  }
  public toggleNotifDialog() {
    this.open_notif = !this.open_notif;
  }

  public setOpenNotif(status) {
    this.open_notif = status;
  }

  public toggleConfirmDialog(time) {
    this.timeBook = null;
    this.open_confirm = !this.open_confirm;
    if(time!=null){
      this.timeBook = time;
    }
  }

  public setOpenConfirm(status) {
    this.open_confirm = status;
  }

  public toggleUpdateDialog() {
    this.open_update = !this.open_update;
  }

  public setOpenUpdate(status) {
    this.open_update = status;
  }

  public bookAppointment() {
    var bookingRequest = new BookingRequest(null,this.timeBook);
    this.scheduleService.bookAppointment(this.doctor.account.account.username,bookingRequest).subscribe(data=>{
      // console.log(data);
      this.ngOnInit();
    },
    error=>{
      console.log(error);
    })
  }

  public addTime(time) {
    var index = this.timeSelected.indexOf(time);
    if (index > -1) {
      this.timeSelected.splice(index, 1);
    } else {
      this.timeSelected[this.timeSelected.length] = time;
    }
  }

  public changeActionType(type) {
    this.actionType = type;
  }

  public addTimeBusy() {
    this.scheduleService.setTimeBusy(this.actionType, this.timeSelected).subscribe(data => {
      console.log(data);
      this.ngOnInit();
      this.timeSelected = [];
    },
      error => {
        console.log(error);
      })
  }
}
