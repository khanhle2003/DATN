package flymanage.main.repo.login;

import flymanage.main.model.flight.Person;

import java.util.Optional;

import org.springframework.data.jpa.repository.*;;




public interface UserRepositor extends JpaRepository<Person,Integer> {
    Optional<Person> findByUsername(String username);
    Optional<Person> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
    
