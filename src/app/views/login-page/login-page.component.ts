import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  loginErrors:{email:string; username: string; password: string;} = {
    email: '',
    username: '',
    password: '',
  }

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  onLoginSubmit() {
    this.loginErrors = {
      email: '',
      username: '',
      password: '',
    }

    let hasError = false;

    if (!this.username) {
      this.loginErrors.username = 'Please enter your email address or username';
      this.clearError('username');
      hasError= true;
    } 

    if (!this.password) {
      this.loginErrors.password = 'Please enter your password';
      this.clearError('password');
      hasError= true;
    } 

    if (hasError) return;

    const credentials = {
      username: this.username,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);
        console.log('Login successful!', res.token);
        this.router.navigate(['/dashboard']); 
        alert('Login successful!')
      },
      error: (err) => {
        this.loginErrors.username = 'Invalid username';
        this.clearError('username');
        this.loginErrors.password = 'The password you entered is incorrect';
        this.clearError('password');
        console.error('Login failed', err);
      }
    });
  }
  
  clearError(field: keyof typeof this.loginErrors, delay = 3000){
    setTimeout(() => {
      this.loginErrors[field] = '';
    }, delay);
  }

  togglePasswordVisibility(): void{
    this.showPassword = !this.showPassword;
  }

  loginSuccess(){
    this.toastr.success('Login successful!');
  }

  loginFailed(){
    this.toastr.error('Invalid credentials', 'Login Failed!');
  }
}
