package flymanage.main.controller.dto.other;

import lombok.Data;

@Data
public class BookingStatisticDTO {
    private String period; // Năm hoặc tháng
    private Long totalBookings; // Số lượng booking
    
    public static BookingStatisticDTO createEmpty(String period) {
        BookingStatisticDTO dto = new BookingStatisticDTO();
        dto.setPeriod(period);
        dto.setTotalBookings(0L);
        return dto;
    }
} 