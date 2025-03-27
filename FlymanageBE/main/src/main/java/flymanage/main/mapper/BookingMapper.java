package flymanage.main.mapper;

import flymanage.main.controller.dto.flight.BookingDTO;
import flymanage.main.model.flight.Booking;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class BookingMapper {
    
    public BookingDTO toDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setBookingDate(booking.getBookingDate());
        dto.setPrice(booking.getPrice());
        dto.setBookingCode(booking.getBookingCode());
        dto.setSeatClass(booking.getSeatClass());
        dto.setStatus(booking.getStatus());
        
        if (booking.getFlight() != null) {
            dto.setFlightId(booking.getFlight().getId());
            dto.setFlightNumber(booking.getFlight().getFlightCode()); 
        }
        
        if (booking.getPassenger() != null) {
            dto.setPassengerId(booking.getPassenger().getId());
            dto.setPassengerName(booking.getPassenger().getFullName()); 
        }
        
        if (booking.getPayments() != null) {
            dto.setPaymentIds(booking.getPayments().stream()
                .map(payment -> payment.getId())
                .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    public Booking toEntity(BookingDTO dto) {
        Booking booking = new Booking();
        booking.setId(dto.getId());
        booking.setBookingDate(dto.getBookingDate());
        booking.setPrice(dto.getPrice());
        booking.setBookingCode(dto.getBookingCode());
        booking.setSeatClass(dto.getSeatClass());
        booking.setStatus(dto.getStatus());
        return booking;
    }
}
