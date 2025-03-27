package flymanage.main.controller.dto.flight;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class PaymentDTO {
    private Integer id;
    private LocalDateTime paymentDate;
    private BigDecimal amount;
    private String method;
    private String transactionCode;
    private List<Integer> bookingIds;
}