package flymanage.main.controller.dto.other;

import lombok.Data;
import java.util.List;

@Data
public class StatisticRequestDTO {
    private List<Integer> years;
    private List<String> months; // Format: "2024-03"
} 