package flymanage.main.controller.flight;


import flymanage.main.controller.dto.flight.RoleDTO;
import flymanage.main.model.flight.ERole;
import flymanage.main.service.flight.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@PreAuthorize("hasRole('ADMIN')")  
public class RoleController {
    
    @Autowired
    private RoleService roleService;
    
    @GetMapping
    public List<RoleDTO> getAllRoles() {
        return roleService.findAll();
    }
    
    @GetMapping("/{id}")
    public RoleDTO getRole(@PathVariable Integer id) {
        return roleService.findById(id);
    }
    
    @GetMapping("/name/{name}")
    public RoleDTO getRoleByName(@PathVariable ERole name) {
        return roleService.findByName(name);
    }
    
    @PostMapping
    public RoleDTO createRole(@RequestBody RoleDTO roleDTO) {
        return roleService.create(roleDTO);
    }
    
    @PutMapping("/{id}")
    public RoleDTO updateRole(@PathVariable Integer id, @RequestBody RoleDTO roleDTO) {
        return roleService.update(id, roleDTO);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer id) {
        roleService.delete(id);
        return ResponseEntity.ok().build();
    }
}