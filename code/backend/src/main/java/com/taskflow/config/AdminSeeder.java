package com.taskflow.config;

import com.taskflow.modules.user.entity.RoleEntity;
import com.taskflow.modules.user.entity.UserEntity;
import com.taskflow.modules.user.repository.RoleRepository;
import com.taskflow.modules.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@gmail.com";
        String rawPassword = "12345678";

        RoleEntity adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new RoleEntity("ROLE_ADMIN", "System Administrator Role")));

        RoleEntity userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new RoleEntity("ROLE_USER", "Standard User Role")));

        Set<RoleEntity> roles = new HashSet<>();
        roles.add(adminRole);
        roles.add(userRole);

        userRepository.findByEmail(adminEmail).ifPresentOrElse(
                user -> {
                    user.setPassword(passwordEncoder.encode(rawPassword));
                    user.setIsEmailVerified(true);
                    user.setStatus("ACTIVE");
                    user.setRoles(roles);
                    userRepository.save(user);
                    log.info("Successfully updated existing Admin account: {}", adminEmail);
                },
                () -> {
                    UserEntity adminUser = new UserEntity();
                    adminUser.setEmail(adminEmail);
                    adminUser.setPassword(passwordEncoder.encode(rawPassword));
                    adminUser.setFullName("System Administrator");
                    adminUser.setIsEmailVerified(true);
                    adminUser.setStatus("ACTIVE");
                    adminUser.setRoles(roles);
                    userRepository.save(adminUser);
                    log.info("Successfully seeded new Admin account: {}", adminEmail);
                }
        );
    }
}
