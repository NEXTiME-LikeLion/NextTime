package com.nextime.user.infrastructure.cognito;

import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.user.application.CognitoUserProfile;
import com.nextime.user.application.CognitoUserProfileReader;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Component
public class AwsCognitoUserProfileReader implements CognitoUserProfileReader {

    private static final MediaType AWS_JSON = MediaType.parseMediaType("application/x-amz-json-1.1");
    private static final String GET_USER_TARGET = "AWSCognitoIdentityProviderService.GetUser";

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public AwsCognitoUserProfileReader(
            @Qualifier("cognitoRestClient") RestClient restClient,
            ObjectMapper objectMapper
    ) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
    }

    @Override
    public CognitoUserProfile readByAccessToken(String accessToken) {
        try {
            String responseBody = restClient.post()
                    .uri("/")
                    .contentType(AWS_JSON)
                    .header("X-Amz-Target", GET_USER_TARGET)
                    .body(createRequestBody(accessToken))
                    .retrieve()
                    .body(String.class);

            return parseProfile(responseBody);
        } catch (RestClientResponseException exception) {
            if (exception.getStatusCode().is4xxClientError()) {
                throw new BusinessException(ErrorCode.UNAUTHENTICATED);
            }
            throw new BusinessException(
                    ErrorCode.EXTERNAL_SERVICE_ERROR,
                    "Cognito 사용자 정보를 조회하지 못했습니다."
            );
        } catch (ResourceAccessException exception) {
            throw new BusinessException(
                    ErrorCode.EXTERNAL_SERVICE_ERROR,
                    "Cognito 사용자 정보 조회 시간이 초과되었습니다."
            );
        }
    }

    private String createRequestBody(String accessToken) {
        try {
            return objectMapper.writeValueAsString(Map.of("AccessToken", accessToken));
        } catch (Exception exception) {
            throw new BusinessException(
                    ErrorCode.INTERNAL_ERROR,
                    "Cognito 요청을 생성하지 못했습니다."
            );
        }
    }

    private CognitoUserProfile parseProfile(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            Map<String, String> attributes = new HashMap<>();

            for (JsonNode attribute : root.path("UserAttributes")) {
                attributes.put(
                        attribute.path("Name").asText(),
                        attribute.path("Value").asText()
                );
            }

            String subject = requireAttribute(attributes, "sub");
            String email = requireAttribute(attributes, "email");
            boolean emailVerified = Boolean.parseBoolean(
                    attributes.getOrDefault("email_verified", "false")
            );

            return new CognitoUserProfile(subject, email, emailVerified);
        } catch (BusinessException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new BusinessException(ErrorCode.INVALID_COGNITO_PROFILE);
        }
    }

    private String requireAttribute(Map<String, String> attributes, String name) {
        String value = attributes.get(name);
        if (value == null || value.isBlank()) {
            throw new BusinessException(
                    ErrorCode.INVALID_COGNITO_PROFILE,
                    "Cognito 사용자 속성이 누락되었습니다: " + name
            );
        }
        return value;
    }
}
