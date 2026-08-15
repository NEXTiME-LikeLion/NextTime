package com.nextime.user.infrastructure.cognito;

import com.nextime.security.CognitoProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.net.http.HttpClient;
import java.time.Duration;

@Configuration
public class CognitoClientConfig {

    @Bean("cognitoRestClient")
    RestClient cognitoRestClient(CognitoProperties properties) {
        URI issuer = URI.create(properties.issuerUri());
        String endpoint = issuer.getScheme() + "://" + issuer.getAuthority();

        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(3));

        return RestClient.builder()
                .baseUrl(endpoint)
                .requestFactory(requestFactory)
                .build();
    }
}
