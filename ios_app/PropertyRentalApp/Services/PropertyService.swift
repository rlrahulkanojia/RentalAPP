//
//  PropertyService.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation
import Combine

class PropertyService {
    static let shared = PropertyService()
    
    private let apiService = APIService.shared
    
    private init() {}
    
    // MARK: - Property Listing
    
    func getProperties(
        city: String? = nil,
        state: String? = nil,
        minBedrooms: Int? = nil,
        maxRent: Double? = nil,
        propertyType: String? = nil,
        page: Int = 1,
        limit: Int = AppConfig.defaultPageSize
    ) -> AnyPublisher<[Property], APIError> {
        var queryItems = [
            URLQueryItem(name: "skip", value: String((page - 1) * limit)),
            URLQueryItem(name: "limit", value: String(limit))
        ]
        
        if let city = city {
            queryItems.append(URLQueryItem(name: "city", value: city))
        }
        
        if let state = state {
            queryItems.append(URLQueryItem(name: "state", value: state))
        }
        
        if let minBedrooms = minBedrooms {
            queryItems.append(URLQueryItem(name: "min_bedrooms", value: String(minBedrooms)))
        }
        
        if let maxRent = maxRent {
            queryItems.append(URLQueryItem(name: "max_rent", value: String(maxRent)))
        }
        
        if let propertyType = propertyType {
            queryItems.append(URLQueryItem(name: "property_type", value: propertyType))
        }
        
        let endpoint = Endpoint(
            path: "/properties",
            queryItems: queryItems
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func getMyProperties(page: Int = 1, limit: Int = AppConfig.defaultPageSize) -> AnyPublisher<[Property], APIError> {
        let queryItems = [
            URLQueryItem(name: "skip", value: String((page - 1) * limit)),
            URLQueryItem(name: "limit", value: String(limit))
        ]
        
        let endpoint = Endpoint(
            path: "/properties/my-properties",
            queryItems: queryItems
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func getProperty(id: Int) -> AnyPublisher<Property, APIError> {
        let endpoint = Endpoint(path: "/properties/\(id)")
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Property Management
    
    func createProperty(property: PropertyCreate) -> AnyPublisher<Property, APIError> {
        guard let body = apiService.encode(property) else {
            return Fail(error: APIError.unknown).eraseToAnyPublisher()
        }
        
        let endpoint = Endpoint(
            path: "/properties",
            method: .post,
            body: body
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func updateProperty(id: Int, property: PropertyUpdate) -> AnyPublisher<Property, APIError> {
        guard let body = apiService.encode(property) else {
            return Fail(error: APIError.unknown).eraseToAnyPublisher()
        }
        
        let endpoint = Endpoint(
            path: "/properties/\(id)",
            method: .put,
            body: body
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    func deleteProperty(id: Int) -> AnyPublisher<Property, APIError> {
        let endpoint = Endpoint(
            path: "/properties/\(id)",
            method: .delete
        )
        
        return apiService.request(endpoint: endpoint)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Helper Methods
    
    func formatAmenities(amenities: [String]) -> String? {
        guard !amenities.isEmpty else { return nil }
        
        do {
            let data = try JSONSerialization.data(withJSONObject: amenities)
            return String(data: data, encoding: .utf8)
        } catch {
            print("Error formatting amenities: \(error)")
            return nil
        }
    }
    
    func formatImageURLs(imageURLs: [URL]) -> String? {
        guard !imageURLs.isEmpty else { return nil }
        
        let urlStrings = imageURLs.map { $0.absoluteString }
        
        do {
            let data = try JSONSerialization.data(withJSONObject: urlStrings)
            return String(data: data, encoding: .utf8)
        } catch {
            print("Error formatting image URLs: \(error)")
            return nil
        }
    }
}
