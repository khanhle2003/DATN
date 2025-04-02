package flymanage.main.controller.dto.flight;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class BookingDTO {
    private Integer id;
    private LocalDateTime bookingDate;
    private BigDecimal price;
    private String bookingCode;
    private String seatClass;
    private Integer status;
    private Integer flightId;
    private String flightNumber;
    private Integer passengerId;
    private String passengerName; 
    private List<Integer> paymentIds; 
}
