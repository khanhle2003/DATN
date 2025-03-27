package flymanage.main.model.login;

import flymanage.main.model.flight.ERole;
import flymanage.main.repo.login.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        // Kiểm tra nếu chưa có roles nào
        if (roleRepository.count() == 0) {
            // Tạo ROLE_ADMIN
            Role adminRole = new Role();
            adminRole.setName(ERole.ROLE_ADMIN);
            adminRole.setDescription("Administrator role");
            roleRepository.save(adminRole);

            // Tạo ROLE_STAFF
            Role staffRole = new Role();
            staffRole.setName(ERole.ROLE_STAFF);
            staffRole.setDescription("Staff role");
            roleRepository.save(staffRole);

            // Tạo ROLE_USER
            Role userRole = new Role();
            userRole.setName(ERole.ROLE_USER);
            userRole.setDescription("User role");
            roleRepository.save(userRole);
        }
    }
}
