package flymanage.main.service.flight;


import flymanage.main.controller.dto.flight.AircraftDTO;
import flymanage.main.mapper.AircraftMapper;
import flymanage.main.model.flight.Aircraft;
import flymanage.main.repo.flight.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AircraftService {
    
    @Autowired
    private AircraftRepository aircraftRepository;
    
    @Autowired
    private AircraftMapper aircraftMapper;
    
    public List<AircraftDTO> findAll() {
        return aircraftRepository.findAll()
                .stream()
                .map(aircraftMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public AircraftDTO findById(Integer id) {
        return aircraftRepository.findById(id)
                .map(aircraftMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Aircraft not found"));
    }
    
    public AircraftDTO create(AircraftDTO aircraftDTO) {
        Aircraft aircraft = aircraftMapper.toEntity(aircraftDTO);
        aircraft.setId(null); // Ensure new entity
        Aircraft savedAircraft = aircraftRepository.save(aircraft);
        return aircraftMapper.toDTO(savedAircraft);
    }
    
    public AircraftDTO update(Integer id, AircraftDTO aircraftDTO) {
        if (!aircraftRepository.existsById(id)) {
            throw new RuntimeException("Aircraft not found");
        }
        Aircraft aircraft = aircraftMapper.toEntity(aircraftDTO);
        aircraft.setId(id);
        Aircraft updatedAircraft = aircraftRepository.save(aircraft);
        return aircraftMapper.toDTO(updatedAircraft);
    }
    
    public void delete(Integer id) {
        aircraftRepository.deleteById(id);
    }
}