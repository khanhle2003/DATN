package flymanage.main.repo.flight;

import flymanage.main.model.flight.Flight;
import flymanage.main.model.flight.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Integer> {
    boolean existsByFlightCode(String flightCode);

    void deleteByDepartureAirport(Airport airport);
    void deleteByArrivalAirport(Airport airport);
}
