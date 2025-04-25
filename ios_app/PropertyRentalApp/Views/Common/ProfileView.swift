//
//  ProfileView.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import SwiftUI

struct ProfileView: View {
    @EnvironmentObject private var authViewModel: AuthViewModel
    @State private var showingEditProfile = false
    @State private var showingLogoutConfirmation = false
    
    var body: some View {
        NavigationView {
            List {
                // User Info Section
                Section(header: Text("User Information")) {
                    if let user = authViewModel.currentUser {
                        HStack {
                            Image(systemName: "person.circle.fill")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 60, height: 60)
                                .foregroundColor(.blue)
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text(user.fullName)
                                    .font(.headline)
                                
                                Text(user.email)
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                                
                                if let phoneNumber = user.phoneNumber {
                                    Text(phoneNumber)
                                        .font(.subheadline)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                        .padding(.vertical, 8)
                        
                        // User Roles
                        HStack {
                            Label("Property Owner", systemImage: "building.2")
                                .foregroundColor(user.isPropertyOwner ? .green : .gray)
                                .opacity(user.isPropertyOwner ? 1.0 : 0.6)
                            
                            Spacer()
                            
                            Label("Tenant", systemImage: "person.fill.questionmark")
                                .foregroundColor(user.isTenant ? .green : .gray)
                                .opacity(user.isTenant ? 1.0 : 0.6)
                        }
                    } else {
                        Text("Loading user information...")
                    }
                }
                
                // Account Actions
                Section(header: Text("Account")) {
                    Button(action: {
                        showingEditProfile = true
                    }) {
                        Label("Edit Profile", systemImage: "pencil")
                    }
                    
                    if authViewModel.currentUser?.isPropertyOwner == false {
                        Button(action: {
                            authViewModel.registerAsPropertyOwner()
                        }) {
                            Label("Register as Property Owner", systemImage: "building.2.fill")
                        }
                    }
                    
                    if authViewModel.currentUser?.isTenant == false {
                        NavigationLink(destination: TenantRegistrationView()) {
                            Label("Register as Tenant", systemImage: "person.fill.badge.plus")
                        }
                    }
                }
                
                // App Information
                Section(header: Text("App Information")) {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("\(AppConfig.appVersion) (\(AppConfig.appBuild))")
                            .foregroundColor(.secondary)
                    }
                    
                    Link(destination: URL(string: "https://example.com/terms")!) {
                        Label("Terms of Service", systemImage: "doc.text")
                    }
                    
                    Link(destination: URL(string: "https://example.com/privacy")!) {
                        Label("Privacy Policy", systemImage: "hand.raised")
                    }
                }
                
                // Logout
                Section {
                    Button(action: {
                        showingLogoutConfirmation = true
                    }) {
                        HStack {
                            Spacer()
                            Text("Logout")
                                .foregroundColor(.red)
                            Spacer()
                        }
                    }
                }
            }
            .listStyle(InsetGroupedListStyle())
            .navigationTitle("Profile")
            .sheet(isPresented: $showingEditProfile) {
                EditProfileView()
            }
            .alert(isPresented: $showingLogoutConfirmation) {
                Alert(
                    title: Text("Logout"),
                    message: Text("Are you sure you want to logout?"),
                    primaryButton: .destructive(Text("Logout")) {
                        authViewModel.logout()
                    },
                    secondaryButton: .cancel()
                )
            }
            .overlay {
                if authViewModel.isLoading {
                    ProgressView()
                        .scaleEffect(1.5)
                        .background(
                            RoundedRectangle(cornerRadius: 10)
                                .fill(Color.white.opacity(0.8))
                                .frame(width: 100, height: 100)
                        )
                }
            }
            .alert(isPresented: Binding<Bool>(
                get: { authViewModel.error != nil },
                set: { if !$0 { authViewModel.error = nil } }
            )) {
                Alert(
                    title: Text("Error"),
                    message: Text(authViewModel.error ?? "An unknown error occurred"),
                    dismissButton: .default(Text("OK"))
                )
            }
        }
    }
}

struct EditProfileView: View {
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject private var authViewModel: AuthViewModel
    
    @State private var fullName: String = ""
    @State private var email: String = ""
    @State private var phoneNumber: String = ""
    @State private var password: String = ""
    @State private var confirmPassword: String = ""
    
    var passwordsMatch: Bool {
        password == confirmPassword
    }
    
    var isFormValid: Bool {
        (password.isEmpty || (password.count >= 8 && passwordsMatch)) &&
        (!fullName.isEmpty || !email.isEmpty || !phoneNumber.isEmpty || !password.isEmpty)
    }
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Personal Information")) {
                    TextField("Full Name", text: $fullName)
                    TextField("Email", text: $email)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                    TextField("Phone Number", text: $phoneNumber)
                        .keyboardType(.phonePad)
                }
                
                Section(header: Text("Change Password (Optional)")) {
                    SecureField("New Password (min 8 characters)", text: $password)
                    SecureField("Confirm New Password", text: $confirmPassword)
                    
                    if !passwordsMatch && !confirmPassword.isEmpty {
                        Text("Passwords do not match")
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                    
                    if !password.isEmpty && password.count < 8 {
                        Text("Password must be at least 8 characters")
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                }
            }
            .navigationTitle("Edit Profile")
            .navigationBarItems(
                leading: Button("Cancel") {
                    presentationMode.wrappedValue.dismiss()
                },
                trailing: Button("Save") {
                    authViewModel.updateUserProfile(
                        fullName: fullName.isEmpty ? nil : fullName,
                        email: email.isEmpty ? nil : email,
                        phoneNumber: phoneNumber.isEmpty ? nil : phoneNumber,
                        password: password.isEmpty ? nil : password
                    )
                    presentationMode.wrappedValue.dismiss()
                }
                .disabled(!isFormValid)
            )
            .onAppear {
                if let user = authViewModel.currentUser {
                    fullName = user.fullName
                    email = user.email
                    phoneNumber = user.phoneNumber ?? ""
                }
            }
        }
    }
}

