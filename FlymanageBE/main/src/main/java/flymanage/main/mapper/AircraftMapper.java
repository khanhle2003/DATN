package flymanage.main.mapper;

import flymanage.main.controller.dto.flight.AircraftDTO;
import flymanage.main.model.flight.Aircraft;
import flymanage.main.model.flight.Airline;

import org.springframework.stereotype.Component;

@Component
public class AircraftMapper {
    
    public AircraftDTO toDTO(Aircraft aircraft) {
        AircraftDTO dto = new AircraftDTO();
        dto.setId(aircraft.getId());
        dto.setAircraftCode(aircraft.getAircraftCode());
        dto.setAircraftType(aircraft.getAircraftType());
        dto.setEconomySeats(aircraft.getEconomySeats());
        dto.setBusinessSeats(aircraft.getBusinessSeats());
        
        if (aircraft.getAirline() != null) {
            dto.setAirlineId(aircraft.getAirline().getId());
            dto.setAirlineName(aircraft.getAirline().getName()); 
        }
        
        return dto;
    }
    
    public Aircraft toEntity(AircraftDTO dto) {
        Aircraft aircraft = new Aircraft();
        aircraft.setId(dto.getId());
        aircraft.setAircraftCode(dto.getAircraftCode());
        aircraft.setAircraftType(dto.getAircraftType());
        aircraft.setEconomySeats(dto.getEconomySeats());
        aircraft.setBusinessSeats(dto.getBusinessSeats());

        if (dto.getAirlineId() != null) {
            Airline airline = new Airline();
            airline.setId(dto.getAirlineId());
            airline.setName(dto.getAirlineName());
            aircraft.setAirline(airline);
        }
        
        return aircraft;
    }
}