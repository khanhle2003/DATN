package flymanage.main.controller.dto.auth;

import lombok.Data;
import java.time.LocalDate;
import java.util.Set;

import flymanage.main.model.flight.Person;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
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
    private Set<String> roles;

    public JwtResponse(String token, Person person, Set<String> roles) {
        this.token = token;
        this.id = person.getId();
        this.username = person.getUsername();
        this.email = person.getEmail();
        this.phone = person.getPhone();
        this.fullName = person.getFullName();
        this.status = person.getStatus();
        this.createdDate = person.getCreatedDate();
        this.updatedDate = person.getUpdatedDate();
        this.identityCard = person.getIdentityCard();
        this.passport = person.getPassport();
        this.dateOfBirth = person.getDateOfBirth();
        this.nationality = person.getNationality();
        this.roles = roles;
    }
}
