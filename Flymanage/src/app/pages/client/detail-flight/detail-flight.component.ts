import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink,Router } from '@angular/router';
import { Flight, FlightService } from '../../../services/admin/flight.service';
import { CommonModule } from '@angular/common';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { AuthService } from '../../../services/auth/auth.service';
import { BookingService } from '../../../services/admin/booking.service';
import { Booking, BookingCreateDTO } from '../../../model/booking.interface';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCardModule } from 'ng-zorro-antd/card';
import { AircraftService } from '../../../services/admin/aircraft.service';
import { AircraftDTO } from '../../../model/aircraft.interface';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { PaymentVNpayService } from '../../../services/client/paymentVNpay.service';
import { firstValueFrom } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PaymentService } from '../../../services/admin/payment.service';

interface Seat {
  code: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-detail-flight',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzRadioModule,
    RouterLink,
    NzDescriptionsModule,
    NzAlertModule,
    NzPageHeaderModule,
    NzCardModule,
    NzModalModule,
    NzGridModule,
    NzTabsModule
  ],
  templateUrl: './detail-flight.component.html',
  styleUrls: ['./detail-flight.component.css']
})
export class DetailFlightComponent implements OnInit {
  flight!: Flight;
  countdownMessage: string = '';
  isLoggedIn: boolean = false;
  isSeatModalVisible = false;
  selectedSeat: string | null = null;
  currentAction: 'buy' | 'cart' = 'cart';
  businessSeats: Seat[] = [];
  economySeats: Seat[] = [];
  aircraft: AircraftDTO | null = null;
  existingBookings: Booking[] = [];
  isFlightExpired: boolean = false;

