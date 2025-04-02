    package flymanage.main.repo.flight;

    import flymanage.main.model.flight.ERole;
    import flymanage.main.model.flight.Person;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import org.springframework.stereotype.Repository;

    import java.util.List;
    import java.util.Optional;

    @Repository
    public interface PersonRepository extends JpaRepository<Person, Integer> {
        Optional<Person> findByUsername(String username);
        Optional<Person> findByEmail(String email);
        boolean existsByUsername(String username);
        boolean existsByEmail(String email);
        boolean existsByIdentityCard(String identityCard);
        boolean existsByPassport(String passport);
        @Query("SELECT p FROM Person p JOIN p.roles r WHERE r.name = :role")
        List<Person> findByRole(@Param("role") ERole role);

    }