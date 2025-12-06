package com.mrca.auth.service;

import java.util.Map;

public interface AuthService {
    Map<String, Object> login(String username, String password);

    Map<String, Object> validateToken(String token);

    Map<String, Object> logout(String token);
}
