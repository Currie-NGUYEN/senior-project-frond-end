import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserServicesService } from './../../services/user-services/user-services.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  @Input() open : boolean;

  @Output() closeDialog = new EventEmitter();

  @Output() tranforDataLogin = new EventEmitter();

  private open_register:boolean = false;
  private username:string='';
  private password:string='';
  private errorMessage:string='';
  private isCoverPassword:boolean = true;
  private data:any;

  constructor(
    private userServicesService: UserServicesService,
    private spinner: NgxSpinnerService,
    private router: Router
    ) { 
    
  }

  ngOnInit() {
    
  }

  public toggleLoginDialog(){
    this.open = !this.open;
    if(this.open===false){
      this.errorMessage='';
    }
    this.closeDialog.emit(this.open);
  }

  public toggleRegisterDialog(){
    this.open_register = !this.open_register;
    this.toggleLoginDialog();
  }

  public setOpenRegister(status){
    this.open_register = status;
  }

  public registerSuccess(){
    this.errorMessage="Create new account successful."
    this.toggleLoginDialog();
  }

  public login(){
    this.spinner.show();
    this.toggleLoginDialog();
    if(this.validate()!=null)
    {
      this.errorMessage = this.validate();
      this.toggleLoginDialog();
      this.spinner.hide();
    }
    else {
      this.userServicesService.login(this.username,this.password).subscribe(data=>{
        // console.log(data);
        this.tranforDataLogin.emit(data);
        this.spinner.hide();
        localStorage.setItem("token",JSON.stringify(data));
        for(var i =0; i<data.role.length;i++){
          if(data.role[i].authority==='ROLE_ADMIN'){
            this.router.navigateByUrl('/admin');
            break;
          }
          else if(data.role[i].authority==='ROLE_DOCTOR'){
            this.router.navigateByUrl('/doctor');
            break;
          }
          else{
            this.router.navigateByUrl('/patient');
            break;
          }
        }
      },
      error=>{
        console.log("error", error.status);
        this.spinner.hide();
        if(error.status===401){
          this.errorMessage='Username or Password is incorrect.'
        }
        else{
          this.errorMessage='Error code '+ error.status;
        }
        this.toggleLoginDialog();
      });
    }
  }

  public validate():string{
    if(this.username==='' && this.password===''){
      return 'Username and Password are blank.'
    }else if(this.username===''){
      return 'Username are blank.'
    }else if(this.password===''){
      return 'Password are blank.'
    }
    return null;
  }

  public toggleCoverPassword() {
    this.isCoverPassword= !this.isCoverPassword;
  }

}
