package com.nextime.user.application;

import com.nextime.user.domain.User;

public record UserRegistrationResult(User user, boolean newlyRegistered) {

    public static UserRegistrationResult created(User user) {
        return new UserRegistrationResult(user, true);
    }

    public static UserRegistrationResult existing(User user) {
        return new UserRegistrationResult(user, false);
    }
}
