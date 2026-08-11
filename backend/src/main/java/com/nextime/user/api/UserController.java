package com.nextime.user.api;

import com.nextime.common.api.ApiResponse;
import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.security.AuthenticatedUser;
import com.nextime.security.CurrentUser;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    ApiResponse<MeResponse> me(@CurrentUser AuthenticatedUser currentUser) {
        User user = userRepository.findById(currentUser.userId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_REGISTERED));
        return ApiResponse.success(MeResponse.from(user));
    }
}