  constructor(
    private flightService: FlightService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private bookingService: BookingService,
    private aircraftService: AircraftService,
    private paymentVNpayService: PaymentVNpayService,
    private message: NzMessageService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); 
    this.flightService.getFlight(id).subscribe(data => {
      this.flight = data; 
      this.updateCountdown();
      if (this.flight) {
        this.loadAircraftAndBookings();
      }
    });
    this.isLoggedIn = this.checkLoginStatus();
  }

  updateCountdown(): void {
    const arrivalTime = new Date(this.flight.arrivalTime).getTime();
    const now = new Date().getTime();
    
    this.isFlightExpired = arrivalTime < now;
    
    if (this.isFlightExpired) {
      this.countdownMessage = 'Chuyến bay hết hạn';
    } else {
      const durationMs = arrivalTime - now;
      const hours = Math.floor(durationMs / (60 * 60 * 1000));
      const minutes = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000));
      this.countdownMessage = `Còn lại: ${hours}h ${minutes}m`;
    }
  }

  formatPrice(price: number): string {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VNĐ';
  }
  calculateDuration(departure: string, arrival: string): string {
    const departureTime = new Date(departure).getTime();
    const arrivalTime = new Date(arrival).getTime();
    const durationMs = arrivalTime - departureTime;
    
    const hours = Math.floor(durationMs / (60 * 60 * 1000));
    const minutes = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  }

  checkLoginStatus(): boolean {
    return this.authService.isLoggedIn();
  }

  buy() {
    if (!this.isLoggedIn) {
      this.promptLogin();
    } else {
      console.log('Mua hàng thành công cho chuyến bay:', this.flight.flightCode);
    }
  }

  addToCart(seatCode: string) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.promptLogin();
      return;
    }

    const newBooking: Booking = {
      id: 0,
      bookingDate: new Date().toISOString(),
      price: this.flight.basePrice,
      bookingCode: `BK${Date.now()}`,
      seatClass: seatCode,
      status: 0,
      flightId: this.flight.id,
      passengerId: parseInt(userId),
      passengerName: ''
    };

    this.bookingService.createBooking(newBooking).subscribe({
      next: (response) => {
        alert('Thêm vào giỏ hàng thành công');
        this.isSeatModalVisible = false;
        this.loadAircraftAndBookings();
      },
      error: (error) => {
        alert('Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại.');
      }
    });
  }

  promptLogin() {
    alert('Bạn cần đăng nhập để thực hiện hành động này.');
  }
  goBack() {
    this.router.navigate(['/aboutus']);
  }

  loadAircraftAndBookings() {
    if (!this.flight) return;
    
    this.aircraftService.getAircraft(this.flight.aircraftId).subscribe(aircraft => {
      this.aircraft = aircraft;
      
      this.bookingService.getAllBookings().subscribe(bookings => {
        this.existingBookings = bookings.filter(b => b.flightId === this.flight?.id);
        console.log('Existing bookings:', this.existingBookings);
        this.initializeSeats();
      });
    });
  }

  initializeSeats() {
    if (!this.aircraft) return;

    this.businessSeats = [];
    for (let i = 1; i <= (this.aircraft.businessSeats || 0); i++) {
      const seatCode = `A-${i.toString().padStart(3, '0')}`;
      const isBooked = this.existingBookings.some(b => b.seatClass === seatCode);
      this.businessSeats.push({
        code: seatCode,
        isAvailable: !isBooked
      });
    }


    this.economySeats = [];
    for (let i = 1; i <= (this.aircraft.economySeats || 0); i++) {
      const seatCode = `B-${i.toString().padStart(3, '0')}`;
      const isBooked = this.existingBookings.some(b => b.seatClass === seatCode);
      this.economySeats.push({
        code: seatCode,
        isAvailable: !isBooked
      });
    }
    
  }

  showSeatSelectionModal(action: 'buy' | 'cart'): void {
    this.currentAction = action;
    this.isSeatModalVisible = true;
    this.selectedSeat = null;
  }

  handleSeatModalCancel() {
    this.isSeatModalVisible = false;
    this.selectedSeat = null;
  }

  handleSeatModalOk(): void {
    if (!this.selectedSeat) return;

    if (this.currentAction === 'buy') {
      this.proceedToPayment();
    } else {
      this.addToCart(this.selectedSeat);
    }
    this.isSeatModalVisible = false;
  }

  selectSeat(seatCode: string) {
    this.selectedSeat = seatCode;
  }

  async proceedToPayment() {
    if (!this.flight || !this.selectedSeat) return;

    if (!this.authService.isLoggedIn()) {
      this.message.error('Vui lòng đăng nhập để tiếp tục');
      return;
    }

    try {

      let totalAmount = this.flight.basePrice;
      if (this.selectedSeat.startsWith('B')) {
        totalAmount *= 1.5;
      }


      const booking: Booking = {
        id: 0,
        flightId: this.flight.id,
        seatClass: this.selectedSeat,
        bookingDate: new Date().toISOString(),
        status: 0,
        price: totalAmount,
        bookingCode: `BK${Date.now()}`,
        passengerId: parseInt(localStorage.getItem('userId') || '0'),
        passengerName: localStorage.getItem('username') || ''
      };

      const createdBooking = await firstValueFrom(
        this.bookingService.createBooking(booking)
      );

      this.paymentVNpayService.initiateVnPayPayment(
        totalAmount,
        createdBooking.id.toString()
      ).subscribe(
        (paymentUrl: string) => {
          window.location.href = paymentUrl;
        },
        (error) => {
          this.message.error('Có lỗi xảy ra khi khởi tạo thanh toán');
          console.error(error);
        }
      );
    } catch (error) {
      this.message.error('Có lỗi xảy ra trong quá trình thanh toán');
      console.error(error);
    }
  }

  getAvailableSeats(flightId: number): Seat[] {
    const selectedFlight = this.flight;
    const aircraft = this.aircraft;
    if (!selectedFlight || !aircraft) return [];

    const seats: Seat[] = [];
    const bookedSeats = this.existingBookings
      .filter(b => b.flightId === flightId)
      .map(b => b.seatClass);

    const businessSeats = aircraft.businessSeats || 0;
    for (let i = 1; i <= businessSeats; i++) {
      const seatCode = `A-${i.toString().padStart(3, '0')}`;
      seats.push({
        code: seatCode,
        isAvailable: !bookedSeats.includes(seatCode)
      });
    }

    const economySeats = aircraft.economySeats || 0;
    for (let i = 1; i <= economySeats; i++) {
      const seatCode = `B-${i.toString().padStart(3, '0')}`;
      seats.push({
        code: seatCode,
        isAvailable: !bookedSeats.includes(seatCode)
      });
    }

    return seats;
  }
}
