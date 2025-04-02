package flymanage.main.repo.flight;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import flymanage.main.model.flight.Airline;

@Repository
public interface AirlineRepository extends JpaRepository<Airline, Integer> {

    boolean existsByCode(String code);
}