package flymanage.main.service.auths;



import flymanage.main.controller.dto.auth.*;
import flymanage.main.controller.dto.flight.PersonCreateDTO;
import flymanage.main.controller.dto.flight.PersonDTO;
import flymanage.main.model.flight.ERole;
import flymanage.main.model.flight.Person;
import flymanage.main.model.login.Role;
import flymanage.main.repo.flight.PersonRepository;
import flymanage.main.repo.login.RoleRepository;
import flymanage.main.security.JwtUtils;
import flymanage.main.service.flight.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PersonService personService;

    public JwtResponse login(LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            )
        );

        // Set the authentication in SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);

        Person person = personRepository.findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Get user roles
        Set<String> roles = person.getRoles().stream()
            .map(role -> role.getName().name())
            .collect(Collectors.toSet());


        return new JwtResponse(jwt, person, roles);
    }

    @Transactional
    public PersonDTO register(PersonCreateDTO registerRequest) {
        // Validate unique fields
        if (personRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (personRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        if (registerRequest.getIdentityCard() != null && 
            personRepository.existsByIdentityCard(registerRequest.getIdentityCard())) {
            throw new RuntimeException("Identity card is already registered");
        }
        if (registerRequest.getPassport() != null && 
            personRepository.existsByPassport(registerRequest.getPassport())) {
            throw new RuntimeException("Passport is already registered");
        }
        Person person = new Person();
        person.setUsername(registerRequest.getUsername());
        person.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        person.setEmail(registerRequest.getEmail());
        person.setPhone(registerRequest.getPhone());
        person.setFullName(registerRequest.getFullName());
        person.setStatus(1); //1 = hoat dong;
        person.setIdentityCard(registerRequest.getIdentityCard());
        person.setPassport(registerRequest.getPassport());
        person.setDateOfBirth(registerRequest.getDateOfBirth());
        person.setNationality(registerRequest.getNationality());

        Set<Role> roles = new HashSet<>();
        if (registerRequest.getRoles() == null || registerRequest.getRoles().isEmpty()) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Default role not found"));
            roles.add(userRole);
        } else {
            registerRequest.getRoles().forEach(role -> {
                Role foundRole = roleRepository.findByName(role)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + role));
                roles.add(foundRole);
            });
        }
        person.setRoles(roles);


        Person savedPerson = personRepository.save(person);
        

        return personService.findById(savedPerson.getId());
    }

    public void logout(String token) {
  
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        

        jwtUtils.invalidateToken(actualToken);
        
   
        SecurityContextHolder.clearContext();
    }
}