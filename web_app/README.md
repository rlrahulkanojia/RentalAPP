# Property Rental Management Web Application

A modern React-based web application for managing property rentals, built with TypeScript, Material UI, and Redux Toolkit.

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

## Tech Stack

- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Redux Toolkit**: State management
- **React Router**: Navigation and routing
- **Material UI**: Component library for modern UI design
- **Formik & Yup**: Form handling and validation
- **Axios**: HTTP client for API requests
- **JWT**: Token-based authentication

## Project Structure

```
src/
├── assets/         # Static assets like images and styles
├── components/     # Reusable UI components
│   ├── auth/       # Authentication-related components
│   ├── common/     # Common UI components
│   ├── layout/     # Layout components
│   ├── properties/ # Property-related components
│   ├── tenants/    # Tenant-related components
│   └── contracts/  # Contract-related components
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API services
├── store/          # Redux store and slices
│   └── slices/     # Redux Toolkit slices
├── utils/          # Utility functions
├── App.tsx         # Main App component
└── index.tsx       # Entry point
```

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Installation

1. Clone the repository
2. Navigate to the web_app directory:
   ```
   cd property_rental_app/web_app
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Development

Start the development server:

```
npm start
```

The application will be available at http://localhost:3000.

### Building for Production

Build the application for production:

```
npm run build
```

The build artifacts will be stored in the `build/` directory.

## API Integration

The web application communicates with the FastAPI backend through RESTful API endpoints. The API services are organized in the `services` directory, and API calls are managed through Redux Toolkit's async thunks.

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and included in API requests through the Authorization header.

## State Management

Redux Toolkit is used for state management, with separate slices for different domains:

- **authSlice**: Authentication and user management
- **propertySlice**: Property listing and management
- **tenantSlice**: Tenant profiles and management
- **contractSlice**: Rental contracts and payments
- **uiSlice**: UI state like loading indicators and current page

## Styling

Material UI is used for styling and component design, providing a modern and responsive user interface. Custom styles are applied using Material UI's styling solution with the `sx` prop and theme customization.

## License

This project is licensed under the MIT License.
