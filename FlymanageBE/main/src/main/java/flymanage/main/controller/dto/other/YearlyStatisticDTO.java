package flymanage.main.controller.dto.other;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class YearlyStatisticDTO {
    private Integer year;
    private BigDecimal total;
    private Integer count;
}