package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.dto.LoginResponseDTO;
import com.abhishekmandal.water_usage_backend.entity.AppUser;
import com.abhishekmandal.water_usage_backend.entity.CommunityAdmin;
import com.abhishekmandal.water_usage_backend.entity.Resident;
import com.abhishekmandal.water_usage_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.abhishekmandal.water_usage_backend.repository.ApartmentRepository apartmentRepository;

    public LoginResponseDTO register(AppUser user) {
        // Check for duplicate email
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        // Enforce role to be ADMIN for standard registration
        user.setRole("COMMUNITY_ADMIN");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        AppUser savedUser = userRepository.save(user);

        if ("COMMUNITY_ADMIN".equals(savedUser.getRole())) {
            com.abhishekmandal.water_usage_backend.entity.Apartment apt = new com.abhishekmandal.water_usage_backend.entity.Apartment();
            apt.setName(savedUser.getName() + "'s Community");
            apt.setAddress("To be updated in profile");
            apt.setCommunityAdmin((CommunityAdmin) savedUser);
            apartmentRepository.save(apt);
        }

        return buildLoginResponse(savedUser);
    }

    public LoginResponseDTO inviteRegister(AppUser user) {
        // Check for duplicate email
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        // Specifically for invited residents
        user.setRole("RESIDENT");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        AppUser savedUser = userRepository.save(user);
        return buildLoginResponse(savedUser);
    }

    public LoginResponseDTO login(String email, String password) {
        Optional<AppUser> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            AppUser user = userOptional.get();
            
            if ("DELETED_ADMIN".equals(user.getRole())) {
                return null;
            }
            
            // Check if password matches using BCrypt
            if (passwordEncoder.matches(password, user.getPassword())) {
                return buildLoginResponse(user); // Return safe DTO, not entity with password hash
            }
        }
        return null; // login failed
    }

    public AppUser findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    /**
     * Build a safe LoginResponseDTO from an AppUser entity.
     * Never exposes the password hash to the frontend.
     */
    private LoginResponseDTO buildLoginResponse(AppUser user) {
        LoginResponseDTO dto = new LoginResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole());
        dto.setGender(user.getGender());

        if (user instanceof CommunityAdmin ca) {
            dto.setVerificationStatus(ca.getVerificationStatus());
            dto.setPhoneNumber(ca.getPhoneNumber());
        } else if (user instanceof Resident r) {
            dto.setPhoneNumber(r.getPhoneNumber());
            dto.setHouseholdNumber(r.getHouseholdNumber());
        }
        return dto;
    }
}