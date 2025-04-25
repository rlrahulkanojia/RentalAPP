//
//  AppConfig.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation

struct AppConfig {
    // API Configuration
    static let baseURL = "http://localhost:8000/api/v1"
    
    // Authentication
    static let tokenExpirationWindow: TimeInterval = 60 * 60 * 24 * 7 // 7 days
    
    // App Settings
    static let appName = "Property Rental"
    static let appVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
    static let appBuild = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1"
    
    // Feature Flags
    static let enablePushNotifications = true
    static let enableAnalytics = true
    
    // Timeouts
    static let networkTimeoutInterval: TimeInterval = 30
    
    // Pagination
    static let defaultPageSize = 20
    
    // Date Formats
    static let apiDateFormat = "yyyy-MM-dd"
    static let displayDateFormat = "MMM d, yyyy"
    
    // Cache Settings
    static let cacheExpirationInterval: TimeInterval = 60 * 15 // 15 minutes
}
