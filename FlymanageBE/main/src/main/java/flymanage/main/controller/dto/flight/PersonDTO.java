package flymanage.main.controller.dto.flight;


import java.time.LocalDate;
import java.util.Set;
import flymanage.main.model.flight.ERole;  
import lombok.Data;

@Data
public class PersonDTO {
    private Integer id;
    private String username;
    private String email;
    private String phone;
    private String fullName;
    private Integer status;
    private LocalDate createdDate;
    private LocalDate updatedDate;
    private String identityCard;
    private String passport;
    private LocalDate dateOfBirth;
    private String nationality;
    private Set<ERole> roles;  
    private String avatar;
}
