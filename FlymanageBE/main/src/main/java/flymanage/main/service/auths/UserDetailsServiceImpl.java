package flymanage.main.service.auths;

import flymanage.main.model.flight.Person;
import flymanage.main.repo.flight.PersonRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final PersonRepository personRepository;

    public UserDetailsServiceImpl(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Person> personOptional = personRepository.findByUsername(username);
    
        if (personOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    
        Person person = personOptional.get();
    
        return User.builder()
                .username(person.getUsername())
                .password(person.getPassword()) 
                .roles(person.getRoles().stream()
                    .map(role -> role.getName().name().replace("ROLE_", "")) // Loại bỏ "ROLE_"
                    .toArray(String[]::new))
                .build();
    }}