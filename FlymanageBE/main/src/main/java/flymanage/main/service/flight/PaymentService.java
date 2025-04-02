package flymanage.main.service.flight;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import flymanage.main.controller.dto.flight.PaymentCreateDTO;
import flymanage.main.controller.dto.flight.PaymentDTO;
import flymanage.main.model.flight.Booking;
import flymanage.main.model.flight.Payment;
import flymanage.main.repo.flight.BookingRepository;
import flymanage.main.repo.flight.PaymentRepository;
import flymanage.main.mapper.PaymentMapper;

@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentMapper paymentMapper;

    public PaymentDTO createPayment(PaymentCreateDTO dto) {
        Payment payment = paymentMapper.toEntity(dto);
        payment.setPaymentDate(LocalDateTime.now());
        
        if (payment.getTransactionCode() == null) {
            payment.generateTransactionCode();
        }
        
        if (dto.getBookingIds() != null && !dto.getBookingIds().isEmpty()) {
            for (Integer bookingId : dto.getBookingIds()) {
                Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
                payment.addBooking(booking);
            }
        }
        
        payment = paymentRepository.save(payment);
        return paymentMapper.toDTO(payment);
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
            .map(paymentMapper::toDTO)
            .collect(Collectors.toList());
    }

    public PaymentDTO getPayment(Integer id) {
        Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        return paymentMapper.toDTO(payment);
    }

    public PaymentDTO updatePayment(Integer id, PaymentCreateDTO dto) {
        Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        payment.setAmount(dto.getAmount());
        payment.setMethod(dto.getMethod());
        
        payment.getBookings().clear();
        if (dto.getBookingIds() != null) {
            for (Integer bookingId : dto.getBookingIds()) {
                Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
                payment.addBooking(booking);
            }
        }
        
        payment = paymentRepository.save(payment);
        return paymentMapper.toDTO(payment);
    }

    public void deletePayment(Integer id) {
        paymentRepository.deleteById(id);
    }

    public void updateBookingStatus(List<Integer> bookingIds, Integer status) {
        for (Integer bookingId : bookingIds) {
            Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
            booking.setStatus(status);
            bookingRepository.save(booking);
        }
    }
}
