import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3), this.forbiddenUsernameValidator]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]], 
        fullName: ['', Validators.required],
        identityCard: [''],
        passport: [''],
        dateOfBirth: [''],
        nationality: [''],
        roles: [['ROLE_USER']] 
      },
      { validator: this.passwordMatchValidator }
    );
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = { ...this.registerForm.value };
      delete formData.confirmPassword; // Không cần gửi confirmPassword lên server

      this.authService.register(formData).subscribe({
        next: () => {
          alert('Đăng ký thành công!');
          this.registerForm.reset();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error?.message || 'Có lỗi xảy ra khi đăng ký!';
        }
      });
    } else {
      this.errorMessage = 'Vui lòng kiểm tra lại thông tin!';
    }
  }


  forbiddenUsernameValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return /admin/i.test(control.value) ? { 'forbiddenUsername': true } : null;
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }


  get usernameErrors() {
    const control = this.registerForm.get('username');
    if (control && control.errors && control.touched) {
      if (control.errors['required']) return 'Tên đăng nhập là bắt buộc';
      if (control.errors['minlength']) return 'Tên đăng nhập phải có ít nhất 3 ký tự';
      if (control.errors['forbiddenUsername']) return 'Tên đăng nhập không được chứa từ admin';
    }
    return '';
  }

  get emailErrors() {
    const control = this.registerForm.get('email');
    if (control && control.errors && control.touched) {
      if (control.errors['required']) return 'Email là bắt buộc';
      if (control.errors['email']) return 'Email không hợp lệ';
    }
    return '';
  }

  get passwordErrors() {
    const control = this.registerForm.get('password');
    if (control && control.errors && control.touched) {
      if (control.errors['required']) return 'Mật khẩu là bắt buộc';
      if (control.errors['minlength']) return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return '';
  }

  get confirmPasswordErrors() {
    const control = this.registerForm.get('confirmPassword');
    if (control && control.touched) {
      if (control.errors?.['required']) return 'Xác nhận mật khẩu là bắt buộc';
      if (this.registerForm.errors?.['passwordMismatch']) return 'Mật khẩu không khớp';
    }
    return '';
  }

  get phoneErrors() {
    const control = this.registerForm.get('phone');
    if (control && control.errors && control.touched) {
      if (control.errors['required']) return 'Số điện thoại là bắt buộc';
      if (control.errors['pattern']) return 'Số điện thoại phải có 10-11 chữ số';
    }
    return '';
  }

  get fullNameErrors() {
    const control = this.registerForm.get('fullName');
    if (control && control.errors && control.touched) {
      if (control.errors['required']) return 'Họ tên là bắt buộc';
    }
    return '';
  }
}
