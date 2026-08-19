package com.nextime.push;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;

@Component
public class WebPushAudience {

    private static final List<String> ALLOWED_EMAILS = List.of(
            "test2@example.com",
            "bella020207@naver.com"
    );

    public boolean allows(String email) {
        return email != null
                && ALLOWED_EMAILS.contains(email.trim().toLowerCase(Locale.ROOT));
    }

    public List<String> emails() {
        return ALLOWED_EMAILS;
    }
}
