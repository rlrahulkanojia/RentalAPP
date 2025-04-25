//
//  PropertyRentalApp.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import SwiftUI

@main
struct PropertyRentalApp: App {
    @StateObject private var authViewModel = AuthViewModel()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authViewModel)
        }
    }
}

struct ContentView: View {
    @EnvironmentObject private var authViewModel: AuthViewModel
    
    var body: some View {
        Group {
            if authViewModel.isAuthenticated {
                MainTabView()
            } else {
                AuthenticationView()
            }
        }
        .onAppear {
            authViewModel.checkAuthentication()
        }
    }
}

struct MainTabView: View {
    @EnvironmentObject private var authViewModel: AuthViewModel
    
    var body: some View {
        TabView {
            if authViewModel.currentUser?.isPropertyOwner == true {
                // Property Owner Tabs
                PropertyOwnerDashboardView()
                    .tabItem {
                        Label("Dashboard", systemImage: "house.fill")
                    }
                
                PropertyListView()
                    .tabItem {
                        Label("Properties", systemImage: "building.2.fill")
                    }
                
                ContractsListView()
                    .tabItem {
                        Label("Contracts", systemImage: "doc.text.fill")
                    }
            } else if authViewModel.currentUser?.isTenant == true {
                // Tenant Tabs
                TenantDashboardView()
                    .tabItem {
                        Label("Dashboard", systemImage: "house.fill")
                    }
                
                PropertySearchView()
                    .tabItem {
                        Label("Search", systemImage: "magnifyingglass")
                    }
                
                TenantContractsView()
                    .tabItem {
                        Label("Contracts", systemImage: "doc.text.fill")
                    }
            } else {
                // Default Tabs (User not registered as property owner or tenant)
                UserRoleSelectionView()
                    .tabItem {
                        Label("Register", systemImage: "person.fill.badge.plus")
                    }
                
                PropertySearchView()
                    .tabItem {
                        Label("Search", systemImage: "magnifyingglass")
                    }
            }
            
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.fill")
                }
        }
    }
}

// Placeholder views - these will be implemented in separate files
struct AuthenticationView: View {
    var body: some View {
        Text("Authentication View")
    }
}

struct PropertyOwnerDashboardView: View {
    var body: some View {
        Text("Property Owner Dashboard")
    }
}

struct PropertyListView: View {
    var body: some View {
        Text("Property List")
    }
}

struct ContractsListView: View {
    var body: some View {
        Text("Contracts List")
    }
}

struct TenantDashboardView: View {
    var body: some View {
        Text("Tenant Dashboard")
    }
}

struct PropertySearchView: View {
    var body: some View {
        Text("Property Search")
    }
}

struct TenantContractsView: View {
    var body: some View {
        Text("Tenant Contracts")
    }
}

struct UserRoleSelectionView: View {
    var body: some View {
        Text("User Role Selection")
    }
}

struct ProfileView: View {
    var body: some View {
        Text("Profile")
    }
}
