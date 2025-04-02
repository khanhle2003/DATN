package flymanage.main.controller.flight;


import flymanage.main.controller.dto.flight.FlightDTO;
import flymanage.main.service.flight.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {
    
    @Autowired
    private FlightService flightService;
    
    @GetMapping
    public ResponseEntity<List<FlightDTO>> getAllFlights() {
        List<FlightDTO> flights = flightService.getAllFlights();
        return ResponseEntity.ok(flights);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FlightDTO> getFlightById(@PathVariable Integer id) {
        FlightDTO flight = flightService.getFlightById(id);
        return ResponseEntity.ok(flight);
    }
    
    @PostMapping
    public ResponseEntity<FlightDTO> createFlight(@RequestBody FlightDTO flightDTO) {
        FlightDTO createdFlight = flightService.createFlight(flightDTO);
        return new ResponseEntity<>(createdFlight, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<FlightDTO> updateFlight(@PathVariable Integer id, @RequestBody FlightDTO flightDTO) {
        FlightDTO updatedFlight = flightService.updateFlight(id, flightDTO);
        return ResponseEntity.ok(updatedFlight);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Integer id) {
        flightService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }
}