//
//  User.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation

struct User: Codable, Identifiable {
    let id: Int
    let email: String
    let fullName: String
    let phoneNumber: String?
    let isActive: Bool
    let isPropertyOwner: Bool
    let isTenant: Bool
    
    enum CodingKeys: String, CodingKey {
        case id
        case email
        case fullName = "full_name"
        case phoneNumber = "phone_number"
        case isActive = "is_active"
        case isPropertyOwner = "is_property_owner"
        case isTenant = "is_tenant"
    }
}

struct UserCreate: Codable {
    let email: String
    let password: String
    let fullName: String
    let phoneNumber: String?
    let isPropertyOwner: Bool
    let isTenant: Bool
    
    enum CodingKeys: String, CodingKey {
        case email
        case password
        case fullName = "full_name"
        case phoneNumber = "phone_number"
        case isPropertyOwner = "is_property_owner"
        case isTenant = "is_tenant"
    }
}

struct UserUpdate: Codable {
    let email: String?
    let password: String?
    let fullName: String?
    let phoneNumber: String?
    
    enum CodingKeys: String, CodingKey {
        case email
        case password
        case fullName = "full_name"
        case phoneNumber = "phone_number"
    }
}

struct AuthResponse: Codable {
    let accessToken: String
    let tokenType: String
    
    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case tokenType = "token_type"
    }
}
