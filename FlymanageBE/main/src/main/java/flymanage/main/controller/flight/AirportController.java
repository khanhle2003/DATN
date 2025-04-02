package flymanage.main.controller.flight;


import flymanage.main.controller.dto.flight.AirportDTO;
import flymanage.main.service.flight.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
public class AirportController {
    
    @Autowired
    private AirportService airportService;
    
    @GetMapping
    public ResponseEntity<List<AirportDTO>> getAllAirports() {
        List<AirportDTO> airports = airportService.getAllAirports();
        return ResponseEntity.ok(airports);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AirportDTO> getAirportById(@PathVariable Integer id) {
        AirportDTO airport = airportService.getAirportById(id);
        return ResponseEntity.ok(airport);
    }
    
    @PostMapping
    public ResponseEntity<AirportDTO> createAirport(@RequestBody AirportDTO airportDTO) {
        AirportDTO createdAirport = airportService.createAirport(airportDTO);
        return new ResponseEntity<>(createdAirport, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AirportDTO> updateAirport(@PathVariable Integer id, @RequestBody AirportDTO airportDTO) {
        AirportDTO updatedAirport = airportService.updateAirport(id, airportDTO);
        return ResponseEntity.ok(updatedAirport);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAirport(@PathVariable Integer id) {
        airportService.deleteAirport(id);
        return ResponseEntity.noContent().build();
    }
}
