package com.taskflow.modules.auth.service;

import com.taskflow.modules.auth.dto.AuthResponse;
import com.taskflow.modules.auth.dto.LoginRequest;

public interface AuthService {
    AuthResponse login(LoginRequest request);
}
