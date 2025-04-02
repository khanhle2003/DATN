package flymanage.main.config;

import flymanage.main.model.flight.Person;
import flymanage.main.model.login.Role;
import flymanage.main.model.flight.ERole;
import flymanage.main.repo.flight.PersonRepository;
import flymanage.main.repo.login.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (personRepository.count() == 0) {

            Person admin = new Person();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin11"));
            admin.setEmail("admin@system.com");
            admin.setFullName("System Admin");
            admin.setStatus(1); 
            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role ADMIN is not found."));
            roles.add(adminRole);
            admin.setRoles(roles);

            personRepository.save(admin);
            
            System.out.println("Created default admin account");
        }
    }
} 