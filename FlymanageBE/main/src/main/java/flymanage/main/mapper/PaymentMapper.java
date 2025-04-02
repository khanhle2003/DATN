package flymanage.main.mapper;

import org.springframework.stereotype.Component;
import flymanage.main.controller.dto.flight.PaymentDTO;
import flymanage.main.controller.dto.flight.PaymentCreateDTO;
import flymanage.main.model.flight.Payment;
import java.util.stream.Collectors;

@Component
public class PaymentMapper {
    
    public PaymentDTO toDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setAmount(payment.getAmount());
        dto.setMethod(payment.getMethod());
        dto.setTransactionCode(payment.getTransactionCode());

        if (payment.getBookings() != null) {
            dto.setBookingIds(payment.getBookings().stream()
                .map(booking -> booking.getId())
                .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    public Payment toEntity(PaymentCreateDTO dto) {
        Payment payment = new Payment();
        payment.setAmount(dto.getAmount());
        payment.setMethod(dto.getMethod());
        payment.setTransactionCode(dto.getTransactionCode());
        return payment;
    }
} 