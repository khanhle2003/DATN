package flymanage.main.repo.flight;
import flymanage.main.model.flight.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    
 
    @Query("SELECT b FROM Booking b WHERE b.passenger.id = :passengerId")
    List<Booking> findByPassengerId(@Param("passengerId") Integer passengerId);
    
    @Query("SELECT b FROM Booking b WHERE b.flight.id = :flightId")
    List<Booking> findByFlightId(@Param("flightId") Integer flightId);

    boolean existsByBookingCode(String bookingCode);
    

    List<Booking> findByStatus(Integer status);
    

    List<Booking> findBySeatClass(String seatClass);

    @Query("SELECT b FROM Booking b WHERE b.passenger.id = :passengerId AND b.status = :status")
    List<Booking> findByPassengerIdAndStatus(
        @Param("passengerId") Integer passengerId, 
        @Param("status") Integer status
    );
    

    @Query("SELECT b FROM Booking b WHERE b.flight.id = :flightId AND b.status = :status")
    List<Booking> findByFlightIdAndStatus(
        @Param("flightId") Integer flightId, 
        @Param("status") Integer status
    );
    

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.flight.id = :flightId")
    Long countByFlightId(@Param("flightId") Integer flightId);
    

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.passenger.id = :passengerId")
    Long countByPassengerId(@Param("passengerId") Integer passengerId);
}


