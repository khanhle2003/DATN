package flymanage.main.controller.flight;



import flymanage.main.controller.dto.flight.AirlineDTO;
import flymanage.main.service.flight.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airlines")
public class AirlineController {
    
    @Autowired
    private AirlineService airlineService;
    
    @GetMapping
    public List<AirlineDTO> getAllAirlines() {
        return airlineService.findAll();
    }
    
    @GetMapping("/{id}")
    public AirlineDTO getAirline(@PathVariable Integer id) {
        return airlineService.findById(id);
    }
    
    @PostMapping
    public AirlineDTO createAirline(@RequestBody AirlineDTO airlineDTO) {
        return airlineService.create(airlineDTO);
    }
    
    @PutMapping("/{id}")
    public AirlineDTO updateAirline(@PathVariable Integer id, @RequestBody AirlineDTO airlineDTO) {
        return airlineService.update(id, airlineDTO);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAirline(@PathVariable Integer id) {
        airlineService.delete(id);
        return ResponseEntity.ok().build();
    }
}