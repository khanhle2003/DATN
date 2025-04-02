package flymanage.main.service.flight;
import flymanage.main.model.flight.Aircraft;
import flymanage.main.model.flight.Airport;
import flymanage.main.model.flight.Flight;
import flymanage.main.repo.flight.*;
import flymanage.main.controller.dto.flight.FlightDTO;
import flymanage.main.mapper.FlightMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class FlightService {
    
    @Autowired
    private FlightRepository flightRepository;
    
    @Autowired
    private FlightMapper flightMapper;
    
    @Autowired
    private AirportRepository airportRepository;
    
    @Autowired
    private AircraftRepository aircraftRepository;
    
    public List<FlightDTO> getAllFlights() {
        return flightRepository.findAll().stream()
            .map(flightMapper::toDTO)
            .collect(Collectors.toList());
    }
    
    public FlightDTO getFlightById(Integer id) {
        Flight flight = flightRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));
        return flightMapper.toDTO(flight);
    }
    
    public FlightDTO createFlight(FlightDTO flightDTO) {
        validateFlightTimes(flightDTO);
        
        Flight flight = new Flight();
        
        flight.setFlightCode(flightDTO.getFlightCode());
        flight.setDepartureTime(flightDTO.getDepartureTime());
        flight.setArrivalTime(flightDTO.getArrivalTime());
        flight.setBasePrice(flightDTO.getBasePrice());
        flight.setStatus(flightDTO.getStatus());

        if (flightDTO.getDepartureAirportId() == null) {
            throw new RuntimeException("Departure airport is required");
        }
        Airport departureAirport = airportRepository.findById(flightDTO.getDepartureAirportId())
            .orElseThrow(() -> new RuntimeException("Departure airport not found"));
        flight.setDepartureAirport(departureAirport);
        
        if (flightDTO.getArrivalAirportId() == null) {
            throw new RuntimeException("Arrival airport is required");
        }
        Airport arrivalAirport = airportRepository.findById(flightDTO.getArrivalAirportId())
            .orElseThrow(() -> new RuntimeException("Arrival airport not found"));
        flight.setArrivalAirport(arrivalAirport);
        
        if (flightDTO.getAircraftId() == null) {
            throw new RuntimeException("Aircraft is required");
        }
        Aircraft aircraft = aircraftRepository.findById(flightDTO.getAircraftId())
            .orElseThrow(() -> new RuntimeException("Aircraft not found"));
        flight.setAircraft(aircraft);
        
        flight = flightRepository.save(flight);
        return flightMapper.toDTO(flight);
    }
    
    public FlightDTO updateFlight(Integer id, FlightDTO flightDTO) {
        Flight existingFlight = flightRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));
        
        existingFlight.setFlightCode(flightDTO.getFlightCode());
        existingFlight.setDepartureTime(flightDTO.getDepartureTime());
        existingFlight.setArrivalTime(flightDTO.getArrivalTime());
        existingFlight.setBasePrice(flightDTO.getBasePrice());
        existingFlight.setStatus(flightDTO.getStatus());
        if (flightDTO.getDepartureAirportId() != null) {
            Airport departureAirport = airportRepository.getReferenceById(flightDTO.getDepartureAirportId());
            existingFlight.setDepartureAirport(departureAirport);
        }
        
        if (flightDTO.getArrivalAirportId() != null) {
            Airport arrivalAirport = airportRepository.getReferenceById(flightDTO.getArrivalAirportId());
            existingFlight.setArrivalAirport(arrivalAirport);
        }
        
        if (flightDTO.getAircraftId() != null) {
            Aircraft aircraft = aircraftRepository.getReferenceById(flightDTO.getAircraftId());
            existingFlight.setAircraft(aircraft);
        }
        
        existingFlight = flightRepository.save(existingFlight);
        return flightMapper.toDTO(existingFlight);
    }
    
    public void deleteFlight(Integer id) {
        flightRepository.deleteById(id);
    }
    
    private void validateFlightTimes(FlightDTO flightDTO) {
        if (flightDTO.getDepartureTime() == null) {
            throw new RuntimeException("Departure time is required");
        }
        if (flightDTO.getArrivalTime() == null) {
            throw new RuntimeException("Arrival time is required");
        }
        if (flightDTO.getArrivalTime().isBefore(flightDTO.getDepartureTime())) {
            throw new RuntimeException("Arrival time cannot be before departure time");
        }
    }
}