package flymanage.main.repo.thongke;

import flymanage.main.model.flight.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PaymentStatisticRepository extends JpaRepository<Payment, Integer> {
    
    @Query(value = "SELECT COALESCE(SUM(so_tien), 0) FROM thanh_toan WHERE DATE(ngay_thanh_toan) = DATE(:date)", nativeQuery = true)
    BigDecimal getDailyTotal(@Param("date") LocalDateTime date);
    
    @Query(value = "SELECT COALESCE(SUM(so_tien), 0) FROM thanh_toan WHERE YEAR(ngay_thanh_toan) = :year AND MONTH(ngay_thanh_toan) = :month", nativeQuery = true)
    BigDecimal getMonthlyTotal(@Param("year") int year, @Param("month") int month);
    
    @Query(value = "SELECT COALESCE(SUM(so_tien), 0) FROM thanh_toan WHERE YEAR(ngay_thanh_toan) = :year", nativeQuery = true)
    BigDecimal getYearlyTotal(@Param("year") int year);
    
    @Query(value = "SELECT DATE(ngay_thanh_toan) as date, COALESCE(SUM(so_tien), 0) as total FROM thanh_toan " +
           "GROUP BY DATE(ngay_thanh_toan) ORDER BY date DESC", nativeQuery = true)
    List<Object[]> getDailyStatistics();

    @Query(value = "SELECT CONCAT(YEAR(ngay_thanh_toan), '-', LPAD(MONTH(ngay_thanh_toan), 2, '0')) as period, " +
           "COALESCE(SUM(so_tien), 0) as total, COUNT(*) as count " +
           "FROM thanh_toan " +
           "WHERE CONCAT(YEAR(ngay_thanh_toan), '-', LPAD(MONTH(ngay_thanh_toan), 2, '0')) IN (:periods) " +
           "GROUP BY period ORDER BY period", nativeQuery = true)
    List<Object[]> getMonthlyStatistics(@Param("periods") List<String> periods);

    @Query(value = "SELECT YEAR(ngay_thanh_toan) as period, " +
           "COALESCE(SUM(so_tien), 0) as total, COUNT(*) as count " +
           "FROM thanh_toan " +
           "WHERE YEAR(ngay_thanh_toan) IN (:years) " +
           "GROUP BY period ORDER BY period", nativeQuery = true)
    List<Object[]> getYearlyStatistics(@Param("years") List<Integer> years);

    @Query(value = "SELECT YEAR(b.ngay_dat) as year, " +
           "COUNT(*) as total_bookings " +
           "FROM dat_cho b " +
           "WHERE b.trang_thai = 1 AND YEAR(b.ngay_dat) IN (:years) " +
           "GROUP BY year ORDER BY year", nativeQuery = true)
    List<Object[]> getBookingStatisticsByYears(@Param("years") List<Integer> years);

    @Query(value = "SELECT CONCAT(YEAR(b.ngay_dat), '-', LPAD(MONTH(b.ngay_dat), 2, '0')) as month, " +
           "COUNT(*) as total_bookings " +
           "FROM dat_cho b " +
           "WHERE b.trang_thai = 1 AND CONCAT(YEAR(b.ngay_dat), '-', LPAD(MONTH(b.ngay_dat), 2, '0')) IN (:months) " +
           "GROUP BY month ORDER BY month", nativeQuery = true)
    List<Object[]> getBookingStatisticsByMonths(@Param("months") List<String> months);
}