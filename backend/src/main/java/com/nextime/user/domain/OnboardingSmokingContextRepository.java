package com.nextime.user.domain;

import com.nextime.smokingcontext.domain.SmokingContext;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface OnboardingSmokingContextRepository extends JpaRepository<SmokingContext, UUID> {
    List<SmokingContext> findAllByCodeIn(Collection<String> codes);
}
