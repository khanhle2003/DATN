package flymanage.main.service.other;

import flymanage.main.repo.thongke.PaymentStatisticRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import flymanage.main.controller.dto.other.MonthlyStatisticDTO;
import flymanage.main.controller.dto.other.YearlyStatisticDTO;
import flymanage.main.controller.dto.other.BookingStatisticDTO;

@Service
public class PaymentStatisticService {
    
    @Autowired
    private PaymentStatisticRepository paymentStatisticRepository;
    
    public BigDecimal getDailyTotal(LocalDateTime date) {
        BigDecimal total = paymentStatisticRepository.getDailyTotal(date);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public BigDecimal getMonthlyTotal(int year, int month) {
        BigDecimal total = paymentStatisticRepository.getMonthlyTotal(year, month);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public BigDecimal getYearlyTotal(int year) {
        BigDecimal total = paymentStatisticRepository.getYearlyTotal(year);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public List<Map<String, Object>> getDailyStatistics() {
        List<Object[]> results = paymentStatisticRepository.getDailyStatistics();
        List<Map<String, Object>> statistics = new ArrayList<>();
        
        for (Object[] result : results) {
            Map<String, Object> statistic = new HashMap<>();
            statistic.put("date", result[0]);
            statistic.put("total", result[1]);
            statistics.add(statistic);
        }
        
        return statistics;
    }

    public List<MonthlyStatisticDTO> getMonthlyStatistics(List<String> periods) {
        List<Object[]> results = paymentStatisticRepository.getMonthlyStatistics(periods);
        Map<String, MonthlyStatisticDTO> statisticsMap = results.stream()
            .collect(Collectors.toMap(
                result -> (String) result[0],
                result -> {
                    MonthlyStatisticDTO dto = new MonthlyStatisticDTO();
                    dto.setMonth((String) result[0]);
                    dto.setTotal((BigDecimal) result[1]);
                    dto.setCount(((Number) result[2]).intValue());
                    return dto;
                }
            ));

        return periods.stream()
            .map(period -> statisticsMap.getOrDefault(period, createEmptyMonthlyDTO(period)))
            .collect(Collectors.toList());
    }

    public List<YearlyStatisticDTO> getYearlyStatistics(List<Integer> years) {
        List<Object[]> results = paymentStatisticRepository.getYearlyStatistics(years);
        Map<Integer, YearlyStatisticDTO> statisticsMap = results.stream()
            .collect(Collectors.toMap(
                result -> ((Number) result[0]).intValue(),
                result -> {
                    YearlyStatisticDTO dto = new YearlyStatisticDTO();
                    dto.setYear(((Number) result[0]).intValue());
                    dto.setTotal((BigDecimal) result[1]);
                    dto.setCount(((Number) result[2]).intValue());
                    return dto;
                }
            ));

        return years.stream()
            .map(year -> statisticsMap.getOrDefault(year, createEmptyYearlyDTO(year)))
            .collect(Collectors.toList());
    }

    private MonthlyStatisticDTO createEmptyMonthlyDTO(String month) {
        MonthlyStatisticDTO dto = new MonthlyStatisticDTO();
        dto.setMonth(month);
        dto.setTotal(BigDecimal.ZERO);
        dto.setCount(0);
        return dto;
    }

    private YearlyStatisticDTO createEmptyYearlyDTO(Integer year) {
        YearlyStatisticDTO dto = new YearlyStatisticDTO();
        dto.setYear(year);
        dto.setTotal(BigDecimal.ZERO);
        dto.setCount(0);
        return dto;
    }

    public List<BookingStatisticDTO> getBookingStatisticsByYears(List<Integer> years) {
        List<Object[]> results = paymentStatisticRepository.getBookingStatisticsByYears(years);
        Map<String, BookingStatisticDTO> statisticsMap = results.stream()
            .collect(Collectors.toMap(
                result -> String.valueOf(result[0]),
                result -> {
                    BookingStatisticDTO dto = new BookingStatisticDTO();
                    dto.setPeriod(String.valueOf(result[0]));
                    dto.setTotalBookings(((Number) result[1]).longValue());
                    return dto;
                }
            ));

        return years.stream()
            .map(year -> statisticsMap.getOrDefault(
                String.valueOf(year), 
                BookingStatisticDTO.createEmpty(String.valueOf(year))))
            .collect(Collectors.toList());
    }

    public List<BookingStatisticDTO> getBookingStatisticsByMonths(List<String> months) {
        List<Object[]> results = paymentStatisticRepository.getBookingStatisticsByMonths(months);
        Map<String, BookingStatisticDTO> statisticsMap = results.stream()
            .collect(Collectors.toMap(
                result -> (String) result[0],
                result -> {
                    BookingStatisticDTO dto = new BookingStatisticDTO();
                    dto.setPeriod((String) result[0]);
                    dto.setTotalBookings(((Number) result[1]).longValue());
                    return dto;
                }
            ));

        return months.stream()
            .map(month -> statisticsMap.getOrDefault(month, BookingStatisticDTO.createEmpty(month)))
            .collect(Collectors.toList());
    }
} 