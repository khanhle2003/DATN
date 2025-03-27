import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]]
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
  
}