struct TenantRegistrationView: View {
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject private var authViewModel: AuthViewModel
    @StateObject private var tenantViewModel = TenantViewModel()
    
    @State private var dateOfBirth = Date()
    @State private var occupation = ""
    @State private var employer = ""
    @State private var annualIncome = ""
    @State private var identificationType = "Aadhar"
    @State private var identificationNumber = ""
    @State private var emergencyContactName = ""
    @State private var emergencyContactPhone = ""
    
    let identificationTypes = ["Aadhar", "PAN", "Passport", "Driving License"]
    
    var isFormValid: Bool {
        !identificationNumber.isEmpty
    }
    
    var body: some View {
        Form {
            Section(header: Text("Personal Information")) {
                DatePicker("Date of Birth", selection: $dateOfBirth, displayedComponents: .date)
                
                TextField("Occupation", text: $occupation)
                
                TextField("Employer", text: $employer)
                
                TextField("Annual Income", text: $annualIncome)
                    .keyboardType(.numberPad)
            }
            
            Section(header: Text("Identification")) {
                Picker("ID Type", selection: $identificationType) {
                    ForEach(identificationTypes, id: \.self) {
                        Text($0)
                    }
                }
                
                TextField("ID Number", text: $identificationNumber)
            }
            
            Section(header: Text("Emergency Contact")) {
                TextField("Name", text: $emergencyContactName)
                
                TextField("Phone Number", text: $emergencyContactPhone)
                    .keyboardType(.phonePad)
            }
            
            Section {
                Button(action: {
                    registerAsTenant()
                }) {
                    Text("Register as Tenant")
                        .frame(maxWidth: .infinity)
                        .foregroundColor(.white)
                        .padding()
                        .background(isFormValid ? Color.blue : Color.gray)
                        .cornerRadius(10)
                }
                .disabled(!isFormValid || tenantViewModel.isLoading)
                .listRowInsets(EdgeInsets())
                .padding()
            }
        }
        .navigationTitle("Tenant Registration")
        .overlay {
            if tenantViewModel.isLoading {
                ProgressView()
                    .scaleEffect(1.5)
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color.white.opacity(0.8))
                            .frame(width: 100, height: 100)
                    )
            }
        }
        .alert(isPresented: Binding<Bool>(
            get: { tenantViewModel.error != nil },
            set: { if !$0 { tenantViewModel.error = nil } }
        )) {
            Alert(
                title: Text("Error"),
                message: Text(tenantViewModel.error ?? "An unknown error occurred"),
                dismissButton: .default(Text("OK"))
            )
        }
        .onReceive(tenantViewModel.$registrationComplete) { complete in
            if complete {
                authViewModel.fetchCurrentUser()
                presentationMode.wrappedValue.dismiss()
            }
        }
    }
    
    private func registerAsTenant() {
        let annualIncomeInt = Int(annualIncome) ?? 0
        
        tenantViewModel.registerAsTenant(
            dateOfBirth: dateOfBirth,
            occupation: occupation.isEmpty ? nil : occupation,
            employer: employer.isEmpty ? nil : employer,
            annualIncome: annualIncomeInt > 0 ? annualIncomeInt : nil,
            identificationType: identificationType,
            identificationNumber: identificationNumber,
            emergencyContactName: emergencyContactName.isEmpty ? nil : emergencyContactName,
            emergencyContactPhone: emergencyContactPhone.isEmpty ? nil : emergencyContactPhone
        )
    }
}

// This is a placeholder - you'll need to create this view model
class TenantViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var error: String?
    @Published var registrationComplete = false
    
    private let tenantService = TenantService.shared
    private var cancellables = Set<AnyCancellable>()
    
    func registerAsTenant(
        dateOfBirth: Date,
        occupation: String?,
        employer: String?,
        annualIncome: Int?,
        identificationType: String,
        identificationNumber: String,
        emergencyContactName: String?,
        emergencyContactPhone: String?
    ) {
        isLoading = true
        error = nil
        
        let tenantCreate = TenantCreate(
            dateOfBirth: dateOfBirth,
            occupation: occupation,
            employer: employer,
            annualIncome: annualIncome,
            identificationType: identificationType,
            identificationNumber: identificationNumber,
            emergencyContactName: emergencyContactName,
            emergencyContactPhone: emergencyContactPhone,
            references: nil
        )
        
        tenantService.registerAsTenant(tenant: tenantCreate)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    
                    if case .failure(let error) = completion {
                        self?.error = error.message
                    }
                },
                receiveValue: { [weak self] _ in
                    self?.registrationComplete = true
                }
            )
            .store(in: &cancellables)
    }
}

struct ProfileView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileView()
            .environmentObject(AuthViewModel())
    }
}
