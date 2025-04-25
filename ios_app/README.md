# Property Rental Management System - iOS App

This is the iOS client application for the Property Rental Management System, built with SwiftUI.

## Features

- User authentication (login/register)
- Property owner dashboard
- Property listing and management
- Tenant dashboard
- Rental contract management
- Rent payment tracking
- Maintenance request submission and tracking

## Requirements

- Xcode 13.0+
- iOS 15.0+
- Swift 5.5+
- macOS Monterey 12.0+ (for development)

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd property_rental_app/ios_app
```

2. Open the project in Xcode:

```bash
open PropertyRentalApp.xcodeproj
```

3. Configure the API endpoint:

- Open `PropertyRentalApp/Config/AppConfig.swift`
- Update the `baseURL` to point to your backend API

4. Build and run the application in Xcode

## Project Structure

- **PropertyRentalApp/** - Main application code
  - **App/** - App entry point and configuration
  - **Models/** - Data models
  - **Views/** - SwiftUI views
    - **Authentication/** - Login and registration views
    - **PropertyOwner/** - Property owner specific views
    - **Tenant/** - Tenant specific views
    - **Common/** - Shared views
  - **ViewModels/** - View models for managing state and business logic
  - **Services/** - API services and data providers
  - **Utils/** - Utility functions and extensions
  - **Config/** - App configuration

## Architecture

The app follows the MVVM (Model-View-ViewModel) architecture pattern:

- **Models**: Data structures that represent the core data of the application
- **Views**: SwiftUI views that display the UI
- **ViewModels**: Classes that manage the state and business logic for the views
- **Services**: Classes that handle data fetching and API communication

## Authentication

The app uses JWT token-based authentication. The token is stored securely in the Keychain.

## Default Test Accounts

### Property Owner
- Email: admin@example.com
- Password: admin123

### Tenant
- Create a new account and register as a tenant
