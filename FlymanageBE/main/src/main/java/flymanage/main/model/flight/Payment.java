package flymanage.main.model.flight;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "thanh_toan")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "ngay_thanh_toan")
    private LocalDateTime paymentDate;
    
    @Column(name = "so_tien")
    private BigDecimal amount;
    
    @Column(name = "phuong_thuc")
    private String method;
    
    @Column(name = "ma_giao_dich")
    private String transactionCode;
    
    @ManyToMany
    @JoinTable(
        name = "thanh_toan_dat_cho",
        joinColumns = @JoinColumn(name = "thanh_toan_id"),
        inverseJoinColumns = @JoinColumn(name = "dat_cho_id")
    )
    private List<Booking> bookings = new ArrayList<>();

    public void generateTransactionCode() {
        this.transactionCode = "PAY" + String.format("%010d", (int)(Math.random() * 1_000_000_0000L));
    }

    public void addBooking(Booking booking) {
        this.bookings.add(booking);
    }
}