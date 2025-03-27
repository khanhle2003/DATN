package flymanage.main.repo.flight;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import flymanage.main.model.flight.Aircraft;

@Repository
public interface AircraftRepository extends JpaRepository<Aircraft, Integer> {
    // List<Aircraft> findByAirline(Airline airline);
    // Aircraft findByAircraftCode(String aircraftCode);
}