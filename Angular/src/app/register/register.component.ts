import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private fb:FormBuilder, private service:AuthService) { }
  registerForm=this.fb.group({
    name:new FormControl('',[Validators.required]),
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required,Validators.minLength(6)]),
    cpassword:new FormControl('',[Validators.required,Validators.minLength(6)]),
    },
    {
      validators:this.mustmatch("password", "cpassword")
    })
  ngOnInit(): void {
  }
register(){
console.log(this.registerForm.value);
this.service.Register(this.registerForm.value).subscribe((result)=>{
  console.log(result);
  
})
}
mustmatch(password:any,cpassword:any){
  return (formGroup:FormGroup)=>{
    const passwordcontrol=formGroup.controls[password]
    const cpasswordcontrol=formGroup.controls[cpassword]
    if(cpasswordcontrol.errors && !cpasswordcontrol.errors['mustmatch']){
      return 
    }
    if(passwordcontrol.value!=cpasswordcontrol.value){
      cpasswordcontrol.setErrors({mustmatch:true})
    }else{
      cpasswordcontrol.setErrors(null)
    }
  }
}

get controls(){
  return this.registerForm.controls
}

}


