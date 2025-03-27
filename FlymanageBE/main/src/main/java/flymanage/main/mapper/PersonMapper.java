package flymanage.main.mapper;

import flymanage.main.controller.dto.flight.PersonCreateDTO;
import flymanage.main.controller.dto.flight.PersonDTO;
import flymanage.main.model.flight.Person;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;
import java.nio.file.Path;
import org.springframework.beans.factory.annotation.Value;

@Component
public class PersonMapper {
    
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public PersonDTO toDTO(Person person) {
        PersonDTO dto = new PersonDTO();
        dto.setId(person.getId());
        dto.setUsername(person.getUsername());
        dto.setEmail(person.getEmail());
        dto.setPhone(person.getPhone());
        dto.setAvatar(person.getAvatar());
        dto.setFullName(person.getFullName());
        dto.setStatus(person.getStatus());
        dto.setCreatedDate(person.getCreatedDate());
        dto.setUpdatedDate(person.getUpdatedDate());
        dto.setIdentityCard(person.getIdentityCard());
        dto.setPassport(person.getPassport());
        dto.setDateOfBirth(person.getDateOfBirth());
        dto.setNationality(person.getNationality());
        
        if (person.getRoles() != null) {
            dto.setRoles(person.getRoles().stream()
                .map(role -> role.getName()) 
                .collect(Collectors.toSet()));
        }
        
        return dto;
    }
    
    public Person toEntity(PersonCreateDTO dto) {   
        Person person = new Person();
        person.setId(dto.getId());
        person.setUsername(dto.getUsername());
        person.setPassword(dto.getPassword()); // Will be encoded in service
        person.setEmail(dto.getEmail());
        person.setPhone(dto.getPhone());
        person.setFullName(dto.getFullName());
        person.setStatus(dto.getStatus());
        person.setIdentityCard(dto.getIdentityCard());
        person.setPassport(dto.getPassport());
        person.setDateOfBirth(dto.getDateOfBirth());
        person.setNationality(dto.getNationality());
        return person;
    }
}
