import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { PersonDTO } from '../../../model/user.interface';
import { UserService } from '../../../services/admin/user.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../services/auth/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { take, timestamp } from 'rxjs/operators';
import { OtpService } from '../../../services/auth/otp.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-thong-tin-tai-khoan',
  standalone: true,
  imports: [NzTableModule, NzCardModule, NzAvatarModule, NzListModule, NzIconModule, NzSpinModule, NzButtonModule, NzFormModule, NzInputModule, NzDatePickerModule, NzMessageModule, FormsModule, CommonModule, NzModalModule, ReactiveFormsModule  ],
  templateUrl: './thong-tin-tai-khoan.component.html',
  styleUrl: './thong-tin-tai-khoan.component.css'
})
export class ThongTinTaiKhoanComponent implements OnInit {
  @ViewChild('editModal') editModal!: TemplateRef<any>;
  @ViewChild('changePasswordModal') changePasswordModal!: TemplateRef<any>;

  user: PersonDTO = {} as PersonDTO;
  loading = true;
  isLoggedIn = false;
  isEditing = false;
  editForm: PersonDTO = {} as PersonDTO;
  passwordForm!: FormGroup;
  countdown = 0;
  private countdownSubscription?: Subscription;
  isOtpVerified = false;
  avatarUrl: string = '';
  timestamp = Date.now();
  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private otpService: OtpService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.initPasswordForm();
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      
      if (loggedIn) {
        const userId = localStorage.getItem('userId');
        
        if (userId) {
          this.loadUserData(Number(userId));
          this.loadAvatar(Number(userId));
        }
      } else {
        this.loading = false;
        this.message.warning('Vui lòng đăng nhập để xem thông tin tài khoản');
      }
    });
  }

  private loadUserData(userId: number): void {
    this.userService.getUser(userId).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  private loadAvatar(userId: number): void {
    this.userService.getAvatar(userId).subscribe({
      next: (avatarPath) => {
        if (avatarPath) {
          this.avatarUrl = avatarPath;
          this.user.avatar = this.avatarUrl;
        }
      },
      error: (error) => {
        this.avatarUrl = 'https://img.alicdn.com/tfs/TB1g.mWZAL0gK0jSZFtXXXQCXXa-200-200.svg'; 
      }
    });
  }

  startEditing(): void {
    this.editForm = { ...this.user };
    this.isEditing = true;
  }

  saveChanges(): void {
    this.loading = true;
    this.userService.updateUser(this.user.id, this.editForm).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.isEditing = false;
        this.loading = false;
        this.message.success('Cập nhật thông tin thành công');
      },
      error: (error) => {
        this.loading = false;
        this.message.error('Có lỗi xảy ra khi cập nhật thông tin');
      }
    });
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editForm = { ...this.user };
  }

  private initPasswordForm(): void {
    this.passwordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword) {
      return newPassword === confirmPassword ? null : { mismatch: true };
    }
    return null;
  }

  showChangePasswordModal(): void {
    this.passwordForm.patchValue({ email: this.user.email });
    
    this.modal.create({
      nzTitle: 'Đổi mật khẩu',
      nzContent: this.changePasswordModal,
      nzWidth: 800,
      nzOnOk: () => this.submitChangePassword(),
      nzOkText: 'Đổi mật khẩu',
      nzCancelText: 'Hủy'
    });
  }

  requestOTP(): void {
    if (this.passwordForm.get('email')?.valid) {
      const email = this.passwordForm.get('email')?.value;
      
      this.otpService.sendOtp(email).subscribe({
        next: () => {
          this.message.success('Mã OTP đã được gửi đến email của bạn');
          this.countdown = 60;
          this.countdownSubscription = interval(1000)
            .pipe(take(60))
            .subscribe(() => {
              this.countdown--;
              if (this.countdown === 0) {
                this.countdownSubscription?.unsubscribe();
              }
            });
        },
        error: (error: any) => {
          this.message.error('Không thể gửi mã OTP: ' + error.message);
        }
      });
    }
  }

  submitChangePassword(): void {
    if (this.passwordForm.invalid) {

      return;
    }
  
    const email = this.passwordForm.get('email')?.value;
    const otp = this.passwordForm.get('otp')?.value;
  
    console.log('Email:', email);
    console.log('OTP:', otp);
  
    const otpRequest = {
      email: email,
      otp: otp
    };
  
    console.log('Sending OTP verification request:', otpRequest);
  
    this.otpService.verifyOtp(otpRequest).subscribe({
      next: (response) => {
        console.log('OTP verification response:', response);
        
        if (response && response.success) {
          const changePasswordRequest = {
            username: this.user.username,
            oldPassword: this.passwordForm.get('oldPassword')?.value,
            newPassword: this.passwordForm.get('newPassword')?.value
          };
  
          console.log('Sending change password request for user:', this.user.username);
  
          this.userService.changePassword(changePasswordRequest).subscribe({
            next: (pwResponse) => {
              console.log('Password change response:', pwResponse);
              this.message.success('Đổi mật khẩu thành công');
              this.modal.closeAll();
              this.passwordForm.reset();
            },
            error: (pwError) => {
              console.error('Password change error:', pwError);

              if (pwError.message && pwError.message.includes('Http failure during parsing')) {
                this.message.success('Đổi mật khẩu thành công');
                this.modal.closeAll();
                this.passwordForm.reset();
              } else {
                this.message.error('Có lỗi xảy ra khi đổi mật khẩu: ' + (pwError.error?.message || pwError.message || 'Lỗi không xác định'));
              }
            }
          });
        } else {
          this.message.error('Xác thực OTP không thành công');
        }
      },
      error: (error) => {
        console.error('OTP verification error:', error);

        if (error.message && error.message.includes('Http failure during parsing')) {

          const changePasswordRequest = {
            username: this.user.username,
            oldPassword: this.passwordForm.get('oldPassword')?.value,
            newPassword: this.passwordForm.get('newPassword')?.value
          };
  
          this.userService.changePassword(changePasswordRequest).subscribe({
            next: (pwResponse) => {
              this.message.success('Đổi mật khẩu thành công');
              this.modal.closeAll();
              this.passwordForm.reset();
            },
            error: (pwError) => {
              console.error('Password change error:', pwError);
    
              if (pwError.message && pwError.message.includes('Http failure during parsing')) {
                this.message.success('Đổi mật khẩu thành công');
                this.modal.closeAll();
                this.passwordForm.reset();
              } else {
                this.message.error('Có lỗi xảy ra khi đổi mật khẩu: ' + (pwError.error?.message || pwError.message || 'Lỗi không xác định'));
              }
            }
          });
        } else {
          this.message.error('Lỗi xác thực OTP: ' + (error.error?.message || error.message || 'Lỗi không xác định'));
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.countdownSubscription?.unsubscribe();
  }

  showEditModal(): void {
    this.editForm = {
      ...this.user,
      email: this.user.email || '',
      fullName: this.user.fullName || '',
      phone: this.user.phone || '',
      identityCard: this.user.identityCard || '',
      passport: this.user.passport || '',
      dateOfBirth: this.user.dateOfBirth || '',
      nationality: this.user.nationality || ''
    };

    this.modal.create({
      nzTitle: 'Sửa thông tin tài khoản',
      nzContent: this.editModal,
      nzWidth: 800,
      nzOnOk: () => this.saveChanges(),
      nzOkText: 'Lưu thay đổi',
      nzCancelText: 'Hủy'
    });
  }

  onFileSelected(event: any): void {

    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.message.error('Kích thước file không được vượt quá 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.message.error('Vui lòng chọn file ảnh');
        return;
      }

      this.loading = true;
      this.userService.uploadAvatar(this.user.id, file)
        .subscribe({
          next: (response) => {
            this.user = response;
            this.loadAvatar(this.user.id); 
            this.message.success('Cập nhật ảnh đại diện thành công');
            this.timestamp = Date.now();
          },
          error: (error) => {
            this.message.error('Có lỗi xảy ra khi cập nhật ảnh đại diện');
            console.error('Upload error:', error);
          },
          complete: () => {
            this.loading = false;
          }
        });
    }
  }

  handleAvatarError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-avatar.png';
  }

}
