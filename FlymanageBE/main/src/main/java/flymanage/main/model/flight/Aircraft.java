package flymanage.main.model.flight;

import java.util.List;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter 
@Setter
@Data
@Entity
@Table(name = "may_bay")
public class Aircraft {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "ma_may_bay")
    private String aircraftCode;
    
    @Column(name = "loai_may_bay")
    private String aircraftType;
    
    @Column(name = "so_ghe_thuong")
    private Integer economySeats;
    
    @Column(name = "so_ghe_thuong_gia")
    private Integer businessSeats;


    

    @ManyToOne
    @JoinColumn(name = "hang_bay_id")
    private Airline airline;

    @OneToMany(mappedBy = "aircraft")
    private List<Flight> flights;
}