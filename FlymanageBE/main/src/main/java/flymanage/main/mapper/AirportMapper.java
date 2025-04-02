package flymanage.main.mapper;


import flymanage.main.controller.dto.flight.AirportDTO;
import flymanage.main.model.flight.Airport;
import org.springframework.stereotype.Component;

@Component
public class AirportMapper {
    
    public AirportDTO toDTO(Airport airport) {
        if (airport == null) return null;
        
        AirportDTO dto = new AirportDTO();
        dto.setId(airport.getId());
        dto.setCode(airport.getCode());
        dto.setName(airport.getName());
        dto.setCity(airport.getCity());
        dto.setCountry(airport.getCountry());
        return dto;
    }
    
    public Airport toEntity(AirportDTO dto) {
        if (dto == null) return null;
        
        Airport airport = new Airport();
        airport.setId(dto.getId());
        airport.setCode(dto.getCode());
        airport.setName(dto.getName());
        airport.setCity(dto.getCity());
        airport.setCountry(dto.getCountry());
        return airport;
    }
}