import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentVNpayService } from '../../../services/client/paymentVNpay.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from '../../../services/admin/payment.service';

@Component({
  selector: 'app-thanh-toan',
  standalone: true,
  imports: [NzResultModule, NzSpinModule, NzButtonModule],
  templateUrl: './thanh-toan.component.html',
  styleUrl: './thanh-toan.component.css'
})
export class ThanhToanComponent implements OnInit {
  paymentSuccess = false;
  loading = true;
  apiUrl = '/prx/api';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentVNpayService,
    private message: NzMessageService,
    private http: HttpClient,
    private adminPaymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('VNPay response params:', params);

      const vnp_ResponseCode = params['vnp_ResponseCode'];
      const bookingIdsStr = params['vnp_OrderInfo'];
      
      console.log('Response code:', vnp_ResponseCode);
      console.log('Booking IDs string:', bookingIdsStr);
      
      if (vnp_ResponseCode === '00') {

        this.paymentSuccess = true;

        if (bookingIdsStr) {
          try {

            let bookingIds: number[] = [];
            
            if (bookingIdsStr.includes('Thanh toan cac don hang:')) {
              const extractedPart = bookingIdsStr.split('Thanh toan cac don hang:')[1].trim();
              bookingIds = extractedPart.split(',').map((id: string) => parseInt(id.trim()));
            } else {
              bookingIds = bookingIdsStr.split(',').map((id: string) => parseInt(id.trim()));
            }
            
            bookingIds = bookingIds.filter(id => !isNaN(id));
            
            console.log('Parsed booking IDs:', bookingIds);
            

            if (bookingIds.length > 0) {

              const newPayment = {
                bookingIds: bookingIds,
                paymentMethod: 'vnpay',
                amount: params['vnp_Amount'] ? parseInt(params['vnp_Amount']) / 100 : 0, 
                transactionNo: params['vnp_TransactionNo'],
                paymentDate: new Date(),
                status: 'Completed'
              };

              this.adminPaymentService.createPayment(newPayment).subscribe({
                next: (paymentResponse) => {
                  console.log('Payment created:', paymentResponse);
                },
                error: (error) => {
                  console.error('Error creating payment:', error);
                }
              });

              this.http.post(`${this.apiUrl}/payments/update-booking-status`, {
                bookingIds: bookingIds,
                status: 1
              }).subscribe({
                next: (response) => {
                  console.log('Update response:', response);
                  this.message.success('Cập nhật trạng thái đơn hàng thành công');
                  this.loading = false;
                },
                error: (error) => {
                  console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
                  console.error('Error details:', error.error);
                  this.loading = false;
                }
              });
            } else {
              console.warn('Không tìm thấy ID đơn hàng hợp lệ');
              this.loading = false;
            }
          } catch (error) {
            console.error('Lỗi khi xử lý chuỗi bookingIds:', error);
            this.loading = false;
          }
        } else {
          console.warn('Không có thông tin đơn hàng');
          this.loading = false;
        }
      } else {

        this.paymentSuccess = false;
        this.message.error('Thanh toán không thành công');
        this.loading = false;
      }
    });
  }

  goToBookings(): void {
    this.router.navigate(['/client/gio-hang']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
