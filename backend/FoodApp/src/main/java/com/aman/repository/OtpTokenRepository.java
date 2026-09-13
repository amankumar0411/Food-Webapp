package com.aman.repository;

import com.aman.model.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    List<OtpToken> findByIdentifierAndIsUsedFalseOrderByExpiresAtDesc(String identifier);
    Optional<OtpToken> findTopByIdentifierAndIsUsedFalseOrderByExpiresAtDesc(String identifier);
}
