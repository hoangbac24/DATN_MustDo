package com.taskflow.modules.user.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.user.dto.UserDto;
import com.taskflow.modules.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        UserDto user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}
