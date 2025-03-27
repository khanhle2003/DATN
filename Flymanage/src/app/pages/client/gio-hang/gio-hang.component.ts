import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/admin/booking.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Booking } from '../../../model/booking.interface';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { RouterModule } from '@angular/router';
import { PaymentVNpayService } from '../../../services/client/paymentVNpay.service';
import { SendBookingCodeService } from '../../../services/client/sendbookingcode.service';
@Component({
  selector: 'app-gio-hang',
  standalone: true,
  imports: [
    CommonModule, 
    NzTableModule, 
    NzEmptyModule, 
    NzTagModule, 
    NzButtonModule,
    NzMessageModule,
    NzPopconfirmModule,
    FormsModule,
    NzCheckboxModule,
    RouterModule
  ],
  templateUrl: './gio-hang.component.html',
  styleUrl: './gio-hang.component.css'
})
export class GioHangComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;
  isAllChecked = false;
  
  constructor(
    private bookingService: BookingService,
    public authService: AuthService,
    private router: Router,
    private message: NzMessageService,
    private paymentService: PaymentVNpayService,
    private sendBookingCodeService: SendBookingCodeService
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.message.warning('Vui lòng đăng nhập để xem giỏ hàng');
      return;
    }

    const passengerId = localStorage.getItem('userId');
    if (passengerId) {
      this.loadBookings(parseInt(passengerId));
    }
  }

  loadBookings(passengerId: number) {
    this.bookingService.getBookingsByPassenger(passengerId).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
      },
      error: (error) => {
        console.error('Lỗi khi tải đơn hàng:', error);
      }
    });
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 0: return 'warning';
      case 1: return 'success';
      case 2: return 'error';
      default: return 'default';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Chờ xác nhận';
      case 1: return 'Đã xác nhận';
      case 2: return 'Đã hủy';
      default: return 'Không xác định';
    }
  }

  deleteBooking(id: number): void {
    this.loading = true;
    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(booking => booking.id !== id);
        this.message.success('Xóa đơn hàng thành công');
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi xóa đơn hàng:', error);
        this.message.error('Xóa đơn hàng thất bại');
        this.loading = false;
      }
    });
  }

  checkAll(value: boolean): void {
    this.bookings.forEach(booking => {
      if (booking.status === 0) {
        booking.checked = value;
      }
    });
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const validBookings = this.bookings.filter(booking => booking.status === 0);
    this.isAllChecked = validBookings.length > 0 && validBookings.every(booking => booking.checked);
  }

  getCheckedCount(): number {
    return this.bookings.filter(booking => booking.checked).length;
  }

  calculateTotal(): number {
    return this.bookings
      .filter(booking => booking.checked)
      .reduce((sum, booking) => sum + booking.price, 0);
  }

  proceedToPayment(): void {
    const selectedBookings = this.bookings.filter(booking => booking.checked);
    const totalAmount = this.calculateTotal();
    
    if (selectedBookings.length === 0) {
      this.message.warning('Vui lòng chọn ít nhất một đơn hàng để thanh toán');
      return;
    }
    
    const bookingIds = selectedBookings.map(b => b.id).join(',');
    
    this.loading = true;
      
    this.paymentService.initiateVnPayPayment(totalAmount, bookingIds).subscribe({
      next: (response) => {
        const paymentWindow = window.open(response, '_self');
        if (!paymentWindow) {
          this.message.error('Không thể mở trang thanh toán. Vui lòng kiểm tra cài đặt popup blocker.');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi khởi tạo thanh toán:', error);
        this.message.error('Không thể khởi tạo thanh toán. Vui lòng thử lại sau.');
        this.loading = false;
      }
    });
  }

  sendBookingCode(bookingId: number) {
    const email = localStorage.getItem('email');
    if (!email) {
      this.message.error('Không tìm thấy email');
      return;
    }
    this.sendBookingCodeService.sendBookingCode(bookingId, email).subscribe({
      next: () => {
        this.message.success('Mã đặt vé đã được gửi đến email của bạn');
      },
      error: (error) => {
        this.message.error('Có lỗi xảy ra khi gửi mã đặt vé');
        console.error(error);
      }
    });
  }
}
