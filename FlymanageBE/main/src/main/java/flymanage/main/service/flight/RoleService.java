package flymanage.main.service.flight;


import flymanage.main.controller.dto.flight.RoleDTO;
import flymanage.main.mapper.RoleMapper;
import flymanage.main.model.login.Role;
import flymanage.main.model.flight.ERole;
import flymanage.main.repo.flight.*;
import flymanage.main.repo.login.RoleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoleService {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private RoleMapper roleMapper;
    
    public List<RoleDTO> findAll() {
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public RoleDTO findById(Integer id) {
        return roleRepository.findById(id)
                .map(roleMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }
    
    public RoleDTO findByName(ERole name) {
        return roleRepository.findByName(name)
                .map(roleMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }
    
    public RoleDTO create(RoleDTO roleDTO) {
 
        if (roleRepository.existsByName(roleDTO.getName())) {
            throw new RuntimeException("Role already exists");
        }
        
        Role role = roleMapper.toEntity(roleDTO);
        Role savedRole = roleRepository.save(role);
        return roleMapper.toDTO(savedRole);
    }
    
    public RoleDTO update(Integer id, RoleDTO roleDTO) {
        if (!roleRepository.existsById(id)) {
            throw new RuntimeException("Role not found");
        }

        Role existingRole = roleRepository.findById(id).get();
        if (!existingRole.getName().equals(roleDTO.getName()) && 
            roleRepository.existsByName(roleDTO.getName())) {
            throw new RuntimeException("Role name already exists");
        }
        
        Role role = roleMapper.toEntity(roleDTO);
        role.setId(id);
        Role updatedRole = roleRepository.save(role);
        return roleMapper.toDTO(updatedRole);
    }
    
    public void delete(Integer id) {
        if (!roleRepository.existsById(id)) {
            throw new RuntimeException("Role not found");
        }
        
        Role role = roleRepository.findById(id).get();

        if (role.getName() == ERole.ROLE_ADMIN || 
            role.getName() == ERole.ROLE_USER) {
            throw new RuntimeException("Cannot delete essential system role");
        }
        
        roleRepository.deleteById(id);
    }

    @Transactional
    public void initializeRoles() {
        for (ERole roleEnum : ERole.values()) {
            if (!roleRepository.existsByName(roleEnum)) {
                Role role = new Role();
                role.setName(roleEnum);
                role.setDescription("System " + roleEnum.name().toLowerCase().substring(5) + " role");
                roleRepository.save(role);
            }
        }
    }
}