package flymanage.main.controller.other;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import flymanage.main.controller.dto.other.StatisticRequestDTO;
import flymanage.main.controller.dto.other.MonthlyStatisticDTO;
import flymanage.main.controller.dto.other.YearlyStatisticDTO;
import flymanage.main.controller.dto.other.BookingStatisticDTO;
import flymanage.main.service.other.PaymentStatisticService;

@RestController
@RequestMapping("/api/statistics/payments")
public class PaymentStatisticController {
    
    @Autowired
    private PaymentStatisticService paymentStatisticService;

    @PostMapping("/monthly-statistics")
    public ResponseEntity<List<MonthlyStatisticDTO>> getMonthlyStatistics(
            @RequestBody StatisticRequestDTO request) {
        return ResponseEntity.ok(paymentStatisticService.getMonthlyStatistics(request.getMonths()));
    }

    @PostMapping("/yearly-statistics")
    public ResponseEntity<List<YearlyStatisticDTO>> getYearlyStatistics(
            @RequestBody StatisticRequestDTO request) {
        return ResponseEntity.ok(paymentStatisticService.getYearlyStatistics(request.getYears()));
    }

    @PostMapping("/booking-statistics/yearly")
    public ResponseEntity<List<BookingStatisticDTO>> getBookingStatisticsByYears(
            @RequestBody StatisticRequestDTO request) {
        return ResponseEntity.ok(paymentStatisticService.getBookingStatisticsByYears(request.getYears()));
    }

    @PostMapping("/booking-statistics/monthly")
    public ResponseEntity<List<BookingStatisticDTO>> getBookingStatisticsByMonths(
            @RequestBody StatisticRequestDTO request) {
        return ResponseEntity.ok(paymentStatisticService.getBookingStatisticsByMonths(request.getMonths()));
    }
} 