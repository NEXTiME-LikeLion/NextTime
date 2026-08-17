package com.nextime.home.api;

import com.nextime.common.api.ApiResponse;
import com.nextime.home.application.HomeService;
import com.nextime.security.AuthenticatedUser;
import com.nextime.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/home")
public class HomeController {

    private final HomeService homeService;

    @GetMapping
    public ApiResponse<HomeResponse> getHome(@CurrentUser AuthenticatedUser currentUser) {
        return ApiResponse.success(homeService.getHome(currentUser.userId()));
    }
}
