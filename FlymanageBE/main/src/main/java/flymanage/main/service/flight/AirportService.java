package flymanage.main.service.flight;

import flymanage.main.model.flight.Airport;
import flymanage.main.repo.flight.*;
import flymanage.main.controller.dto.flight.AirportDTO;
import flymanage.main.mapper.AirportMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AirportService {
    
    @Autowired
    private AirportRepository airportRepository;
    
    @Autowired
    private AirportMapper airportMapper;
    
    @Autowired
    private FlightRepository flightRepository;
    
    public List<AirportDTO> getAllAirports() {
        return airportRepository.findAll()
            .stream()
            .map(airportMapper::toDTO)
            .collect(Collectors.toList());
    }
    
    public AirportDTO getAirportById(Integer id) {
        Airport airport = airportRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Airport not found with id: " + id));
        return airportMapper.toDTO(airport);
    }
    
    public AirportDTO createAirport(AirportDTO airportDTO) {
        if (airportRepository.existsByCode(airportDTO.getCode())) {
            throw new IllegalArgumentException("Airport with code " + airportDTO.getCode() + " already exists");
        }
        
        Airport airport = airportMapper.toEntity(airportDTO);
        airport = airportRepository.save(airport);
        return airportMapper.toDTO(airport);
    }
    
    public AirportDTO updateAirport(Integer id, AirportDTO airportDTO) {
        if (!airportRepository.existsById(id)) {
            throw new EntityNotFoundException("Airport not found with id: " + id);
        }
        
        Airport airport = airportMapper.toEntity(airportDTO);
        airport.setId(id);
        airport = airportRepository.save(airport);
        return airportMapper.toDTO(airport);
    }
    
    @Transactional
    public void deleteAirport(Integer id) {
        if (!airportRepository.existsById(id)) {
            throw new EntityNotFoundException("Airport not found with id: " + id);
        }
        
        Airport airport = airportRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Airport not found with id: " + id));
        
        flightRepository.deleteByDepartureAirport(airport);
        flightRepository.deleteByArrivalAirport(airport);
        
        airportRepository.deleteById(id);
    }
}