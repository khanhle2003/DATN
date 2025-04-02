package flymanage.main.mapper;


import flymanage.main.controller.dto.flight.AirlineDTO;
import flymanage.main.model.flight.Airline;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class AirlineMapper {
    
    public AirlineDTO toDTO(Airline airline) {
        AirlineDTO dto = new AirlineDTO();
        dto.setId(airline.getId());
        dto.setName(airline.getName());
        dto.setCode(airline.getCode());
        dto.setCountry(airline.getCountry());
        
        if (airline.getAircrafts() != null) {
            dto.setAircraftIds(airline.getAircrafts().stream()
                .map(aircraft -> aircraft.getId())
                .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    public Airline toEntity(AirlineDTO dto) {
        Airline airline = new Airline();
        airline.setId(dto.getId());
        airline.setName(dto.getName());
        airline.setCode(dto.getCode());
        airline.setCountry(dto.getCountry());
        return airline;
    }
}