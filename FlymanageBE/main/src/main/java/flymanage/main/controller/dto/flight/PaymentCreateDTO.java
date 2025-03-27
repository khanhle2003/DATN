package flymanage.main.controller.dto.flight;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class PaymentCreateDTO {
    private BigDecimal amount;
    private String method;
    private String transactionCode;
    private List<Integer> bookingIds;
}

