# Property Rental Management System

A comprehensive property rental management system with a FastAPI backend, iOS mobile app, and React web application. This system allows property owners to list their properties and manage rental contracts, while tenants can search for properties, sign rental agreements, and manage their tenancy.

## Project Structure

The project is organized into three main components:

- **Backend**: A FastAPI-based REST API with PostgreSQL database
- **iOS App**: A SwiftUI-based mobile application for iOS devices
- **Web App**: A React-based web application with TypeScript and Material UI

## Features

### For Property Owners

- User registration and authentication
- Property listing and management
- Tenant screening and selection
- Rental contract creation and management
- Rent payment tracking
- Maintenance request handling

### For Tenants

- User registration and authentication
- Property search and filtering
- Rental application submission
- Rental contract management
- Rent payment processing
- Maintenance request submission and tracking

## Backend

The backend is built with FastAPI, a modern, fast web framework for building APIs with Python. It uses PostgreSQL as the database and SQLAlchemy as the ORM.

### Key Components

- **FastAPI**: Modern Python web framework for building APIs
- **PostgreSQL**: Relational database for data storage
- **SQLAlchemy**: ORM for database interactions
- **Pydantic**: Data validation and settings management
- **JWT**: Token-based authentication

### Setup and Running

See the [backend README](backend/README.md) for detailed instructions on setting up and running the backend.

For detailed instructions on setting up the PostgreSQL database, see the [Database Setup Guide](docs/database_setup.md).

## iOS App

The iOS app is built with SwiftUI, Apple's modern UI framework for building user interfaces across all Apple platforms.

### Key Components

- **SwiftUI**: Modern declarative UI framework
- **Combine**: Reactive programming framework
- **MVVM Architecture**: Clean separation of concerns
- **Keychain**: Secure storage for authentication tokens

### Setup and Running

See the [iOS app README](ios_app/README.md) for detailed instructions on setting up and running the iOS app.

## Web App

The web application is built with React, TypeScript, and Material UI, providing a modern and responsive user interface for managing property rentals.

### Key Components

- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Redux Toolkit**: State management
- **Material UI**: Component library for modern UI design
- **React Router**: Navigation and routing

### Setup and Running

See the [web app README](web_app/README.md) for detailed instructions on setting up and running the web application.

## Development

### Prerequisites

- Python 3.8+
- PostgreSQL
- Xcode 13.0+
- iOS 15.0+
- Swift 5.5+
- Node.js 14.0+
- npm 6.0+

### Getting Started

1. Clone the repository
2. Set up the backend (see backend README)
3. Set up the iOS app (see iOS app README)
4. Set up the web app (see web app README)
5. Start developing!

## API Documentation

When the backend is running, API documentation is available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

This project is licensed under the MIT License - see the LICENSE file for details.
