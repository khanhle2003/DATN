package flymanage.main.mapper;


import flymanage.main.model.flight.Flight;
import flymanage.main.model.flight.Airport;
import flymanage.main.controller.dto.flight.FlightDTO;
import flymanage.main.model.flight.Aircraft;
import org.springframework.stereotype.Component;

@Component
public class FlightMapper {
    
    public FlightDTO toDTO(Flight flight) {
        if (flight == null) return null;
        
        FlightDTO dto = new FlightDTO();
        dto.setId(flight.getId());
        dto.setFlightCode(flight.getFlightCode());
        dto.setDepartureTime(flight.getDepartureTime());
        dto.setArrivalTime(flight.getArrivalTime());
        dto.setBasePrice(flight.getBasePrice());
        dto.setStatus(flight.getStatus());
        
        if (flight.getDepartureAirport() != null) {
            dto.setDepartureAirportId(flight.getDepartureAirport().getId());
            dto.setDepartureAirportName(flight.getDepartureAirport().getName());
        }
        
        if (flight.getArrivalAirport() != null) {
            dto.setArrivalAirportId(flight.getArrivalAirport().getId());
            dto.setArrivalAirportName(flight.getArrivalAirport().getName());
        }
        if (flight.getAircraft() != null) {
            dto.setAircraftId(flight.getAircraft().getId());
            dto.setAircraftCode(flight.getAircraft().getAircraftCode());
            dto.setAircraftName(flight.getAircraft().getAircraftType());
        }
        if (flight.getAirline() != null) {
            dto.setAirlineCode(flight.getAirline().getCode());
            dto.setAirlineName(flight.getAirline().getName());
        }
        return dto;
    }
    
    public Flight toEntity(FlightDTO dto) {
        if (dto == null) return null;
        
        Flight flight = new Flight();
        flight.setId(dto.getId());
        flight.setFlightCode(dto.getFlightCode());
        flight.setDepartureTime(dto.getDepartureTime());
        flight.setArrivalTime(dto.getArrivalTime());
        flight.setBasePrice(dto.getBasePrice());
        flight.setStatus(dto.getStatus());
        
        if (dto.getDepartureAirportId() != null) {
            Airport departureAirport = new Airport();
            departureAirport.setId(dto.getDepartureAirportId());
            departureAirport.setName(dto.getDepartureAirportName());
            flight.setDepartureAirport(departureAirport);
        }
        
        if (dto.getArrivalAirportId() != null) {
            Airport arrivalAirport = new Airport();
            arrivalAirport.setId(dto.getArrivalAirportId());
            arrivalAirport.setName(dto.getArrivalAirportName());
            flight.setArrivalAirport(arrivalAirport);
        }
        
        if (dto.getAircraftId() != null) {
            Aircraft aircraft = new Aircraft();
            aircraft.setId(dto.getAircraftId());
            aircraft.setAircraftCode(dto.getAircraftCode());
            flight.setAircraft(aircraft);
        }
        
        return flight;
    }
}