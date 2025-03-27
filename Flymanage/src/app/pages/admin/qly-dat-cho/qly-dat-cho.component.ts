import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../../services/admin/booking.service';
import { Booking } from '../../../model/booking.interface';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FlightService, Flight } from '../../../services/admin/flight.service';
import { UserService } from '../../../services/admin/user.service';
import { PersonDTO, ERole } from '../../../model/user.interface';
import { AircraftService } from '../../../services/admin/aircraft.service';
import { AircraftDTO } from '../../../model/aircraft.interface';

interface Seat {
  code: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-qly-dat-cho',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzSelectModule,
    NzModalModule,
    NzFormModule,
    NzInputNumberModule
  ],
  templateUrl: './qly-dat-cho.component.html',
  styleUrl: './qly-dat-cho.component.css'
})
export class QlyDatChoComponent implements OnInit {
  bookings: Booking[] = [];
  newBooking: Booking = this.createEmptyBooking();
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  flights: Flight[] = [];
  passengers: PersonDTO[] = [];
  aircrafts: AircraftDTO[] = [];
  isModalVisible = false;
  isEditing = false;
  isLoading = false;
  bookingForm: FormGroup;
  availableSeats: Seat[] = [];

  constructor(
    private bookingService: BookingService,
    private flightService: FlightService,
    private userService: UserService,
    private aircraftService: AircraftService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      id: [null],
      bookingDate: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      seatClass: [null, [Validators.required]],
      status: [null, [Validators.required]],
      flightId: [null, [Validators.required]],
      passengerId: [null, [Validators.required]],
    });
    this.loadFlights();
    this.loadAircrafts();
  }

  ngOnInit(): void {
    this.loadBookings();
    this.loadPassengers();
    console.log('Bookings:', this.bookings);
    console.log('Passengers:', this.passengers);
    console.log('Flights:', this.flights);
  }

  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe((data: Booking[]) => {
      this.bookings = data;
      this.total = data.length;
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.loadPassengers();
    this.loadFlights();
    this.isModalVisible = true;
    this.bookingForm.reset();
  }

  openEditModal(booking: Booking) {
    this.isEditing = true;
    this.loadPassengers();
    this.loadFlights();
    this.isModalVisible = true;
    console.log('Editing booking:', booking);
    this.bookingForm.patchValue({
      id: booking.id,
      bookingDate: booking.bookingDate,
      price: booking.price,
      seatClass: booking.seatClass,
      status: booking.status,
      flightId: booking.flightId,
      passengerId: booking.passengerId
    });
  }

  handleCancel() {
    this.isModalVisible = false;
  }

  handleOk() {
    if (this.bookingForm.valid) {
      this.isLoading = true;
      const bookingData = this.bookingForm.value;
      
      if (this.isEditing) {
        const bookingId = this.bookingForm.get('id')?.value;
        this.bookingService.updateBooking(bookingId, bookingData).subscribe({
          next: () => {
            this.loadBookings();
            this.isModalVisible = false;
          },
          error: (error) => {
            console.error('Error updating booking:', error);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else {
        this.bookingService.createBooking(bookingData).subscribe({
          next: () => {
            this.loadBookings();
            this.isModalVisible = false;
          },
          error: (error) => {
            console.error('Error creating booking:', error);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    }
  }

  deleteBooking(id: number): void {
    this.bookingService.deleteBooking(id).subscribe(() => {
      this.bookings = this.bookings.filter(item => item.id !== id);
    });
  }

  loadFlights() {
    this.flightService.getFlights().subscribe({
      next: (data) => {
        this.flights = data;
      },
      error: (error) => {
      }
    });
  }

  loadPassengers(): void {
    this.userService.getPersonsByRole(ERole.ROLE_USER)
      .subscribe({
        next: (users) => {
          this.passengers = users;
          console.log('Loaded passengers:', this.passengers);
        },
        error: (error) => {
          console.error('Lỗi khi tải danh sách hành khách:', error);
        }
      });
  }

  loadAircrafts(): void {
    this.aircraftService.getAllAircraft().subscribe(data => {
      this.aircrafts = data;
    });
  }

  getAvailableSeats(flightId: number): Seat[] {
    const selectedFlight = this.flights.find(f => f.id === flightId);
    const aircraft = this.aircrafts.find(a => a.id === selectedFlight?.aircraftId);
    if (!selectedFlight || !aircraft) return [];

    const seats: Seat[] = [];
    const bookedSeats = this.bookings
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
  getPassengerInfo(passengerId: number): string {
    if (!this.passengers) {

      return 'Loading...';
    }

    const passenger = this.passengers.find(p => p.id === passengerId);
    if (!passenger) {
      return 'Not found';
    }
    return `${passenger.fullName} - ${passenger.identityCard}`;
  }

  getFlightInfo(flightId: number): string {
    if (!this.flights) {

      return 'Loading...';
    }


    const flight = this.flights.find(f => f.id === flightId);
    if (!flight) {
      return 'Not found';
    }
    return `CB${flight.id}: ${flight.departureAirportName} → ${flight.arrivalAirportName}`;
  }

  createEmptyBooking(): Booking {
    return {
      id: 0,
      bookingDate: new Date().toISOString(),
      price: 0,
      bookingCode: '',
      seatClass: '',
      status: 0,
      flightId: 0,
      passengerId: 0,
      passengerName: ''
    };
  }

  onFlightChange(flightId: number): void {
    this.availableSeats = this.getAvailableSeats(flightId);
  }
}
