//
//  AuthenticationView.swift
//  PropertyRentalApp
//
//  Created on 25/04/2025.
//

import SwiftUI

struct AuthenticationView: View {
    @State private var isLogin = true
    @EnvironmentObject private var authViewModel: AuthViewModel
    
    var body: some View {
        NavigationView {
            VStack {
                // Logo and App Name
                VStack(spacing: 10) {
                    Image(systemName: "building.2.fill")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 80, height: 80)
                        .foregroundColor(.blue)
                    
                    Text(AppConfig.appName)
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    Text("Property Rental Management System")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding(.bottom, 40)
                
                // Login/Register Form
                if isLogin {
                    LoginView()
                } else {
                    RegisterView()
                }
                
                // Toggle between Login and Register
                HStack {
                    Text(isLogin ? "Don't have an account?" : "Already have an account?")
                        .foregroundColor(.secondary)
                    
                    Button(isLogin ? "Register" : "Login") {
                        withAnimation {
                            isLogin.toggle()
                        }
                    }
                    .foregroundColor(.blue)
                }
                .padding(.top, 20)
                
                Spacer()
            }
            .padding()
            .navigationBarHidden(true)
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
        }
    }
}

struct LoginView: View {
    @State private var email = ""
    @State private var password = ""
    @EnvironmentObject private var authViewModel: AuthViewModel
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Login")
                .font(.title)
                .fontWeight(.bold)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            TextField("Email", text: $email)
                .keyboardType(.emailAddress)
                .autocapitalization(.none)
                .disableAutocorrection(true)
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(10)
            
            SecureField("Password", text: $password)
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(10)
            
            Button(action: {
                authViewModel.login(email: email, password: password)
            }) {
                Text("Login")
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .cornerRadius(10)
            }
            .disabled(email.isEmpty || password.isEmpty || authViewModel.isLoading)
            .opacity(email.isEmpty || password.isEmpty || authViewModel.isLoading ? 0.6 : 1)
        }
    }
}

struct RegisterView: View {
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var fullName = ""
    @State private var phoneNumber = ""
    @EnvironmentObject private var authViewModel: AuthViewModel
    
    var passwordsMatch: Bool {
        password == confirmPassword
    }
    
    var isFormValid: Bool {
        !email.isEmpty && !password.isEmpty && !fullName.isEmpty && passwordsMatch && password.count >= 8
    }
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Register")
                .font(.title)
                .fontWeight(.bold)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            ScrollView {
                VStack(spacing: 15) {
                    TextField("Full Name", text: $fullName)
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(10)
                    
                    TextField("Email", text: $email)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(10)
                    
                    TextField("Phone Number (Optional)", text: $phoneNumber)
                        .keyboardType(.phonePad)
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(10)
                    
                    SecureField("Password (min 8 characters)", text: $password)
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(10)
                    
                    SecureField("Confirm Password", text: $confirmPassword)
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(10)
                    
                    if !passwordsMatch && !confirmPassword.isEmpty {
                        Text("Passwords do not match")
                            .foregroundColor(.red)
                            .font(.caption)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                    
                    if !password.isEmpty && password.count < 8 {
                        Text("Password must be at least 8 characters")
                            .foregroundColor(.red)
                            .font(.caption)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                }
            }
            .frame(maxHeight: 350)
            
            Button(action: {
                authViewModel.register(
                    email: email,
                    password: password,
                    fullName: fullName,
                    phoneNumber: phoneNumber.isEmpty ? nil : phoneNumber
                )
            }) {
                Text("Register")
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .cornerRadius(10)
            }
            .disabled(!isFormValid || authViewModel.isLoading)
            .opacity(!isFormValid || authViewModel.isLoading ? 0.6 : 1)
        }
    }
}

struct AuthenticationView_Previews: PreviewProvider {
    static var previews: some View {
        AuthenticationView()
            .environmentObject(AuthViewModel())
    }
}
