import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-check-up',
  templateUrl: './patient-check-up.component.html',
  styleUrls: ['./patient-check-up.component.css']
})
export class PatientCheckUpComponent implements OnInit {


  private data:any;
  constructor() { }

  ngOnInit() {
  }

  public getResult(data){
    this.data = data;
  }
}
