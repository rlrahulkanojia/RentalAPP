//
//  AuthViewModel.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation
import Combine

class AuthViewModel: ObservableObject {
    @Published var isAuthenticated = false
    @Published var isLoading = false
    @Published var error: String?
    @Published var currentUser: User?
    
    private let authService = AuthService.shared
    private var cancellables = Set<AnyCancellable>()
    
    // MARK: - Authentication
    
    func login(email: String, password: String) {
        isLoading = true
        error = nil
        
        authService.login(email: email, password: password)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    
                    if case .failure(let error) = completion {
                        self?.error = error.message
                    }
                },
                receiveValue: { [weak self] user in
                    self?.currentUser = user
                    self?.isAuthenticated = true
                }
            )
            .store(in: &cancellables)
    }
    
    func register(email: String, password: String, fullName: String, phoneNumber: String? = nil) {
        isLoading = true
        error = nil
        
        let userCreate = UserCreate(
            email: email,
            password: password,
            fullName: fullName,
            phoneNumber: phoneNumber,
            isPropertyOwner: false,
            isTenant: false
        )
        
        authService.register(user: userCreate)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    
                    if case .failure(let error) = completion {
                        self?.error = error.message
                    }
                },
                receiveValue: { [weak self] user in
                    self?.login(email: email, password: password)
                }
            )
            .store(in: &cancellables)
    }
    
    func logout() {
        authService.logout()
        isAuthenticated = false
        currentUser = nil
    }
    
    func checkAuthentication() {
        isLoading = true
        
        if authService.isAuthenticated {
            fetchCurrentUser()
        } else {
            isLoading = false
            isAuthenticated = false
        }
    }
    
    func fetchCurrentUser() {
        isLoading = true
        
        authService.getCurrentUser()
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    
                    if case .failure(let error) = completion {
                        if case .unauthorized = error {
                            self?.isAuthenticated = false
                            self?.currentUser = nil
                        } else {
                            self?.error = error.message
                        }
                    }
                },
                receiveValue: { [weak self] user in
                    self?.currentUser = user
                    self?.isAuthenticated = true
                }
            )
            .store(in: &cancellables)
    }
    
    // MARK: - User Management
    
    func updateUserProfile(fullName: String? = nil, email: String? = nil, phoneNumber: String? = nil, password: String? = nil) {
        isLoading = true
        error = nil
        
        let userUpdate = UserUpdate(
            email: email,
            password: password,
            fullName: fullName,
            phoneNumber: phoneNumber
        )
        
        authService.updateUser(userUpdate: userUpdate)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    
                    if case .failure(let error) = completion {
                        self?.error = error.message
                    }
                },
                receiveValue: { [weak self] user in
                    self?.currentUser = user
                }
            )
            .store(in: &cancellables)
    }
    
    func registerAsPropertyOwner() {
        guard let user = currentUser else { return }
        
        isLoading = true
        error = nil
        
        let userUpdate = UserUpdate(isPropertyOwner: true)
        
        authService.updateUser(userUpdate: userUpdate)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    
                    if case .failure(let error) = completion {
                        self?.error = error.message
                    }
                },
                receiveValue: { [weak self] user in
                    self?.currentUser = user
                }
            )
            .store(in: &cancellables)
    }
}
