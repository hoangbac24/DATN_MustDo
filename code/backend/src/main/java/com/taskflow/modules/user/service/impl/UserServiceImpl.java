package com.taskflow.modules.user.service.impl;

import com.taskflow.modules.user.dto.UserDto;
import com.taskflow.modules.user.service.UserService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Override
    public UserDto getCurrentUser() {
        return UserDto.builder()
                .id(UUID.randomUUID())
                .email("user@taskflow.dev")
                .fullName("TaskFlow User")
                .build();
    }
}
