package com.nextime.nexttime.application;

import com.nextime.nexttime.api.NextTimeSessionResponse;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NextTimeService {

    private final NextTimeSessionRepository nextTimeSessionRepository;

    /** NextTime 세션 생성 **/
    @Transactional
    public NextTimeSessionResponse createNextTimeSession(UUID userId) {
        NextTimeSession session = new NextTimeSession(userId);
        NextTimeSession savedSession = nextTimeSessionRepository.save(session);

        return new NextTimeSessionResponse(savedSession);
    }

}
