//
//  RentalContract.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation

struct RentalContract: Codable, Identifiable {
    let id: Int
    let startDate: Date
    let endDate: Date
    let monthlyRent: Double
    let securityDeposit: Double
    let isActive: Bool
    let paymentDueDay: Int
    let contractTerms: String?
    let signedByOwner: Bool
    let signedByTenant: Bool
    let contractFileUrl: String?
    let propertyId: Int
    let tenantId: Int
    
    enum CodingKeys: String, CodingKey {
        case id
        case startDate = "start_date"
        case endDate = "end_date"
        case monthlyRent = "monthly_rent"
        case securityDeposit = "security_deposit"
        case isActive = "is_active"
        case paymentDueDay = "payment_due_day"
        case contractTerms = "contract_terms"
        case signedByOwner = "signed_by_owner"
        case signedByTenant = "signed_by_tenant"
        case contractFileUrl = "contract_file_url"
        case propertyId = "property_id"
        case tenantId = "tenant_id"
    }
    
    // Custom decoder to handle date format
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        id = try container.decode(Int.self, forKey: .id)
        monthlyRent = try container.decode(Double.self, forKey: .monthlyRent)
        securityDeposit = try container.decode(Double.self, forKey: .securityDeposit)
        isActive = try container.decode(Bool.self, forKey: .isActive)
        paymentDueDay = try container.decode(Int.self, forKey: .paymentDueDay)
        contractTerms = try container.decodeIfPresent(String.self, forKey: .contractTerms)
        signedByOwner = try container.decode(Bool.self, forKey: .signedByOwner)
        signedByTenant = try container.decode(Bool.self, forKey: .signedByTenant)
        contractFileUrl = try container.decodeIfPresent(String.self, forKey: .contractFileUrl)
        propertyId = try container.decode(Int.self, forKey: .propertyId)
        tenantId = try container.decode(Int.self, forKey: .tenantId)
        
        // Parse date strings
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        
        let startDateString = try container.decode(String.self, forKey: .startDate)
        if let date = dateFormatter.date(from: startDateString) {
            startDate = date
        } else {
            throw DecodingError.dataCorruptedError(
                forKey: .startDate,
                in: container,
                debugDescription: "Start date string does not match expected format."
            )
        }
        
        let endDateString = try container.decode(String.self, forKey: .endDate)
        if let date = dateFormatter.date(from: endDateString) {
            endDate = date
        } else {
            throw DecodingError.dataCorruptedError(
                forKey: .endDate,
                in: container,
                debugDescription: "End date string does not match expected format."
            )
        }
    }
    
    // Custom encoder to handle date format
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encode(id, forKey: .id)
        try container.encode(monthlyRent, forKey: .monthlyRent)
        try container.encode(securityDeposit, forKey: .securityDeposit)
        try container.encode(isActive, forKey: .isActive)
        try container.encode(paymentDueDay, forKey: .paymentDueDay)
        try container.encodeIfPresent(contractTerms, forKey: .contractTerms)
        try container.encode(signedByOwner, forKey: .signedByOwner)
        try container.encode(signedByTenant, forKey: .signedByTenant)
        try container.encodeIfPresent(contractFileUrl, forKey: .contractFileUrl)
        try container.encode(propertyId, forKey: .propertyId)
        try container.encode(tenantId, forKey: .tenantId)
        
        // Format dates to strings
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        
        let startDateString = dateFormatter.string(from: startDate)
        try container.encode(startDateString, forKey: .startDate)
        
        let endDateString = dateFormatter.string(from: endDate)
        try container.encode(endDateString, forKey: .endDate)
    }
    
    // Computed properties
    var contractFileURL: URL? {
        guard let urlString = contractFileUrl else { return nil }
        return URL(string: urlString)
    }
    
    var durationInMonths: Int {
        let calendar = Calendar.current
        let components = calendar.dateComponents([.month], from: startDate, to: endDate)
        return components.month ?? 0
    }
    
    var isExpiring: Bool {
        let calendar = Calendar.current
        let today = Date()
        let components = calendar.dateComponents([.day], from: today, to: endDate)
        return isActive && (components.day ?? 0) <= 30
    }
}

struct RentalContractCreate: Codable {
    let startDate: Date
    let endDate: Date
    let monthlyRent: Double
    let securityDeposit: Double
    let paymentDueDay: Int
    let contractTerms: String?
    let propertyId: Int
    let tenantId: Int
    
    enum CodingKeys: String, CodingKey {
        case startDate = "start_date"
        case endDate = "end_date"
        case monthlyRent = "monthly_rent"
        case securityDeposit = "security_deposit"
        case paymentDueDay = "payment_due_day"
        case contractTerms = "contract_terms"
        case propertyId = "property_id"
        case tenantId = "tenant_id"
    }
    
    // Custom encoder to handle date format
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encode(monthlyRent, forKey: .monthlyRent)
        try container.encode(securityDeposit, forKey: .securityDeposit)
        try container.encode(paymentDueDay, forKey: .paymentDueDay)
        try container.encodeIfPresent(contractTerms, forKey: .contractTerms)
        try container.encode(propertyId, forKey: .propertyId)
        try container.encode(tenantId, forKey: .tenantId)
        
        // Format dates to strings
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        
        let startDateString = dateFormatter.string(from: startDate)
        try container.encode(startDateString, forKey: .startDate)
        
        let endDateString = dateFormatter.string(from: endDate)
        try container.encode(endDateString, forKey: .endDate)
    }
}

struct RentalContractUpdate: Codable {
    let startDate: Date?
    let endDate: Date?
    let monthlyRent: Double?
    let securityDeposit: Double?
    let isActive: Bool?
    let paymentDueDay: Int?
    let contractTerms: String?
    let signedByOwner: Bool?
    let signedByTenant: Bool?
    let contractFileUrl: String?
    
    enum CodingKeys: String, CodingKey {
        case startDate = "start_date"
        case endDate = "end_date"
        case monthlyRent = "monthly_rent"
        case securityDeposit = "security_deposit"
        case isActive = "is_active"
        case paymentDueDay = "payment_due_day"
        case contractTerms = "contract_terms"
        case signedByOwner = "signed_by_owner"
        case signedByTenant = "signed_by_tenant"
        case contractFileUrl = "contract_file_url"
    }
    
    // Custom encoder to handle date format
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encodeIfPresent(monthlyRent, forKey: .monthlyRent)
        try container.encodeIfPresent(securityDeposit, forKey: .securityDeposit)
        try container.encodeIfPresent(isActive, forKey: .isActive)
        try container.encodeIfPresent(paymentDueDay, forKey: .paymentDueDay)
        try container.encodeIfPresent(contractTerms, forKey: .contractTerms)
        try container.encodeIfPresent(signedByOwner, forKey: .signedByOwner)
        try container.encodeIfPresent(signedByTenant, forKey: .signedByTenant)
        try container.encodeIfPresent(contractFileUrl, forKey: .contractFileUrl)
        
        // Format dates to strings if present
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        
        if let date = startDate {
            let startDateString = dateFormatter.string(from: date)
            try container.encode(startDateString, forKey: .startDate)
        }
        
        if let date = endDate {
            let endDateString = dateFormatter.string(from: date)
            try container.encode(endDateString, forKey: .endDate)
        }
    }
}
