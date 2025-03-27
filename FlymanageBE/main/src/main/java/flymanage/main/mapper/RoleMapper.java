package flymanage.main.mapper;


import flymanage.main.controller.dto.flight.RoleDTO;
import flymanage.main.model.login.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {
    
    public RoleDTO toDTO(Role role) {
        RoleDTO dto = new RoleDTO();
        dto.setId(role.getId());
        dto.setName(role.getName());
        dto.setDescription(role.getDescription());
        return dto;
    }
    
    public Role toEntity(RoleDTO dto) {
        Role role = new Role();
        role.setId(dto.getId());
        role.setName(dto.getName());
        role.setDescription(dto.getDescription());
        return role;
    }
}
