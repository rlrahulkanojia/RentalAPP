# PostgreSQL Database Setup Guide

This guide provides step-by-step instructions for setting up the PostgreSQL database for the Property Rental Management System.

## Prerequisites

- PostgreSQL 12.0 or higher
- psycopg2 (Python PostgreSQL adapter)
- SQLAlchemy (ORM)

## Installation

### Windows

1. Download the PostgreSQL installer from the [official website](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the installation wizard
3. During installation, set a password for the default 'postgres' user
4. Keep the default port (5432) unless you have a specific reason to change it
5. Complete the installation

### macOS

#### Using Homebrew

1. Install Homebrew if you haven't already:
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install PostgreSQL:
   ```
   brew install postgresql
   ```

3. Start the PostgreSQL service:
   ```
   brew services start postgresql
   ```

#### Using Postgres.app

1. Download [Postgres.app](https://postgresapp.com/)
2. Move it to your Applications folder
3. Open the app and click "Initialize" to create a PostgreSQL server

### Linux (Ubuntu/Debian)

1. Update package lists:
   ```
   sudo apt update
   ```

2. Install PostgreSQL and its contrib package:
   ```
   sudo apt install postgresql postgresql-contrib
   ```

3. Start the PostgreSQL service:
   ```
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

## Creating the Database

After installing PostgreSQL, you need to create a database for the Property Rental Management System:

1. Access the PostgreSQL command line:

   **Windows**:
   - Open the SQL Shell (psql) from the Start menu

   **macOS/Linux**:
   - Open a terminal and run:
     ```
     sudo -u postgres psql
     ```
     
   **macOS (Postgres.app)**:
   - Click on the "Open psql" button in the Postgres.app

2. Create a new database user:
   ```sql
   CREATE USER rental_user WITH PASSWORD 'your_secure_password';
   ```

3. Create the database:
   ```sql
   CREATE DATABASE property_rental_db;
   ```

4. Grant privileges to the user:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE property_rental_db TO rental_user;
   ```

5. Connect to the new database and grant schema privileges:
   ```sql
   \c property_rental_db
   
   -- Grant schema privileges
   GRANT ALL ON SCHEMA public TO rental_user;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rental_user;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rental_user;
   GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO rental_user;
   
   -- Allow the user to create tables
   ALTER USER rental_user CREATEDB;
   ```

5. Connect to the new database:
   ```sql
   \c property_rental_db
   ```

6. Create the required extensions (if needed):
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

7. Exit the PostgreSQL command line:
   ```
   \q
   ```

## Configuring the Application

Now you need to configure the application to connect to your PostgreSQL database:

1. Open the `.env` file in the backend directory:
   ```
   property_rental_app/backend/.env
   ```

2. Update the database connection settings:
   ```
   DATABASE_URL=postgresql://rental_user:your_secure_password@localhost:5432/property_rental_db
   ```

3. Make sure the database URL follows this format:
   ```
   postgresql://[user]:[password]@[host]:[port]/[database_name]
   ```

## Database Initialization

The application uses SQLAlchemy for ORM and Alembic for migrations. To initialize the database with the required tables:

1. Navigate to the backend directory:
   ```
   cd property_rental_app/backend
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

   Note: Make sure you have the `pydantic-settings` package installed, as it's required for the configuration:
   ```
   pip install pydantic-settings
   ```

3. Run the database initialization script:
   ```
   python init_db.py
   ```

   This script will:
   - Connect to the database
   - Create all tables based on the SQLAlchemy models
   - Create a default admin user (if specified)

## Verifying the Setup

To verify that your database is set up correctly:

1. Connect to the database:
   ```
   psql -U rental_user -d property_rental_db
   ```

2. List all tables:
   ```sql
   \dt
   ```

   You should see tables for users, properties, tenants, rental contracts, etc.

3. Check the users table:
   ```sql
   SELECT * FROM users;
   ```

   If you created a default admin user, it should be listed here.

## Common Issues and Troubleshooting

### Connection Refused

If you get a "connection refused" error:
- Make sure PostgreSQL is running
- Check that you're using the correct port
- Verify that the database exists
- Ensure the user has the necessary permissions

### Authentication Failed

If authentication fails:
- Double-check the username and password in your `.env` file
- Verify that the user exists in PostgreSQL
- Ensure the user has the correct permissions

### Tables Not Created

If tables aren't created:
- Check the output of the `init_db.py` script for errors
- Verify that the database URL is correct
- Ensure the user has permission to create tables

## Backup and Restore

### Creating a Backup

To create a backup of your database:

```
pg_dump -U rental_user -d property_rental_db -F c -f backup.dump
```

### Restoring from a Backup

To restore your database from a backup:

```
pg_restore -U rental_user -d property_rental_db -c backup.dump
```

## Database Migrations

When you make changes to the database schema, you'll need to create and apply migrations:

1. Create a migration:
   ```
   alembic revision --autogenerate -m "Description of changes"
   ```

2. Apply the migration:
   ```
   alembic upgrade head
   ```

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
