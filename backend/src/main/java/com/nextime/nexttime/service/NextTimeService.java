package com.nextime.nexttime.service;

import com.nextime.nexttime.dto.NextTimeSessionResponse;
import com.nextime.nexttime.entity.NextTimeSession;
import com.nextime.nexttime.repository.NextTimeSessionRepository;
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
