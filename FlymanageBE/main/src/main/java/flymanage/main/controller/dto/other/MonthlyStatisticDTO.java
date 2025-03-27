package flymanage.main.controller.dto.other;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class MonthlyStatisticDTO {
    private String month; // Format: "2024-03"
    private BigDecimal total;
    private Integer count;
} 