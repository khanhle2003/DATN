package flymanage.main.service.flight;



import flymanage.main.controller.dto.flight.AirlineDTO;
import flymanage.main.mapper.AirlineMapper;
import flymanage.main.model.flight.Airline;
import flymanage.main.repo.flight.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AirlineService {
    
    @Autowired
    private AirlineRepository airlineRepository;
    
    @Autowired
    private AirlineMapper airlineMapper;
    
    public List<AirlineDTO> findAll() {
        return airlineRepository.findAll()
                .stream()
                .map(airlineMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public AirlineDTO findById(Integer id) {
        return airlineRepository.findById(id)
                .map(airlineMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Airline not found"));
    }
    
    public AirlineDTO create(AirlineDTO airlineDTO) {
 
        if (airlineRepository.existsByCode(airlineDTO.getCode())) {
            throw new RuntimeException("Airline code already exists");
        }
        
        Airline airline = airlineMapper.toEntity(airlineDTO);
        airline.setId(null); 
        Airline savedAirline = airlineRepository.save(airline);
        return airlineMapper.toDTO(savedAirline);
    }
    
    public AirlineDTO update(Integer id, AirlineDTO airlineDTO) {
        if (!airlineRepository.existsById(id)) {
            throw new RuntimeException("Airline not found");
        }
        
        Airline existingAirline = airlineRepository.findById(id).get();
        if (!existingAirline.getCode().equals(airlineDTO.getCode()) && 
            airlineRepository.existsByCode(airlineDTO.getCode())) {
            throw new RuntimeException("Airline code already exists");
        }
        
        Airline airline = airlineMapper.toEntity(airlineDTO);
        airline.setId(id);
        Airline updatedAirline = airlineRepository.save(airline);
        return airlineMapper.toDTO(updatedAirline);
    }
    
    public void delete(Integer id) {
        if (!airlineRepository.existsById(id)) {
            throw new RuntimeException("Airline not found");
        }
        airlineRepository.deleteById(id);
    }
}