//
//  Tenant.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation

struct Tenant: Codable, Identifiable {
    let id: Int
    let dateOfBirth: Date
    let occupation: String?
    let employer: String?
    let annualIncome: Int?
    let identificationType: String
    let identificationNumber: String
    let emergencyContactName: String?
    let emergencyContactPhone: String?
    let references: String?
    let userId: Int
    
    enum CodingKeys: String, CodingKey {
        case id
        case dateOfBirth = "date_of_birth"
        case occupation
        case employer
        case annualIncome = "annual_income"
        case identificationType = "identification_type"
        case identificationNumber = "identification_number"
        case emergencyContactName = "emergency_contact_name"
        case emergencyContactPhone = "emergency_contact_phone"
        case references
        case userId = "user_id"
    }
    
    // Custom decoder to handle date format
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        id = try container.decode(Int.self, forKey: .id)
        occupation = try container.decodeIfPresent(String.self, forKey: .occupation)
        employer = try container.decodeIfPresent(String.self, forKey: .employer)
        annualIncome = try container.decodeIfPresent(Int.self, forKey: .annualIncome)
        identificationType = try container.decode(String.self, forKey: .identificationType)
        identificationNumber = try container.decode(String.self, forKey: .identificationNumber)
        emergencyContactName = try container.decodeIfPresent(String.self, forKey: .emergencyContactName)
        emergencyContactPhone = try container.decodeIfPresent(String.self, forKey: .emergencyContactPhone)
        references = try container.decodeIfPresent(String.self, forKey: .references)
        userId = try container.decode(Int.self, forKey: .userId)
        
        // Parse date string
        let dateString = try container.decode(String.self, forKey: .dateOfBirth)
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        
        if let date = dateFormatter.date(from: dateString) {
            dateOfBirth = date
        } else {
            throw DecodingError.dataCorruptedError(
                forKey: .dateOfBirth,
                in: container,
                debugDescription: "Date string does not match expected format."
            )
        }
    }
    
    // Custom encoder to handle date format
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encode(id, forKey: .id)
        try container.encodeIfPresent(occupation, forKey: .occupation)
        try container.encodeIfPresent(employer, forKey: .employer)
        try container.encodeIfPresent(annualIncome, forKey: .annualIncome)
        try container.encode(identificationType, forKey: .identificationType)
        try container.encode(identificationNumber, forKey: .identificationNumber)
        try container.encodeIfPresent(emergencyContactName, forKey: .emergencyContactName)
        try container.encodeIfPresent(emergencyContactPhone, forKey: .emergencyContactPhone)
        try container.encodeIfPresent(references, forKey: .references)
        try container.encode(userId, forKey: .userId)
        
        // Format date to string
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        let dateString = dateFormatter.string(from: dateOfBirth)
        try container.encode(dateString, forKey: .dateOfBirth)
    }
    
    // Computed property to parse references JSON
    var referencesList: [String] {
        guard let referencesString = references else { return [] }
        
        do {
            if let jsonData = referencesString.data(using: .utf8),
               let jsonArray = try JSONSerialization.jsonObject(with: jsonData) as? [String] {
                return jsonArray
            }
        } catch {
            print("Error parsing references: \(error)")
        }
        
        return []
    }
}

struct TenantCreate: Codable {
    let dateOfBirth: Date
    let occupation: String?
    let employer: String?
    let annualIncome: Int?
    let identificationType: String
    let identificationNumber: String
    let emergencyContactName: String?
    let emergencyContactPhone: String?
    let references: String?
    
    enum CodingKeys: String, CodingKey {
        case dateOfBirth = "date_of_birth"
        case occupation
        case employer
        case annualIncome = "annual_income"
        case identificationType = "identification_type"
        case identificationNumber = "identification_number"
        case emergencyContactName = "emergency_contact_name"
        case emergencyContactPhone = "emergency_contact_phone"
        case references
    }
    
    // Custom encoder to handle date format
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encodeIfPresent(occupation, forKey: .occupation)
        try container.encodeIfPresent(employer, forKey: .employer)
        try container.encodeIfPresent(annualIncome, forKey: .annualIncome)
        try container.encode(identificationType, forKey: .identificationType)
        try container.encode(identificationNumber, forKey: .identificationNumber)
        try container.encodeIfPresent(emergencyContactName, forKey: .emergencyContactName)
        try container.encodeIfPresent(emergencyContactPhone, forKey: .emergencyContactPhone)
        try container.encodeIfPresent(references, forKey: .references)
        
        // Format date to string
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        let dateString = dateFormatter.string(from: dateOfBirth)
        try container.encode(dateString, forKey: .dateOfBirth)
    }
}

struct TenantUpdate: Codable {
    let dateOfBirth: Date?
    let occupation: String?
    let employer: String?
    let annualIncome: Int?
    let emergencyContactName: String?
    let emergencyContactPhone: String?
    let references: String?
    
    enum CodingKeys: String, CodingKey {
        case dateOfBirth = "date_of_birth"
        case occupation
        case employer
        case annualIncome = "annual_income"
        case emergencyContactName = "emergency_contact_name"
        case emergencyContactPhone = "emergency_contact_phone"
        case references
    }
    
    // Custom encoder to handle date format
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encodeIfPresent(occupation, forKey: .occupation)
        try container.encodeIfPresent(employer, forKey: .employer)
        try container.encodeIfPresent(annualIncome, forKey: .annualIncome)
        try container.encodeIfPresent(emergencyContactName, forKey: .emergencyContactName)
        try container.encodeIfPresent(emergencyContactPhone, forKey: .emergencyContactPhone)
        try container.encodeIfPresent(references, forKey: .references)
        
        // Format date to string if present
        if let birthDate = dateOfBirth {
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = AppConfig.apiDateFormat
            let dateString = dateFormatter.string(from: birthDate)
            try container.encode(dateString, forKey: .dateOfBirth)
        }
    }
}
