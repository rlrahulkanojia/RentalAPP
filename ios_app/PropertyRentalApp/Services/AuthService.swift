//
//  AuthService.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation
import Combine

class AuthService {
    static let shared = AuthService()
    
    private let apiService = APIService.shared
    private let keychainService = KeychainService.shared
    
    private init() {}
    
    // MARK: - Authentication
    
    func login(email: String, password: String) -> AnyPublisher<User, APIError> {
        let loginData = ["username": email, "password": password]
        
        guard let body = try? JSONSerialization.data(withJSONObject: loginData) else {
            return Fail(error: APIError.unknown).eraseToAnyPublisher()
        }
        
        let endpoint = Endpoint(
            path: "/auth/login",
            method: .post,
            body: body,
            requiresAuth: false
        )
        
        return apiService.request(endpoint: endpoint)
            .flatMap { (authResponse: AuthResponse) -> AnyPublisher<User, APIError> in
                // Save the token
                _ = self.keychainService.saveAuthToken(authResponse.accessToken)
                
                // Get the user profile
                return self.getCurrentUser()
            }
            .eraseToAnyPublisher()
    }
    
    func register(user: UserCreate) -> AnyPublisher<User, APIError> {
        guard let body = apiService.encode(user) else {
            return Fail(error: APIError.unknown).eraseToAnyPublisher()
        }
        
        let endpoint = Endpoint(
            path: "/auth/register",
            method: .post,
            body: body,
            requiresAuth: false
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func getCurrentUser() -> AnyPublisher<User, APIError> {
        let endpoint = Endpoint(path: "/users/me")
        
        return apiService.request(endpoint: endpoint)
            .handleEvents(receiveOutput: { [weak self] user in
                // Save user ID
                _ = self?.keychainService.saveUserId(user.id)
            })
            .eraseToAnyPublisher()
    }
    
    func logout() {
        _ = keychainService.clearAll()
    }
    
    // MARK: - User Management
    
    func updateUser(userUpdate: UserUpdate) -> AnyPublisher<User, APIError> {
        guard let body = apiService.encode(userUpdate) else {
            return Fail(error: APIError.unknown).eraseToAnyPublisher()
        }
        
        let endpoint = Endpoint(
            path: "/users/me",
            method: .put,
            body: body
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Authentication State
    
    var isAuthenticated: Bool {
        return keychainService.getAuthToken() != nil
    }
    
    var currentUserId: Int? {
        return keychainService.getUserId()
    }
}
