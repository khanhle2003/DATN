package flymanage.main.controller.dto.flight;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Data
public class FlightDTO {
    private Integer id;
    private String flightCode;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal basePrice;
    private Integer status;
    private Integer departureAirportId;
    private Integer arrivalAirportId;
    private Integer aircraftId;
    private String departureAirportName;
    private String arrivalAirportName;
    private String aircraftName;
    private String aircraftCode;
    private String airlineCode;
    private String airlineName;
}

