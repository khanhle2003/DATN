package flymanage.main.model.flight;
import java.util.List;



import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Data
@Table(name  = "hang_bay")
public class Airline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;
    
    @Column(name = "ten_hang")
    private String name;
    
    @Column(name = "ma_hang")
    private String code;
    
    @Column(name = "quoc_gia")
    private String country;
    

    @OneToMany(mappedBy = "airline", cascade = CascadeType.ALL)

    private List<Aircraft> aircrafts;
}
