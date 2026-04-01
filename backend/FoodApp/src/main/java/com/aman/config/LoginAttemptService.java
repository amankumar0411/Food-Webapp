package com.aman.config;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Simple in-memory brute-force protection for the login endpoint.
 *
 * Rules:
 *  - After MAX_ATTEMPTS consecutive failures from the same IP the account is
 *    locked for LOCKOUT_MINUTES minutes.
 *  - A successful login resets that IP's counter.
 *  - The entire map is swept every LOCKOUT_MINUTES to evict expired entries
 *    and prevent unbounded memory growth.
 */
@Component
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS    = 5;
    private static final int LOCKOUT_MINUTES = 15;

    /** Per-IP failure record: [failureCount, lockoutExpiryEpochSecond] */
    private final ConcurrentHashMap<String, long[]> attempts = new ConcurrentHashMap<>();

    public LoginAttemptService() {
        // Background sweeper — clears expired entries every LOCKOUT_MINUTES
        ScheduledExecutorService sweeper = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "login-attempt-sweeper");
            t.setDaemon(true);
            return t;
        });
        sweeper.scheduleAtFixedRate(this::sweep, LOCKOUT_MINUTES, LOCKOUT_MINUTES, TimeUnit.MINUTES);
    }

    /** Call this when login FAILS. */
    public void recordFailure(String ip) {
        attempts.compute(ip, (key, existing) -> {
            long[] entry = (existing != null) ? existing : new long[]{0, 0};
            entry[0]++;                                         // increment failure count
            if (entry[0] >= MAX_ATTEMPTS) {
                // Lock out for LOCKOUT_MINUTES from now
                entry[1] = Instant.now().getEpochSecond() + (LOCKOUT_MINUTES * 60L);
            }
            return entry;
        });
    }

    /** Call this when login SUCCEEDS — resets the failure counter. */
    public void recordSuccess(String ip) {
        attempts.remove(ip);
    }

    /**
     * Returns true if this IP is currently locked out.
     * Also auto-unlocks expired lockouts.
     */
    public boolean isBlocked(String ip) {
        long[] entry = attempts.get(ip);
        if (entry == null) return false;

        // If they haven't hit the max attempts yet, not blocked
        if (entry[0] < MAX_ATTEMPTS) return false;

        // If the lockout window has expired, auto-clear and allow
        if (Instant.now().getEpochSecond() > entry[1]) {
            attempts.remove(ip);
            return false;
        }

        return true;
    }

    /** Returns how many seconds remain in the lockout, or 0 if not locked. */
    public long secondsUntilUnlock(String ip) {
        long[] entry = attempts.get(ip);
        if (entry == null || entry[0] < MAX_ATTEMPTS) return 0;
        long remaining = entry[1] - Instant.now().getEpochSecond();
        return Math.max(0, remaining);
    }

    private void sweep() {
        long now = Instant.now().getEpochSecond();
        attempts.entrySet().removeIf(e -> {
            long[] v = e.getValue();
            // Remove if: locked out AND lockout has expired
            return v[0] >= MAX_ATTEMPTS && now > v[1];
        });
    }
}
