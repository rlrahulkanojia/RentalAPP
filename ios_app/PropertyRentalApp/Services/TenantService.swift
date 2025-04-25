//
//  TenantService.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation
import Combine

class TenantService {
    static let shared = TenantService()
    
    private let apiService = APIService.shared
    
    private init() {}
    
    // MARK: - Tenant Profile
    
    func registerAsTenant(tenant: TenantCreate) -> AnyPublisher<Tenant, APIError> {
        guard let body = apiService.encode(tenant) else {
            return Fail(error: APIError.unknown).eraseToAnyPublisher()
        }
        
        let endpoint = Endpoint(
            path: "/tenants/register",
            method: .post,
            body: body
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func getTenantProfile() -> AnyPublisher<Tenant, APIError> {
        let endpoint = Endpoint(path: "/tenants/me")
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func updateTenantProfile(tenant: TenantUpdate) -> AnyPublisher<Tenant, APIError> {
        guard let body = apiService.encode(tenant) else {
            return Fail(error: APIError.unknown).eraseToAnyPublisher()
        }
        
        let endpoint = Endpoint(
            path: "/tenants/me",
            method: .put,
            body: body
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func getTenant(id: Int) -> AnyPublisher<Tenant, APIError> {
        let endpoint = Endpoint(path: "/tenants/\(id)")
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Helper Methods
    
    func formatReferences(references: [String]) -> String? {
        guard !references.isEmpty else { return nil }
        
        do {
            let data = try JSONSerialization.data(withJSONObject: references)
            return String(data: data, encoding: .utf8)
        } catch {
            print("Error formatting references: \(error)")
            return nil
        }
    }
}
