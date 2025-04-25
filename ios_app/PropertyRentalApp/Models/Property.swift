//
//  Property.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation

struct Property: Codable, Identifiable {
    let id: Int
    let title: String
    let description: String?
    let propertyType: String
    let address: String
    let city: String
    let state: String
    let zipCode: String
    let country: String
    let bedrooms: Int
    let bathrooms: Double
    let areaSqft: Double?
    let monthlyRent: Double
    let securityDeposit: Double
    let isAvailable: Bool
    let amenities: String?
    let images: String?
    let ownerId: Int
    
    enum CodingKeys: String, CodingKey {
        case id
        case title
        case description
        case propertyType = "property_type"
        case address
        case city
        case state
        case zipCode = "zip_code"
        case country
        case bedrooms
        case bathrooms
        case areaSqft = "area_sqft"
        case monthlyRent = "monthly_rent"
        case securityDeposit = "security_deposit"
        case isAvailable = "is_available"
        case amenities
        case images
        case ownerId = "owner_id"
    }
    
    // Computed properties
    var amenitiesList: [String] {
        guard let amenitiesString = amenities else { return [] }
        
        do {
            if let jsonData = amenitiesString.data(using: .utf8),
               let jsonArray = try JSONSerialization.jsonObject(with: jsonData) as? [String] {
                return jsonArray
            }
        } catch {
            print("Error parsing amenities: \(error)")
        }
        
        return []
    }
    
    var imageURLs: [URL] {
        guard let imagesString = images else { return [] }
        
        do {
            if let jsonData = imagesString.data(using: .utf8),
               let jsonArray = try JSONSerialization.jsonObject(with: jsonData) as? [String] {
                return jsonArray.compactMap { URL(string: $0) }
            }
        } catch {
            print("Error parsing images: \(error)")
        }
        
        return []
    }
}

struct PropertyCreate: Codable {
    let title: String
    let description: String?
    let propertyType: String
    let address: String
    let city: String
    let state: String
    let zipCode: String
    let country: String
    let bedrooms: Int
    let bathrooms: Double
    let areaSqft: Double?
    let monthlyRent: Double
    let securityDeposit: Double
    let amenities: String?
    let images: String?
    
    enum CodingKeys: String, CodingKey {
        case title
        case description
        case propertyType = "property_type"
        case address
        case city
        case state
        case zipCode = "zip_code"
        case country
        case bedrooms
        case bathrooms
        case areaSqft = "area_sqft"
        case monthlyRent = "monthly_rent"
        case securityDeposit = "security_deposit"
        case amenities
        case images
    }
}

struct PropertyUpdate: Codable {
    let title: String?
    let description: String?
    let propertyType: String?
    let address: String?
    let city: String?
    let state: String?
    let zipCode: String?
    let country: String?
    let bedrooms: Int?
    let bathrooms: Double?
    let areaSqft: Double?
    let monthlyRent: Double?
    let securityDeposit: Double?
    let isAvailable: Bool?
    let amenities: String?
    let images: String?
    
    enum CodingKeys: String, CodingKey {
        case title
        case description
        case propertyType = "property_type"
        case address
        case city
        case state
        case zipCode = "zip_code"
        case country
        case bedrooms
        case bathrooms
        case areaSqft = "area_sqft"
        case monthlyRent = "monthly_rent"
        case securityDeposit = "security_deposit"
        case isAvailable = "is_available"
        case amenities
        case images
    }
}
