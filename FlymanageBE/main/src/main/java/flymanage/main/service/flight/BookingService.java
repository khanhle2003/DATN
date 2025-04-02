package flymanage.main.service.flight;

import flymanage.main.controller.dto.flight.BookingDTO;
import flymanage.main.mapper.BookingMapper;
import flymanage.main.model.flight.Booking;
import flymanage.main.model.flight.Flight;
import flymanage.main.model.flight.Person;
import flymanage.main.repo.flight.*;
import flymanage.main.service.other.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private FlightRepository flightRepository;
    
    @Autowired
    private PersonRepository personRepository;
    
    @Autowired
    private BookingMapper bookingMapper;
    
    @Autowired
    private EmailService emailService;
    
    public List<BookingDTO> findAll() {
        return bookingRepository.findAll()
                .stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public BookingDTO findById(Integer id) {
        return bookingRepository.findById(id)
                .map(bookingMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    public List<BookingDTO> findByPassengerId(Integer passengerId) {
        return bookingRepository.findByPassengerId(passengerId)
                .stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<BookingDTO> findByFlightId(Integer flightId) {
        return bookingRepository.findByFlightId(flightId)
                .stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public BookingDTO create(BookingDTO bookingDTO) {

        Flight flight = flightRepository.findById(bookingDTO.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found"));
                
   
        Person passenger = personRepository.findById(bookingDTO.getPassengerId())
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
                
  
        String bookingCode = generateBookingCode();
        
        Booking booking = bookingMapper.toEntity(bookingDTO);
        booking.setId(null);
        booking.setBookingDate(LocalDateTime.now());
        booking.setBookingCode(bookingCode);
        booking.setFlight(flight);
        booking.setPassenger(passenger);
        
        Booking savedBooking = bookingRepository.save(booking);
        return bookingMapper.toDTO(savedBooking);
    }
    
    public BookingDTO update(Integer id, BookingDTO bookingDTO) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found");
        }
        
 
        Flight flight = flightRepository.findById(bookingDTO.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found"));
                

        Person passenger = personRepository.findById(bookingDTO.getPassengerId())
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        
        Booking booking = bookingMapper.toEntity(bookingDTO);
        booking.setId(id);
        booking.setFlight(flight);
        booking.setPassenger(passenger);
        
        Booking updatedBooking = bookingRepository.save(booking);
        return bookingMapper.toDTO(updatedBooking);
    }
    
    public void delete(Integer id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found");
        }
        bookingRepository.deleteById(id);
    }
    
    private String generateBookingCode() {
    
        String code;
        do {
            code = "BK" + System.currentTimeMillis() % 100000;
        } while (bookingRepository.existsByBookingCode(code));
        return code;
    }
    
    public void sendBookingCodeToUser(Integer bookingId, String email) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt chỗ"));
        
        emailService.sendBookingCode(email, booking.getBookingCode());
    }
}
    