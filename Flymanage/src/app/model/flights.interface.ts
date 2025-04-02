// Interface cho việc tạo mới flight
export interface CreateFlightDTO {
    flightCode: string;
    departureTime: string;
    arrivalTime: string;
    basePrice: number;
    status: number;
    departureAirportId: number;
    arrivalAirportId: number;
    aircraftId: number;
    airlineId: number;
}

// Interface cho dữ liệu flight trả về
export interface FlightDTO {
    id: number;
    flightCode: string;
    departureTime: Date;
    arrivalTime: Date;
    basePrice: number;
    status: number;
    departureAirport: {
      id: number;
      code: string;
      name: string;
    };
    arrivalAirport: {
      id: number;
      code: string;
      name: string;
    };
    aircraft: {
      id: number;
      model: string;
    };
    airline: {
      id: number;
      name: string;
    };
}