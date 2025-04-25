//
//  KeychainService.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import Foundation
import Security

class KeychainService {
    static let shared = KeychainService()
    
    private init() {}
    
    // MARK: - Constants
    
    private enum KeychainKeys {
        static let authToken = "com.propertyrental.authtoken"
        static let refreshToken = "com.propertyrental.refreshtoken"
        static let userId = "com.propertyrental.userid"
    }
    
    // MARK: - Auth Token
    
    func saveAuthToken(_ token: String) -> Bool {
        return saveString(token, forKey: KeychainKeys.authToken)
    }
    
    func getAuthToken() -> String? {
        return getString(forKey: KeychainKeys.authToken)
    }
    
    func deleteAuthToken() -> Bool {
        return deleteItem(forKey: KeychainKeys.authToken)
    }
    
    // MARK: - Refresh Token
    
    func saveRefreshToken(_ token: String) -> Bool {
        return saveString(token, forKey: KeychainKeys.refreshToken)
    }
    
    func getRefreshToken() -> String? {
        return getString(forKey: KeychainKeys.refreshToken)
    }
    
    func deleteRefreshToken() -> Bool {
        return deleteItem(forKey: KeychainKeys.refreshToken)
    }
    
    // MARK: - User ID
    
    func saveUserId(_ userId: Int) -> Bool {
        return saveString(String(userId), forKey: KeychainKeys.userId)
    }
    
    func getUserId() -> Int? {
        guard let userIdString = getString(forKey: KeychainKeys.userId) else {
            return nil
        }
        return Int(userIdString)
    }
    
    func deleteUserId() -> Bool {
        return deleteItem(forKey: KeychainKeys.userId)
    }
    
    // MARK: - Clear All
    
    func clearAll() -> Bool {
        let tokenDeleted = deleteAuthToken()
        let refreshTokenDeleted = deleteRefreshToken()
        let userIdDeleted = deleteUserId()
        
        return tokenDeleted && refreshTokenDeleted && userIdDeleted
    }
    
    // MARK: - Private Helper Methods
    
    private func saveString(_ string: String, forKey key: String) -> Bool {
        guard let data = string.data(using: .utf8) else {
            return false
        }
        
        // Create query
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock
        ]
        
        // Delete any existing item
        SecItemDelete(query as CFDictionary)
        
        // Add the new item
        let status = SecItemAdd(query as CFDictionary, nil)
        return status == errSecSuccess
    }
    
    private func getString(forKey key: String) -> String? {
        // Create query
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: kCFBooleanTrue!,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        // Find the item
        var dataTypeRef: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &dataTypeRef)
        
        if status == errSecSuccess, let retrievedData = dataTypeRef as? Data {
            return String(data: retrievedData, encoding: .utf8)
        }
        
        return nil
    }
    
    private func deleteItem(forKey key: String) -> Bool {
        // Create query
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key
        ]
        
        // Delete the item
        let status = SecItemDelete(query as CFDictionary)
        return status == errSecSuccess || status == errSecItemNotFound
    }
}
