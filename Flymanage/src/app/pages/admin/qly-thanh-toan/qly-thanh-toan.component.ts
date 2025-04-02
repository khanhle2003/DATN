import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../../services/admin/payment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Payment, PaymentCreateDTO } from '../../../model/payment.interface';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { BookingService } from '../../../services/admin/booking.service';
import { UserService } from '../../../services/admin/user.service';
import { PersonDTO } from '../../../model/user.interface';
import { NzTagModule } from 'ng-zorro-antd/tag';
@Component({
  selector: 'app-qly-thanh-toan',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputNumberModule,
    NzSelectModule,
    NzIconModule,
    NzPopconfirmModule,
    NzTagModule
  ],
  templateUrl: './qly-thanh-toan.component.html',
  styleUrls: ['./qly-thanh-toan.component.css']
})
export class QlyThanhToanComponent implements OnInit {
  payments: Payment[] = [];
  paymentForm!: FormGroup;
  isModalVisible = false;
  isLoading = false;
  isEditing = false;
  selectedId?: number;
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  bookings: any[] = [];
  passengers: PersonDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private bookingService: BookingService,
    private message: NzMessageService,
    private userService: UserService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadBookings();
    this.loadPayments();
    this.loadPassengers();
  }

  createForm(): void {
    this.paymentForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0)]],
      method: [null, [Validators.required]],
      bookingIds: [[], [Validators.required]]
    });
  }

  loadPayments(): void {
    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.total = data.length;
      },
      error: () => {
        this.message.error('Lỗi khi tải dữ liệu thanh toán');
      }
    });
  }

  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe({
      next: (response) => {
        console.log('Bookings loaded:', response);
        this.bookings = response;
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.message.error('Không thể tải danh sách đặt chỗ');
      }
    });
  }

  loadPassengers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.passengers = users;
      },
      error: () => {
        this.message.error('Lỗi khi tải danh sách hành khách');
      }
    });
  }

  getPassengerName(passengerId: number): string {
    const passenger = this.passengers.find(p => p.id === passengerId);
    return passenger ? passenger.fullName : 'N/A';
  }

  openAddModal(): void {
    this.isEditing = false;
    this.paymentForm.reset();
    this.isModalVisible = true;
  }

  openEditModal(payment: Payment): void {
    this.isEditing = true;
    this.selectedId = payment.id;
    this.paymentForm.patchValue({
      amount: payment.amount,
      method: payment.method,
      bookingIds: payment.bookingIds
    });
    this.isModalVisible = true;
  }

  handleOk(): void {
    
    if (this.paymentForm.valid) {
      this.isLoading = true;
      const paymentData: PaymentCreateDTO = {
        ...this.paymentForm.value,
        paymentDate: new Date()
          };


      if (this.isEditing && this.selectedId) {
        console.log('Updating payment with ID:', this.selectedId);
        this.paymentService.updatePayment(this.selectedId, paymentData).subscribe({
          next: () => {
            this.message.success('Cập nhật thanh toán thành công');
            this.handleSuccess();
          },
          error: (error) => {
            this.message.error(error.error.message);
            this.handleError();
          }
        });
      } else {

        this.paymentService.createPayment(paymentData).subscribe({
          next: () => {
            this.message.success('Thêm thanh toán thành công');
            this.handleSuccess();
          },
          error: (error) => {
            this.handleError();
          }
        });
      }
    } else {
      console.log('Form is invalid');
      console.log('Amount valid:', this.paymentForm.get('amount')?.valid);
      console.log('Method valid:', this.paymentForm.get('method')?.valid);
      console.log('BookingIds valid:', this.paymentForm.get('bookingIds')?.valid);
      Object.values(this.paymentForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.paymentForm.reset();
  }

  deletePayment(id: number): void {
    this.paymentService.deletePayment(id).subscribe({
      next: () => {
        this.message.success('Xóa thanh toán thành công');
        this.loadPayments();
      },
      error: () => {
        this.message.error('Lỗi khi xóa thanh toán');
      }
    });
  }

  private handleSuccess(): void {
    this.isLoading = false;
    this.isModalVisible = false;
    this.loadPayments();
    this.paymentForm.reset();
  }

  private handleError(): void {
    this.isLoading = false;
    this.message.error('Có lỗi xảy ra');
  }

  getBookingCode(bookingId: number): string {
    const booking = this.bookings?.find(b => b.id === bookingId);
    if (!booking || !booking.bookingCode) {
      return 'Chưa có mã';
    }
    return booking.bookingCode;
  }
}
