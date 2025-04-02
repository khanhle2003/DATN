package flymanage.main.controller.dto.flight;


import lombok.Data;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
@Getter 
@Setter
@Data
public class AirlineDTO {
    private Integer id;
    private String name;
    private String code;
    private String country;
    private List<Integer> aircraftIds; 
}
