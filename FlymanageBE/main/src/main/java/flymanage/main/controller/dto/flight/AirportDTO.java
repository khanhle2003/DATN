package flymanage.main.controller.dto.flight;


import lombok.Data;

@Data
public class AirportDTO {
    private Integer id;
    private String code;
    private String name;
    private String city;
    private String country;
}
