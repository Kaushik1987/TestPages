import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { equalto } from "./equal-validation";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent 
{
  form: FormGroup;
  constructor(fb: FormBuilder)
  {
    this.form = fb.group({ 
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(2)]],
      emailconfirm:['', [Validators.required, Validators.email, Validators.minLength(2)]],
      // matching_password : fb.group({
      //   password: ['',[Validators.required]],
      //   confirmPassword: ['',[Validators.required]]
      // })
      password: ['',[Validators.required]],
      confirmPassword: ['',[Validators.required]]
    },
    {
        validator: 
          [
              equalto('password', 'confirmPassword'), 
              equalto('email', 'emailconfirm')
          ]
    })
  }
  title = 'app';
}
