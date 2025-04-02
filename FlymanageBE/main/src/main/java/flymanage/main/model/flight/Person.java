package flymanage.main.model.flight;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import flymanage.main.model.login.Role;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "hanh_khach") 
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;


    @Lob
    @Column(name = "avatar", columnDefinition = "TEXT")
    private String avatar;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "status") 
    private Integer status;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "updated_date")
    private LocalDate updatedDate;

    @Column(name = "cmnd")
    private String identityCard;

    @Column(name = "ho_chieu")
    private String passport;

    @Column(name = "ngay_sinh")
    private LocalDate dateOfBirth;

    @Column(name = "quoc_tich")
    private String nationality;

    @OneToMany(mappedBy = "passenger")
    private List<Booking> bookings;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDate.now();
        updatedDate = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDate.now();
    }

    public void updateAvatar(String avatarData) {
        this.setAvatar(avatarData);
    }
}