package flymanage.main.controller.flight;

import flymanage.main.controller.dto.flight.BookingDTO;
import flymanage.main.controller.dto.other.EmailRequestDTO;
import flymanage.main.service.flight.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*"
               )
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {  
        List<BookingDTO> bookings = bookingService.findAll();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Integer id) {
        BookingDTO booking = bookingService.findById(id);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByPassenger(@PathVariable Integer passengerId) {
        List<BookingDTO> bookings = bookingService.findByPassengerId(passengerId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/flight/{flightId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByFlight(@PathVariable Integer flightId) {
        List<BookingDTO> bookings = bookingService.findByFlightId(flightId);
        return ResponseEntity.ok(bookings);
    }

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO bookingDTO) {
        BookingDTO createdBooking = bookingService.create(bookingDTO);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingDTO> updateBooking(
            @PathVariable Integer id,
            @RequestBody BookingDTO bookingDTO) {
        BookingDTO updatedBooking = bookingService.update(id, bookingDTO);
        return ResponseEntity.ok(updatedBooking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Integer id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/send-booking-code")
    public ResponseEntity<String> sendBookingCode(
            @PathVariable Integer id,
            @RequestBody EmailRequestDTO emailRequest) {
        try {
            bookingService.sendBookingCodeToUser(id, emailRequest.getEmail());
            return ResponseEntity.ok("Mã đặt chỗ đã được gửi thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Không thể gửi mã đặt chỗ: " + e.getMessage());
        }
    }
}