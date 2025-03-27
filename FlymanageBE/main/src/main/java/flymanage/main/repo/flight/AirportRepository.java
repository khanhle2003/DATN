package flymanage.main.repo.flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import flymanage.main.model.flight.Airport;
@Repository
public interface AirportRepository extends JpaRepository<Airport, Integer> {
    boolean existsByCode(String code);
    void deleteById(Integer id);
}