//
//  MaintenanceRequest.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation

struct MaintenanceRequest: Codable, Identifiable {
    let id: Int
    let title: String
    let description: String
    let requestDate: Date
    let status: MaintenanceStatus
    let priority: MaintenancePriority
    let completionDate: Date?
    let cost: Double?
    let notes: String?
    let contractId: Int
    
    enum CodingKeys: String, CodingKey {
        case id
        case title
        case description
        case requestDate = "request_date"
        case status
        case priority
        case completionDate = "completion_date"
        case cost
        case notes
        case contractId = "contract_id"
    }
    
    // Custom decoder to handle date format
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        id = try container.decode(Int.self, forKey: .id)
        title = try container.decode(String.self, forKey: .title)
        description = try container.decode(String.self, forKey: .description)
        status = try container.decode(MaintenanceStatus.self, forKey: .status)
        priority = try container.decode(MaintenancePriority.self, forKey: .priority)
        cost = try container.decodeIfPresent(Double.self, forKey: .cost)
        notes = try container.decodeIfPresent(String.self, forKey: .notes)
        contractId = try container.decode(Int.self, forKey: .contractId)
        
        // Parse request date string
        let requestDateString = try container.decode(String.self, forKey: .requestDate)
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        
        if let date = dateFormatter.date(from: requestDateString) {
            requestDate = date
        } else {
            throw DecodingError.dataCorruptedError(
                forKey: .requestDate,
                in: container,
                debugDescription: "Request date string does not match expected format."
            )
        }
        
        // Parse completion date string if present
        if let completionDateString = try container.decodeIfPresent(String.self, forKey: .completionDate) {
            if let date = dateFormatter.date(from: completionDateString) {
                completionDate = date
            } else {
                throw DecodingError.dataCorruptedError(
                    forKey: .completionDate,
                    in: container,
                    debugDescription: "Completion date string does not match expected format."
                )
            }
        } else {
            completionDate = nil
        }
    }
    
    // Custom encoder to handle date format
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encode(id, forKey: .id)
        try container.encode(title, forKey: .title)
        try container.encode(description, forKey: .description)
        try container.encode(status, forKey: .status)
        try container.encode(priority, forKey: .priority)
        try container.encodeIfPresent(cost, forKey: .cost)
        try container.encodeIfPresent(notes, forKey: .notes)
        try container.encode(contractId, forKey: .contractId)
        
        // Format dates to strings
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        
        let requestDateString = dateFormatter.string(from: requestDate)
        try container.encode(requestDateString, forKey: .requestDate)
        
        if let completionDate = completionDate {
            let completionDateString = dateFormatter.string(from: completionDate)
            try container.encode(completionDateString, forKey: .completionDate)
        }
    }
    
    // Computed properties
    var isCompleted: Bool {
        return status == .completed
    }
    
    var daysOpen: Int? {
        guard let endDate = completionDate ?? Date() else { return nil }
        let calendar = Calendar.current
        let components = calendar.dateComponents([.day], from: requestDate, to: endDate)
        return components.day
    }
}

struct MaintenanceRequestCreate: Codable {
    let title: String
    let description: String
    let requestDate: Date
    let priority: MaintenancePriority
    let contractId: Int
    
    enum CodingKeys: String, CodingKey {
        case title
        case description
        case requestDate = "request_date"
        case priority
        case contractId = "contract_id"
    }
    
    // Custom encoder to handle date format
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encode(title, forKey: .title)
        try container.encode(description, forKey: .description)
        try container.encode(priority, forKey: .priority)
        try container.encode(contractId, forKey: .contractId)
        
        // Format date to string
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AppConfig.apiDateFormat
        let dateString = dateFormatter.string(from: requestDate)
        try container.encode(dateString, forKey: .requestDate)
    }
}

struct MaintenanceRequestUpdate: Codable {
    let title: String?
    let description: String?
    let status: MaintenanceStatus?
    let priority: MaintenancePriority?
    let completionDate: Date?
    let cost: Double?
    let notes: String?
    
    enum CodingKeys: String, CodingKey {
        case title
        case description
        case status
        case priority
        case completionDate = "completion_date"
        case cost
        case notes
    }
    
    // Custom encoder to handle date format
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encodeIfPresent(title, forKey: .title)
        try container.encodeIfPresent(description, forKey: .description)
        try container.encodeIfPresent(status, forKey: .status)
        try container.encodeIfPresent(priority, forKey: .priority)
        try container.encodeIfPresent(cost, forKey: .cost)
        try container.encodeIfPresent(notes, forKey: .notes)
        
        // Format date to string if present
        if let date = completionDate {
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = AppConfig.apiDateFormat
            let dateString = dateFormatter.string(from: date)
            try container.encode(dateString, forKey: .completionDate)
        }
    }
}

enum MaintenanceStatus: String, Codable {
    case pending
    case inProgress = "in_progress"
    case completed
    case rejected
    
    var displayName: String {
        switch self {
        case .pending:
            return "Pending"
        case .inProgress:
            return "In Progress"
        case .completed:
            return "Completed"
        case .rejected:
            return "Rejected"
        }
    }
    
    var color: String {
        switch self {
        case .pending:
            return "yellow"
        case .inProgress:
            return "blue"
        case .completed:
            return "green"
        case .rejected:
            return "red"
        }
    }
}

enum MaintenancePriority: String, Codable {
    case low
    case medium
    case high
    case emergency
    
    var displayName: String {
        switch self {
        case .low:
            return "Low"
        case .medium:
            return "Medium"
        case .high:
            return "High"
        case .emergency:
            return "Emergency"
        }
    }
    
    var color: String {
        switch self {
        case .low:
            return "green"
        case .medium:
            return "blue"
        case .high:
            return "orange"
        case .emergency:
            return "red"
        }
    }
}
