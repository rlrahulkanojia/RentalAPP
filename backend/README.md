# Property Rental Management System - Backend

This is the backend API for the Property Rental Management System, built with FastAPI and PostgreSQL.

## Features

- User authentication and authorization
- Property management
- Tenant registration and management
- Rental contract creation and management
- Rent payment tracking
- Maintenance request handling

## Requirements

- Python 3.8+
- PostgreSQL

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd property_rental_app/backend
```

2. Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up PostgreSQL:

- Create a PostgreSQL database named `property_rental`
- Update the `.env` file with your database credentials if needed

5. Initialize the database:

```bash
python init_db.py
```

## Running the Application

Start the FastAPI server:

```bash
python run.py
```

The API will be available at http://localhost:8000

API documentation will be available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get access token
- `POST /api/v1/auth/test-token` - Test access token

### Users

- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user

### Properties

- `GET /api/v1/properties` - List properties
- `POST /api/v1/properties` - Create property
- `GET /api/v1/properties/my-properties` - List user's properties
- `GET /api/v1/properties/{property_id}` - Get property details
- `PUT /api/v1/properties/{property_id}` - Update property
- `DELETE /api/v1/properties/{property_id}` - Delete property

### Tenants

- `POST /api/v1/tenants/register` - Register as tenant
- `GET /api/v1/tenants/me` - Get tenant profile
- `PUT /api/v1/tenants/me` - Update tenant profile

### Contracts

- `POST /api/v1/contracts` - Create rental contract
- `GET /api/v1/contracts` - List contracts
- `GET /api/v1/contracts/{contract_id}` - Get contract details
- `PUT /api/v1/contracts/{contract_id}` - Update contract
- `POST /api/v1/contracts/{contract_id}/payments` - Create rent payment
- `GET /api/v1/contracts/{contract_id}/payments` - List rent payments
- `POST /api/v1/contracts/{contract_id}/maintenance` - Create maintenance request
- `GET /api/v1/contracts/{contract_id}/maintenance` - List maintenance requests
- `PUT /api/v1/contracts/maintenance/{request_id}` - Update maintenance request

## Default Admin User

Email: admin@example.com
Password: admin123
