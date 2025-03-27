package flymanage.main.model.flight;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToMany;
import lombok.Data;

@Data
@Entity
@Table(name = "dat_cho")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "ngay_dat")
    private LocalDateTime bookingDate;
    
    @Column(name = "gia_ve")
    private BigDecimal price;
    
    @Column(name = "ma_dat_cho")
    private String bookingCode;
    
    @Column(name = "hang_ghe")
    private String seatClass;
    
    @Column(name = "trang_thai")
    private Integer status;
    

    @ManyToOne
    @JoinColumn(name = "chuyen_bay_id")
    private Flight flight;
    
    @ManyToOne
    @JoinColumn(name = "hanh_khach_id")
    private Person passenger;
    
    @ManyToMany(mappedBy = "bookings")
    private List<Payment> payments = new ArrayList<>();
}
