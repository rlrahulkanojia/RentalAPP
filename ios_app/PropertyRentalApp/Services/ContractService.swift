//
//  ContractService.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation
import Combine

class ContractService {
    static let shared = ContractService()
    
    private let apiService = APIService.shared
    
    private init() {}
    
    // MARK: - Rental Contracts
    
    func getContracts(page: Int = 1, limit: Int = AppConfig.defaultPageSize) -> AnyPublisher<[RentalContract], APIError> {
        let queryItems = [
            URLQueryItem(name: "skip", value: String((page - 1) * limit)),
            URLQueryItem(name: "limit", value: String(limit))
        ]
        
        let endpoint = Endpoint(
            path: "/contracts",
            queryItems: queryItems
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func getContract(id: Int) -> AnyPublisher<RentalContract, APIError> {
        let endpoint = Endpoint(path: "/contracts/\(id)")
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func createContract(contract: RentalContractCreate) -> AnyPublisher<RentalContract, APIError> {
        guard let body = apiService.encode(contract) else {
            return Fail(error: APIError.unknown).eraseToAnyPublisher()
        }
        
        let endpoint = Endpoint(
            path: "/contracts",
            method: .post,
            body: body
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func updateContract(id: Int, contract: RentalContractUpdate) -> AnyPublisher<RentalContract, APIError> {
        guard let body = apiService.encode(contract) else {
            return Fail(error: APIError.unknown).eraseToAnyPublisher()
        }
        
        let endpoint = Endpoint(
            path: "/contracts/\(id)",
            method: .put,
            body: body
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Rent Payments
    
    func getPayments(contractId: Int, page: Int = 1, limit: Int = AppConfig.defaultPageSize) -> AnyPublisher<[RentPayment], APIError> {
        let queryItems = [
            URLQueryItem(name: "skip", value: String((page - 1) * limit)),
            URLQueryItem(name: "limit", value: String(limit))
        ]
        
        let endpoint = Endpoint(
            path: "/contracts/\(contractId)/payments",
            queryItems: queryItems
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func createPayment(contractId: Int, payment: RentPaymentCreate) -> AnyPublisher<RentPayment, APIError> {
        guard let body = apiService.encode(payment) else {
            return Fail(error: APIError.unknown).eraseToAnyPublisher()
        }
        
        let endpoint = Endpoint(
            path: "/contracts/\(contractId)/payments",
            method: .post,
            body: body
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Maintenance Requests
    
    func getMaintenanceRequests(contractId: Int, page: Int = 1, limit: Int = AppConfig.defaultPageSize) -> AnyPublisher<[MaintenanceRequest], APIError> {
        let queryItems = [
            URLQueryItem(name: "skip", value: String((page - 1) * limit)),
            URLQueryItem(name: "limit", value: String(limit))
        ]
        
        let endpoint = Endpoint(
            path: "/contracts/\(contractId)/maintenance",
            queryItems: queryItems
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func createMaintenanceRequest(contractId: Int, request: MaintenanceRequestCreate) -> AnyPublisher<MaintenanceRequest, APIError> {
        guard let body = apiService.encode(request) else {
            return Fail(error: APIError.unknown).eraseToAnyPublisher()
        }
        
        let endpoint = Endpoint(
            path: "/contracts/\(contractId)/maintenance",
            method: .post,
            body: body
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func updateMaintenanceRequest(requestId: Int, request: MaintenanceRequestUpdate) -> AnyPublisher<MaintenanceRequest, APIError> {
        guard let body = apiService.encode(request) else {
            return Fail(error: APIError.unknown).eraseToAnyPublisher()
        }
        
        let endpoint = Endpoint(
            path: "/contracts/maintenance/\(requestId)",
            method: .put,
            body: body
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
}
