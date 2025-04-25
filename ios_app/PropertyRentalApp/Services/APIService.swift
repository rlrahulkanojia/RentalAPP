//
//  APIService.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation
import Combine

enum APIError: Error {
    case invalidURL
    case invalidResponse
    case httpError(Int)
    case decodingError(Error)
    case serverError(String)
    case networkError(Error)
    case unauthorized
    case unknown
    
    var message: String {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid response from server"
        case .httpError(let statusCode):
            return "HTTP Error: \(statusCode)"
        case .decodingError(let error):
            return "Failed to decode response: \(error.localizedDescription)"
        case .serverError(let message):
            return "Server error: \(message)"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .unauthorized:
            return "Unauthorized access"
        case .unknown:
            return "Unknown error occurred"
        }
    }
}

class APIService {
    static let shared = APIService()
    
    private let session: URLSession
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder
    
    private init() {
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = AppConfig.networkTimeoutInterval
        configuration.timeoutIntervalForResource = AppConfig.networkTimeoutInterval
        
        self.session = URLSession(configuration: configuration)
        
        self.decoder = JSONDecoder()
        self.encoder = JSONEncoder()
        
        // Configure date formatting
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        decoder.dateDecodingStrategy = .formatted(dateFormatter)
        encoder.dateEncodingStrategy = .formatted(dateFormatter)
    }
    
    // MARK: - Generic Request Methods
    
    func request<T: Decodable>(endpoint: Endpoint) -> AnyPublisher<T, APIError> {
        guard let url = endpoint.url else {
            return Fail(error: APIError.invalidURL).eraseToAnyPublisher()
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue
        
        // Add headers
        endpoint.headers.forEach { request.addValue($0.value, forHTTPHeaderField: $0.key) }
        
        // Add body if needed
        if let body = endpoint.body {
            request.httpBody = body
            
            if request.value(forHTTPHeaderField: "Content-Type") == nil {
                request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            }
        }
        
        // Add auth token if available
        if let token = KeychainService.shared.getAuthToken(), endpoint.requiresAuth {
            request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        return session.dataTaskPublisher(for: request)
            .tryMap { data, response in
                guard let httpResponse = response as? HTTPURLResponse else {
                    throw APIError.invalidResponse
                }
                
                if httpResponse.statusCode == 401 {
                    throw APIError.unauthorized
                }
                
                guard (200...299).contains(httpResponse.statusCode) else {
                    // Try to parse error message from response
                    if let errorResponse = try? JSONDecoder().decode(ErrorResponse.self, from: data) {
                        throw APIError.serverError(errorResponse.detail)
                    } else {
                        throw APIError.httpError(httpResponse.statusCode)
                    }
                }
                
                return data
            }
            .decode(type: T.self, decoder: decoder)
            .mapError { error in
                if let apiError = error as? APIError {
                    return apiError
                } else if let urlError = error as? URLError {
                    return APIError.networkError(urlError)
                } else if let decodingError = error as? DecodingError {
                    return APIError.decodingError(decodingError)
                } else {
                    return APIError.unknown
                }
            }
            .eraseToAnyPublisher()
    }
    
    // MARK: - Helper Methods
    
    func encode<T: Encodable>(_ value: T) -> Data? {
        try? encoder.encode(value)
    }
}

// MARK: - Supporting Types

struct ErrorResponse: Codable {
    let detail: String
}

enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case delete = "DELETE"
    case patch = "PATCH"
}

struct Endpoint {
    let path: String
    let method: HTTPMethod
    let headers: [String: String]
    let queryItems: [URLQueryItem]?
    let body: Data?
    let requiresAuth: Bool
    
    init(
        path: String,
        method: HTTPMethod = .get,
        headers: [String: String] = [:],
        queryItems: [URLQueryItem]? = nil,
        body: Data? = nil,
        requiresAuth: Bool = true
    ) {
        self.path = path
        self.method = method
        self.headers = headers
        self.queryItems = queryItems
        self.body = body
        self.requiresAuth = requiresAuth
    }
    
    var url: URL? {
        var components = URLComponents(string: AppConfig.baseURL)
        components?.path += path
        
        if let queryItems = queryItems, !queryItems.isEmpty {
            components?.queryItems = queryItems
        }
        
        return components?.url
    }
}
