package flymanage.main.model.flight;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;


@Data
@Entity
@Table(name = "chuyen_bay")
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "ma_chuyen_bay")
    private String flightCode;
    
    @Column(name = "thoi_gian_khoi_hanh")
    private LocalDateTime departureTime;
    
    @Column(name = "thoi_gian_den")
    private LocalDateTime arrivalTime;
    
    @Column(name = "gia_co_ban")
    private BigDecimal basePrice;
    
    @Column(name = "trang_thai")
    private Integer status;
    

    @ManyToOne
    @JoinColumn(name = "san_bay_di_id")
    private Airport departureAirport;
    

    @ManyToOne
    @JoinColumn(name = "san_bay_den_id")
    private Airport arrivalAirport;
        

    @ManyToOne
    @JoinColumn(name = "may_bay_id")
    private Aircraft aircraft;
    
    @ManyToOne 
    private Airline airline;

    @OneToMany(mappedBy = "flight")
    private List<Booking> bookings;


    public Airline getAirline() {
        return aircraft != null ? aircraft.getAirline() : null;
    }
}