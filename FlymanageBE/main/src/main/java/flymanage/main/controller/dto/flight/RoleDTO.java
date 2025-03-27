package flymanage.main.controller.dto.flight;


import flymanage.main.model.flight.ERole;
import lombok.Data;

@Data
public class RoleDTO {
    private Integer id;
    private ERole name;
    private String description;
}
