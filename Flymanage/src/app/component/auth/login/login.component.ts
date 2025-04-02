import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, NzModalModule, NzFormModule, NzInputModule, NzButtonModule, NzMessageModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isForgotPasswordVisible = false;
  forgotPasswordForm: FormGroup;
  otpForm: FormGroup;
  showOtpForm = false;
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private message: NzMessageService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.id.toString());
            localStorage.setItem('fullName', response.fullName);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('roles', JSON.stringify(response.roles));
            localStorage.setItem('email', response.email);

            this.authService.setLoggedIn(true);
            this.authService.setFullName(response.fullName);
            this.authService.setRoles(response.roles || []);
            this.authService.setEmail(response.email);
            
            alert(`Chào mừng, ${response.fullName}!`);
            this.router.navigate(['/welcome']);
          } else {
            this.errorMessage = 'Đăng nhập không thành công';
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.errorMessage = 'Sai tài khoản hoặc mật khẩu!';
        }
      });
    } else {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin!';
    }
  }

  showForgotPasswordModal(): void {
    this.isForgotPasswordVisible = true;
    this.showOtpForm = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.forgotPasswordForm.reset();
    this.otpForm.reset();
  }

  handleCancel(): void {
    this.isForgotPasswordVisible = false;
  }

  onSubmitEmail(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;
      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.successMessage = response;
          this.showOtpForm = true;
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.error;
        }
      });
    }
  }

  onSubmitOtp(): void {
    if (this.otpForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;
      const otp = this.otpForm.get('otp')?.value;
      
      this.authService.resetPassword(email, otp).subscribe({
        next: (response) => {
          this.successMessage = response;
          this.message.success('Mật khẩu mới đã được gửi đến email của bạn');
          setTimeout(() => {
            this.isForgotPasswordVisible = false;
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error;
        }
      });
    }
  }
}
