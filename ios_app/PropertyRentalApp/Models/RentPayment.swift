//
//  RentPayment.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation

struct RentPayment: Codable, Identifiable {
    let id: Int
    let amount: Double
    let paymentDate: Date
    let paymentMethod: String?
    let transactionId: String?
    let isLate: Bool
    let lateFee: Double
    let notes: String?
    let contractId: Int
    
    enum CodingKeys: String, CodingKey {
        case id
        case amount
        case paymentDate = "payment_date"
        case paymentMethod = "payment_method"
        case transactionId = "transaction_id"
        case isLate = "is_late"
        case lateFee = "late_fee"
        case notes
        case contractId = "contract_id"
    }
    
    // Custom decoder to handle date format
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        id = try container.decode(Int.self, forKey: .id)
        amount = try container.decode(Double.self, forKey: .amount)
        paymentMethod = try container.decodeIfPresent(String.self, forKey: .paymentMethod)
        transactionId = try container.decodeIfPresent(String.self, forKey: .transactionId)
        isLate = try container.decode(Bool.self, forKey: .isLate)
        lateFee = try container.decode(Double.self, forKey: .lateFee)
        notes = try container.decodeIfPresent(String.self, forKey: .notes)
        contractId = try container.decode(Int.self, forKey: .contractId)
        
        // Parse date string
        let dateString = try container.decode(String.self, forKey: .paymentDate)
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        
        if let date = dateFormatter.date(from: dateString) {
            paymentDate = date
        } else {
            throw DecodingError.dataCorruptedError(
                forKey: .paymentDate,
                in: container,
                debugDescription: "Payment date string does not match expected format."
            )
        }
    }
    
    // Custom encoder to handle date format
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encode(id, forKey: .id)
        try container.encode(amount, forKey: .amount)
        try container.encodeIfPresent(paymentMethod, forKey: .paymentMethod)
        try container.encodeIfPresent(transactionId, forKey: .transactionId)
        try container.encode(isLate, forKey: .isLate)
        try container.encode(lateFee, forKey: .lateFee)
        try container.encodeIfPresent(notes, forKey: .notes)
        try container.encode(contractId, forKey: .contractId)
        
        // Format date to string
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        let dateString = dateFormatter.string(from: paymentDate)
        try container.encode(dateString, forKey: .paymentDate)
    }
    
    // Computed property
    var totalAmount: Double {
        return amount + lateFee
    }
}

struct RentPaymentCreate: Codable {
    let amount: Double
    let paymentDate: Date
    let paymentMethod: String?
    let transactionId: String?
    let notes: String?
    let contractId: Int
    
    enum CodingKeys: String, CodingKey {
        case amount
        case paymentDate = "payment_date"
        case paymentMethod = "payment_method"
        case transactionId = "transaction_id"
        case notes
        case contractId = "contract_id"
    }
    
    // Custom encoder to handle date format
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encode(amount, forKey: .amount)
        try container.encodeIfPresent(paymentMethod, forKey: .paymentMethod)
        try container.encodeIfPresent(transactionId, forKey: .transactionId)
        try container.encodeIfPresent(notes, forKey: .notes)
        try container.encode(contractId, forKey: .contractId)
        
        // Format date to string
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        let dateString = dateFormatter.string(from: paymentDate)
        try container.encode(dateString, forKey: .paymentDate)
    }
}

struct RentPaymentUpdate: Codable {
    let amount: Double?
    let paymentDate: Date?
    let paymentMethod: String?
    let transactionId: String?
    let isLate: Bool?
    let lateFee: Double?
    let notes: String?
    
    enum CodingKeys: String, CodingKey {
        case amount
        case paymentDate = "payment_date"
        case paymentMethod = "payment_method"
        case transactionId = "transaction_id"
        case isLate = "is_late"
        case lateFee = "late_fee"
        case notes
    }
    
    // Custom encoder to handle date format
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encodeIfPresent(amount, forKey: .amount)
        try container.encodeIfPresent(paymentMethod, forKey: .paymentMethod)
        try container.encodeIfPresent(transactionId, forKey: .transactionId)
        try container.encodeIfPresent(isLate, forKey: .isLate)
        try container.encodeIfPresent(lateFee, forKey: .lateFee)
        try container.encodeIfPresent(notes, forKey: .notes)
        
        // Format date to string if present
        if let date = paymentDate {
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = AppConfig.apiDateFormat
            let dateString = dateFormatter.string(from: date)
            try container.encode(dateString, forKey: .paymentDate)
        }
    }
}
