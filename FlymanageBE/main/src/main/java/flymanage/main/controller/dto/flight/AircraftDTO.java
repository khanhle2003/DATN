package flymanage.main.controller.dto.flight;

import lombok.Data;

@Data
public class AircraftDTO {
    private Integer id;
    private String aircraftCode;
    private String aircraftType;
    private Integer economySeats;
    private Integer businessSeats;
    private Integer airlineId;
    private String airlineName; 
}