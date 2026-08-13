package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.dto.ProfileDTO;
import com.abhishekmandal.water_usage_backend.entity.AppUser;
import com.abhishekmandal.water_usage_backend.entity.CommunityAdmin;
import com.abhishekmandal.water_usage_backend.entity.Resident;
import com.abhishekmandal.water_usage_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    public ProfileDTO getProfile(Long userId) {
        Optional<AppUser> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        AppUser user = userOpt.get();
        ProfileDTO dto = new ProfileDTO();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setGender(user.getGender());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setAvatarUrl(user.getAvatarUrl());
        
        if (user instanceof Resident) {
            dto.setPhoneNumber(((Resident) user).getPhoneNumber());
            dto.setGovernmentId(((Resident) user).getGovernmentId());
        } else if (user instanceof CommunityAdmin) {
            dto.setPhoneNumber(((CommunityAdmin) user).getPhoneNumber());
            dto.setAadharCard(((CommunityAdmin) user).getAadharCard());
            dto.setPanCard(((CommunityAdmin) user).getPanCard());
            dto.setAddress(((CommunityAdmin) user).getAddress());
            dto.setVerificationStatus(((CommunityAdmin) user).getVerificationStatus());
        }
        
        return dto;
    }

    public ProfileDTO updateProfile(Long userId, ProfileDTO dto) {
        Optional<AppUser> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        AppUser user = userOpt.get();
        user.setName(dto.getName());
        if (dto.getGender() != null) user.setGender(dto.getGender());
        if (dto.getDateOfBirth() != null) user.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getAvatarUrl() != null) user.setAvatarUrl(dto.getAvatarUrl());
        
        if (user instanceof Resident) {
            ((Resident) user).setPhoneNumber(dto.getPhoneNumber());
            if (dto.getGovernmentId() != null) ((Resident) user).setGovernmentId(dto.getGovernmentId());
        } else if (user instanceof CommunityAdmin) {
            ((CommunityAdmin) user).setPhoneNumber(dto.getPhoneNumber());
            if (dto.getAadharCard() != null) ((CommunityAdmin) user).setAadharCard(dto.getAadharCard());
            if (dto.getPanCard() != null) ((CommunityAdmin) user).setPanCard(dto.getPanCard());
            if (dto.getAddress() != null) ((CommunityAdmin) user).setAddress(dto.getAddress());
            // Intentionally not setting verificationStatus, that's handled by Main Admin
        }
        
        userRepository.save(user);
        return getProfile(userId);
    }
}
