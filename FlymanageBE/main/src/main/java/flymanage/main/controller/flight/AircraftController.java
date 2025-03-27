package flymanage.main.controller.flight;


import flymanage.main.controller.dto.flight.AircraftDTO;
import flymanage.main.service.flight.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aircraft")
public class AircraftController {
    
    @Autowired
    private AircraftService aircraftService;
    
    @GetMapping
    public List<AircraftDTO> getAllAircraft() {
        return aircraftService.findAll();
    }
    
    @GetMapping("/{id}")
    public AircraftDTO getAircraft(@PathVariable Integer id) {
        return aircraftService.findById(id);
    }
    
    @PostMapping
    public AircraftDTO createAircraft(@RequestBody AircraftDTO aircraftDTO) {
        return aircraftService.create(aircraftDTO);
    }
    
    @PutMapping("/{id}")
    public AircraftDTO updateAircraft(@PathVariable Integer id, @RequestBody AircraftDTO aircraftDTO) {
        return aircraftService.update(id, aircraftDTO);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAircraft(@PathVariable Integer id) {
        aircraftService.delete(id);
        return ResponseEntity.ok().build();
    }
}