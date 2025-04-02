package flymanage.main.controller.flight;

import flymanage.main.service.flight.*;
import flymanage.main.controller.dto.flight.PersonCreateDTO;
import flymanage.main.controller.dto.flight.PersonDTO;
import flymanage.main.controller.dto.other.ChangePasswordRequest;
import flymanage.main.model.flight.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController 
@RequestMapping("/api/persons")
public class PersonController {
    
    @Autowired
    private PersonService personService;
    
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<PersonDTO> getAllPersons() {
        return personService.findAll();
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @securityService.isCurrentUser(#id)")
    public PersonDTO getPerson(@PathVariable Integer id) {
        return personService.findById(id);
    }
    
    @PostMapping
    public PersonDTO createPerson(@RequestBody PersonCreateDTO personDTO) {
        return personService.create(personDTO);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @securityService.isCurrentUser(#id)")
    public PersonDTO updatePerson(@PathVariable Integer id, @RequestBody PersonDTO personDTO) {
        return personService.update(id, personDTO);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deletePerson(@PathVariable Integer id) {
        personService.delete(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public PersonDTO updatePersonRoles(
            @PathVariable Integer id,
            @RequestBody Set<ERole> roles) {
        return personService.updateRoles(id, roles);
    }


    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<PersonDTO> getPersonsByRole(@PathVariable ERole role) {
        return personService.findByRole(role);
    }



      @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        boolean success = personService.changePassword(request);
        if (success) {
            return ResponseEntity.ok("Password changed successfully.");
        } else {
            return ResponseEntity.status(400).body("Invalid username or password.");
        }
    }

    @PostMapping("/{id}/avatar")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @securityService.isCurrentUser(#id)")
    public ResponseEntity<?> uploadAvatar(@PathVariable Integer id, 
                                        @RequestParam("file") MultipartFile avatarFile) {
        try {
            if (avatarFile == null || avatarFile.isEmpty()) {
                return ResponseEntity.badRequest().body("No file uploaded");
            }


            String contentType = avatarFile.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }

            PersonDTO updatedPerson = personService.uploadAvatar(id, avatarFile);
            return ResponseEntity.ok(updatedPerson);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error uploading avatar: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/avatar")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @securityService.isCurrentUser(#id)")
    public ResponseEntity<?> getAvatar(@PathVariable Integer id) {
        try {
            PersonDTO person = personService.findById(id);
            if (person.getAvatar() == null) {
                return ResponseEntity.notFound().build();
            }
            
            Path avatarPath = Paths.get(System.getProperty("user.dir"), person.getAvatar());
            if (!Files.exists(avatarPath)) {
                return ResponseEntity.notFound().build();
            }
            
            byte[] imageBytes = Files.readAllBytes(avatarPath);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error getting avatar: " + e.getMessage());
        }
    }
}

