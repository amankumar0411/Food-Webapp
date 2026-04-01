package com.aman.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    // Medium #10 — Swagger disabled by default; set SWAGGER_ENABLED=true only in dev
    @Value("${swagger.enabled:false}")
    private boolean swaggerEnabled;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ── CORS ──────────────────────────────────────────────────────────────
            .cors(cors -> cors.configurationSource(request -> {
                org.springframework.web.cors.CorsConfiguration config =
                        new org.springframework.web.cors.CorsConfiguration();
                config.setAllowedOrigins(List.of(
                    "http://localhost:3000",
                    "https://foodapp-tw.vercel.app",
                    "https://foodapp-aec.vercel.app"
                ));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                config.setAllowCredentials(true);
                return config;
            }))
            // ── CSRF / SESSION ────────────────────────────────────────────────────
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // ── ROUTE AUTHORISATION ───────────────────────────────────────────────
            .authorizeHttpRequests(auth -> {
                auth.requestMatchers("/register/**").permitAll();
                auth.requestMatchers("/food/fetch/**").permitAll();

                // Medium #10 — Swagger only accessible when SWAGGER_ENABLED=true env var is set
                if (swaggerEnabled) {
                    auth.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll();
                } else {
                    auth.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").denyAll();
                }

                auth.anyRequest().authenticated();
            })

            // ── JWT FILTER ────────────────────────────────────────────────────────
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

            // ── SECURITY HEADERS (Medium #12) ─────────────────────────────────────
            .headers(headers -> headers
                // Prevent clickjacking — only same-origin iframes allowed
                .frameOptions(frame -> frame.sameOrigin())

                // Prevent MIME-type sniffing
                .contentTypeOptions(cto -> {})

                // HSTS — force HTTPS for 1 year including subdomains
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000)
                )

                // Don't send full Referer URL to external sites
                .referrerPolicy(rp -> rp
                    .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                )

                // Basic Content-Security-Policy — restricts where scripts/styles/images can load from
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives(
                        "default-src 'self'; " +
                        "script-src 'self'; " +
                        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                        "font-src 'self' https://fonts.gstatic.com; " +
                        "img-src 'self' data: https:; " +
                        "connect-src 'self'"
                    )
                )
            );

        return http.build();
    }
}
