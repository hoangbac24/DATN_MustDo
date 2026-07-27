package com.taskflow.modules.auth.service.impl;

import com.taskflow.modules.auth.dto.AuthResponse;
import com.taskflow.modules.auth.dto.LoginRequest;
import com.taskflow.modules.auth.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Override
    public AuthResponse login(LoginRequest request) {
        return AuthResponse.builder()
                .accessToken("sample-jwt-token")
                .refreshToken("sample-refresh-token")
                .tokenType("Bearer")
                .expiresIn(86400L)
                .build();
    }
}
