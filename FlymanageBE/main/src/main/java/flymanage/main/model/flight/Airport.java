package flymanage.main.model.flight;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;
@Getter
@Setter
@Entity
@Table(name="san_bay")
public class Airport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "ma_san_bay")
    private String code;
    
    @Column(name = "ten_san_bay")
    private String name;
    
    @Column(name = "thanh_pho")
    private String city;
    
    @Column(name = "quoc_gia")
    private String country;
    
    @JsonIgnore
    @OneToMany(mappedBy = "departureAirport")
    private List<Flight> departureFlights;
    
    @JsonIgnore
    @OneToMany(mappedBy = "arrivalAirport")
    private List<Flight> arrivalFlights;
}
    

