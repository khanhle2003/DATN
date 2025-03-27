package flymanage.main.repo.flight;

import flymanage.main.model.flight.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    

    @Query("SELECT p FROM Payment p JOIN p.bookings b WHERE b.id = :bookingId")
    List<Payment> findByBookingId(@Param("bookingId") Integer bookingId);
    

    boolean existsByTransactionCode(String transactionCode);
    
  
    List<Payment> findByMethod(String method);
    
    
    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
    List<Payment> findByPaymentDateBetween(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    

    @Query("SELECT p FROM Payment p WHERE p.amount BETWEEN :minAmount AND :maxAmount")
    List<Payment> findByAmountBetween(
        @Param("minAmount") BigDecimal minAmount,
        @Param("maxAmount") BigDecimal maxAmount
    );
    

    @Query("SELECT SUM(p.amount) FROM Payment p JOIN p.bookings b WHERE b.id = :bookingId")
    BigDecimal sumAmountByBookingId(@Param("bookingId") Integer bookingId);
    

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.method = :method")
    Long countByMethod(@Param("method") String method);
    

    @Query("SELECT p FROM Payment p JOIN p.bookings b WHERE b.id = :bookingId ORDER BY p.paymentDate DESC")
    List<Payment> findLatestPaymentByBookingId(@Param("bookingId") Integer bookingId);
    

    @Query("SELECT p FROM Payment p JOIN p.bookings b WHERE b.id = :bookingId AND p.method = :method")
    List<Payment> findByBookingIdAndMethod(
        @Param("bookingId") Integer bookingId,
        @Param("method") String method
    );
}
