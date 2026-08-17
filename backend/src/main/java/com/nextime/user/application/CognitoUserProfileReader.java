package com.nextime.user.application;

public interface CognitoUserProfileReader {
    CognitoUserProfile readByAccessToken(String accessToken);
}
