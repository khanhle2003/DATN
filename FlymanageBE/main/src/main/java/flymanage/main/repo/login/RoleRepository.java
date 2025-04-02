package flymanage.main.repo.login;

import org.springframework.data.jpa.repository.JpaRepository;
import flymanage.main.model.flight.ERole;
import flymanage.main.model.login.Role;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);
    boolean existsByName(ERole name);
}