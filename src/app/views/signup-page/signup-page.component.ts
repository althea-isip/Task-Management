import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm, NgModel, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  signupData = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  }

  signupErrors = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  }
  
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  message: string = '';
  isError: boolean = false;
  
  
  constructor(private router: Router, private toastr: ToastrService) {
    
   }

  ngOnInit(): void {
  }

  togglePasswordVisibility(): void{
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void{
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  signup() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    this.signupErrors = {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    }

    let hasError = false;

    if (!this.signupData.email) {
      this.signupErrors.email = 'Email is required';
      hasError= true;
      this.clearError('email');
    } else if (!emailPattern.test(this.signupData.email)){
      this.signupErrors.email = 'Please enter a valid email address, e.g. jou@gmail.com';
      this.clearError('email');
      hasError =true;
    }

    if (!this.signupData.username) {
      this.signupErrors.username = 'The username field must not be empty';
      this.clearError('username');
      hasError= true;
    }

    if (!this.signupData.password) {
      this.signupErrors.password = 'Password is required';
      this.clearError('password');
      hasError= true;
    } 

    if (!this.signupData.confirmPassword) {
      this.signupErrors.confirmPassword = 'Confirm Password is required';
      this.clearError('confirmPassword');
      hasError= true;
    } else if (this.signupData.password !== this.signupData.confirmPassword) {
      this.signupErrors.confirmPassword = 'The password you entered does not match';
      this.clearError('confirmPassword');
      hasError= true;
    }

    if (!this.isPasswordValid(this.signupData.password)) {
      this.signupErrors.password =
        'The password must be at least 8 characters long';
        this.clearError('password');
      return;
    }


    if(hasError){
      this.isError = true;
      this.message = '';
      return;
    }
   
    this.isError = false;
    /* this.toastr.success('Signup successful! You can now log in.', 'Success') */
    this.message = 'Signup successful! You can now log in.';
    this.resetForm();

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  clearError(field: keyof typeof this.signupErrors, delay = 5000){
    setTimeout(() => {
      this.signupErrors[field] = '';
    }, delay);
  }

  resetForm() {
    this.signupData = {
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    };
  }

  isPasswordValid(password: string): boolean {
    /* const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password); */
    return password.length >= 8;
  }
}
