package flymanage.main.service.flight;

import flymanage.main.controller.dto.flight.PersonCreateDTO;
import flymanage.main.controller.dto.flight.PersonDTO;
import flymanage.main.controller.dto.other.ChangePasswordRequest;
import flymanage.main.mapper.PersonMapper;
import flymanage.main.model.flight.ERole;
import flymanage.main.model.flight.Person;
import flymanage.main.model.login.Role;
import flymanage.main.repo.flight.*;
import flymanage.main.repo.login.RoleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class PersonService {
    
    @Autowired
    private PersonRepository personRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PersonMapper personMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<PersonDTO> findAll() {
        return personRepository.findAll()
                .stream()
                .map(personMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public PersonDTO findById(Integer id) {
        return personRepository.findById(id)
                .map(personMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Person not found"));
    }
    
    public PersonDTO findByUsername(String username) {
        return personRepository.findByUsername(username)
                .map(personMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Person not found"));
    }
    
    public PersonDTO create(PersonCreateDTO personDTO) {

        validateUniqueFields(personDTO);
        
        Person person = personMapper.toEntity(personDTO);
        

        person.setPassword(passwordEncoder.encode(personDTO.getPassword()));

        Set<Role> roles = new HashSet<>();
        if (personDTO.getRoles() == null || personDTO.getRoles().isEmpty()) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Default role not found"));
            roles.add(userRole);
        } else {

            for (ERole roleEnum : personDTO.getRoles()) {
                Role role = roleRepository.findByName(roleEnum)
                    .orElseThrow(() -> new RuntimeException("Role " + roleEnum + " not found"));
                roles.add(role);
            }
        }
        person.setRoles(roles);
        
        Person savedPerson = personRepository.save(person);
        return personMapper.toDTO(savedPerson);
    }
    
    public PersonDTO update(Integer id, PersonDTO personDTO) {
        Person existingPerson = personRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Person not found"));
        

        validateUniqueFieldsForUpdate(personDTO, id);
        
   
        existingPerson.setEmail(personDTO.getEmail());
        existingPerson.setPhone(personDTO.getPhone());
        existingPerson.setFullName(personDTO.getFullName());
        existingPerson.setStatus(personDTO.getStatus());
        existingPerson.setIdentityCard(personDTO.getIdentityCard());
        existingPerson.setPassport(personDTO.getPassport());
        existingPerson.setDateOfBirth(personDTO.getDateOfBirth());
        existingPerson.setNationality(personDTO.getNationality());
        
        Person updatedPerson = personRepository.save(existingPerson);
        return personMapper.toDTO(updatedPerson);
    }
    
    public PersonDTO updateRoles(Integer id, Set<ERole> newRoles) {
        Person person = personRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Person not found"));

        Set<Role> roles = new HashSet<>();
        for (ERole roleEnum : newRoles) {
            Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new RuntimeException("Role " + roleEnum + " not found"));
            roles.add(role);
        }
        
        person.setRoles(roles);
        Person updatedPerson = personRepository.save(person);
        return personMapper.toDTO(updatedPerson);
    }

    public void delete(Integer id) {
        if (!personRepository.existsById(id)) {
            throw new RuntimeException("Person not found");
        }
        personRepository.deleteById(id);
    }
    
    private void validateUniqueFields(PersonCreateDTO dto) {
        if (personRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (personRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (dto.getIdentityCard() != null && 
            personRepository.existsByIdentityCard(dto.getIdentityCard())) {
            throw new RuntimeException("Identity card already exists");
        }
        if (dto.getPassport() != null && 
            personRepository.existsByPassport(dto.getPassport())) {
            throw new RuntimeException("Passport already exists");
        }
    }

    public List<PersonDTO> findByRole(ERole role) {
        return personRepository.findByRole(role)
                .stream()
                .map(personMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    private void validateUniqueFieldsForUpdate(PersonDTO dto, Integer id) {
        Person existingPerson = personRepository.findById(id).get();
        
        if (!existingPerson.getEmail().equals(dto.getEmail()) && 
            personRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (dto.getIdentityCard() != null && 
            !existingPerson.getIdentityCard().equals(dto.getIdentityCard()) && 
            personRepository.existsByIdentityCard(dto.getIdentityCard())) {
            throw new RuntimeException("Identity card already exists");
        }
        if (dto.getPassport() != null && 
            !existingPerson.getPassport().equals(dto.getPassport()) && 
            personRepository.existsByPassport(dto.getPassport())) {
            throw new RuntimeException("Passport already exists");
        }
    }


      public boolean changePassword(ChangePasswordRequest request) {
        Optional<Person> optionalPerson = personRepository.findByUsername(request.getUsername());
        if (optionalPerson.isPresent() && passwordEncoder.matches(request.getOldPassword(), optionalPerson.get().getPassword())) {
            Person person = optionalPerson.get();
            person.setPassword(passwordEncoder.encode(request.getNewPassword()));
            personRepository.save(person);
            return true;
        }
        return false;
    }

    public PersonDTO updateAvatar(Integer id, String avatarData) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Person not found"));
        
        person.updateAvatar(avatarData);
        Person updatedPerson = personRepository.save(person);
        return personMapper.toDTO(updatedPerson);
    }

    public PersonDTO uploadAvatar(Integer id, MultipartFile avatarFile) throws IOException {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Person not found with id: " + id));

        String uploadDir = "uploads/avatars";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String originalFilename = StringUtils.cleanPath(avatarFile.getOriginalFilename());
        String fileName = id + "_" + System.currentTimeMillis() + "_" + originalFilename;

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(avatarFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = "/uploads/avatars/" + fileName;
        person.setAvatar(fileUrl);
        
        Person updatedPerson = personRepository.save(person);
        return personMapper.toDTO(updatedPerson);
    }

    public boolean existsByEmail(String email) {
        return personRepository.existsByEmail(email);
    }

    public void updatePassword(String email, String newPassword) {
        Person person = personRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Person not found with email: " + email));
        person.setPassword(passwordEncoder.encode(newPassword));
        personRepository.save(person);
    }
}