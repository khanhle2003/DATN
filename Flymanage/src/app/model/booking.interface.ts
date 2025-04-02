export interface Booking {
  id: number;
  bookingDate: string;
  price: number;
  bookingCode: string;

  seatClass: string;
  status: number;
  flightId: number;
  passengerId: number;
  passengerName: string;
  checked?: boolean;
}

export interface BookingCreateDTO {
  bookingDate: Date;
  price: number;
  bookingCode: string;
  seatClass: string;
  status: number;
  flightId: number;
  passengerId: number;
}
