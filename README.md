# README.md

# Salon Booking System Backend

## Description
This is a NestJS backend application for a salon booking system that handles user management, shop management, staff management, service management, and appointment scheduling.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

## Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=salon_booking

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Run tests
npm run test
```

## Project Structure

```
src/
├── auth/                    # Authentication module
├── users/                   # User management module
├── shops/                   # Shop management module
├── staff/                   # Staff management module
├── services/               # Service management module
├── appointments/           # Appointment management module
├── common/                 # Shared resources
└── config/                 # Configuration files
```

## Database Schema

### Users
```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  district: string;

  @Column()
  gender: string;

  @Column()
  age: number;
}
```

### Shop Owners
```typescript
@Entity()
export class ShopOwner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerName: string;

  @Column()
  shopName: string;

  @Column()
  shopLocation: string;

  @Column()
  district: string;

  @Column()
  state: string;

  @Column('decimal')
  latitude: number;

  @Column('decimal')
  longitude: number;
}
```

### Staff
```typescript
@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column('simple-array')
  workingDays: string[];

  @Column('simple-array')
  unavailableDates: Date[];
}
```

## API Documentation

### Authentication

#### Login
```typescript
// POST /auth/login
{
  "email": "string",
  "password": "string",
  "userType": "SUPERADMIN" | "SHOPOWNER" | "STAFF" | "USER"
}
```

### User Management

#### Create User
```typescript
// POST /users
{
  "name": "string",
  "email": "string",
  "phoneNumber": "string",
  "district": "string",
  "gender": "string",
  "age": number
}
```

### Shop Management

#### Register Shop
```typescript
// POST /shops/register
{
  "ownerName": "string",
  "shopName": "string",
  "shopLocation": "string",
  "district": "string",
  "state": "string",
  "latitude": number,
  "longitude": number,
  "contactNumber": "string",
  "whatsappNumber": "string",
  "email": "string"
}
```

### Staff Management

#### Create Staff
```typescript
// POST /staff/:shopId/create
{
  "name": "string",
  "email": "string",
  "password": "string",
  "workingDays": ["MONDAY", "TUESDAY"],
  "workingHours": {
    "startTime": "09:00",
    "endTime": "17:00"
  }
}
```

### Service Management

#### Create Service
```typescript
// POST /services/shop/:shopId
{
  "name": "string",
  "description": "string",
  "salePrice": number,
  "actualPrice": number,
  "imageUrl": "string",
  "categoryId": number,
  "staffIds": number[],
  "duration": number,
  "tags": string[]
}
```

#### Get Available Staff
```typescript
// POST /services/available-staff
{
  "serviceIds": number[],
  "date": "2025-02-01",
  "time": "14:30",
  "shopId": number
}
```

### Appointment Management

#### Create User Appointment
```typescript
// POST /appointments/user
{
  "serviceIds": number[],
  "selectedStaffId": number,
  "appointmentDate": "2025-02-01",
  "appointmentTime": "14:30",
  "shopId": number,
  "userId": number,
  "notes": "string"
}
```

#### Create Staff Appointment
```typescript
// POST /appointments/staff
{
  "serviceIds": number[],
  "selectedStaffId": number,
  "appointmentDate": "2025-02-01",
  "appointmentTime": "14:30",
  "shopId": number,
  "customerName": "string",
  "customerPhone": "string",
  "customerEmail": "string",
  "createdByStaffId": number
}
```

## Error Handling

All endpoints may return standard HTTP error codes with detailed messages:

```typescript
// 400 Bad Request
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": []
}

// 401 Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized"
}

// 403 Forbidden
{
  "statusCode": 403,
  "message": "Forbidden resource"
}

// 404 Not Found
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

## Authentication

All protected endpoints require JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

## Role-Based Access Control

The system implements the following roles:
- SUPERADMIN
- SHOPOWNER
- STAFF
- USER

Each role has specific permissions defined in the RolesGuard.

## Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Support

For support, contact: [support@email.com](mailto:support@email.com)

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.



# Database Technical Documentation

## Table of Contents
1. [Database Schema](#database-schema)
2. [Entity Relationships](#entity-relationships)
3. [Data Types and Constraints](#data-types-and-constraints)
4. [Indexes and Performance](#indexes-and-performance)
5. [Business Logic](#business-logic)

## Database Schema

### User Management
```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    district VARCHAR(255),
    gender VARCHAR(10),
    age INTEGER,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locations
CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    state_id INTEGER REFERENCES states(id),
    name VARCHAR(255) NOT NULL,
    UNIQUE(state_id, name)
);
```

### Shop Management
```sql
-- Shop Owners
CREATE TABLE shop_owners (
    id SERIAL PRIMARY KEY,
    owner_name VARCHAR(255) NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    shop_location TEXT NOT NULL,
    district_id INTEGER REFERENCES districts(id),
    state_id INTEGER REFERENCES states(id),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    contact_number VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shop Operating Hours
CREATE TABLE shop_operating_hours (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shop_owners(id),
    day_of_week VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_open BOOLEAN DEFAULT true,
    UNIQUE(shop_id, day_of_week)
);
```

### Staff Management
```sql
-- Staff
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shop_owners(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    working_days TEXT[], -- Array of days: ['MONDAY', 'TUESDAY', etc.]
    working_hours JSONB, -- {"startTime": "09:00", "endTime": "17:00"}
    unavailable_dates DATE[],
    specializations TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff Working Schedule
CREATE TABLE staff_schedules (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES staff(id),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start TIME,
    break_end TIME,
    UNIQUE(staff_id, date)
);
```

### Service Management
```sql
-- Service Categories
CREATE TABLE service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shop_owners(id),
    category_id INTEGER REFERENCES service_categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sale_price DECIMAL(10,2) NOT NULL,
    actual_price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    duration INTEGER, -- in minutes
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Staff Mapping
CREATE TABLE service_staff (
    service_id INTEGER REFERENCES services(id),
    staff_id INTEGER REFERENCES staff(id),
    PRIMARY KEY (service_id, staff_id)
);

-- Variable Pricing
CREATE TABLE variable_pricing (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    special_price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Appointment Management
```sql
-- Appointments
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    appointment_type VARCHAR(20) NOT NULL, -- 'USER' or 'STAFF'
    shop_id INTEGER REFERENCES shop_owners(id),
    user_id INTEGER REFERENCES users(id) NULL,
    customer_name VARCHAR(255) NULL,
    customer_phone VARCHAR(20) NULL,
    customer_email VARCHAR(255) NULL,
    selected_staff_id INTEGER REFERENCES staff(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    notes TEXT,
    created_by_staff_id INTEGER REFERENCES staff(id) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointment Services
CREATE TABLE appointment_services (
    appointment_id INTEGER REFERENCES appointments(id),
    service_id INTEGER REFERENCES services(id),
    price_at_time DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (appointment_id, service_id)
);
```

## Entity Relationships

### User Related
```typescript
// User -> Appointments (One-to-Many)
User {
  @OneToMany(() => Appointment, appointment => appointment.user)
  appointments: Appointment[];
}

// User -> District (Many-to-One)
User {
  @ManyToOne(() => District)
  district: District;
}
```

### Shop Related
```typescript
// ShopOwner -> Staff (One-to-Many)
ShopOwner {
  @OneToMany(() => Staff, staff => staff.shopOwner)
  staff: Staff[];

  @OneToMany(() => Service, service => service.shop)
  services: Service[];

  @OneToMany(() => Appointment, appointment => appointment.shop)
  appointments: Appointment[];
}
```

### Staff Related
```typescript
// Staff -> Services (Many-to-Many)
Staff {
  @ManyToMany(() => Service)
  @JoinTable({
    name: 'service_staff',
    joinColumn: { name: 'staff_id' },
    inverseJoinColumn: { name: 'service_id' }
  })
  services: Service[];

  @OneToMany(() => Appointment, appointment => appointment.selectedStaff)
  appointments: Appointment[];
}
```

### Service Related
```typescript
// Service -> Category (Many-to-One)
Service {
  @ManyToOne(() => ServiceCategory)
  category: ServiceCategory;

  @ManyToMany(() => Staff)
  staffMembers: Staff[];

  @OneToMany(() => VariablePricing, pricing => pricing.service)
  variablePricing: VariablePricing[];
}
```

### Appointment Related
```typescript
// Appointment -> Services (Many-to-Many)
Appointment {
  @ManyToMany(() => Service)
  @JoinTable({
    name: 'appointment_services',
    joinColumn: { name: 'appointment_id' },
    inverseJoinColumn: { name: 'service_id' }
  })
  services: Service[];

  @ManyToOne(() => Staff)
  selectedStaff: Staff;

  @ManyToOne(() => ShopOwner)
  shop: ShopOwner;
}
```

## Data Types and Constraints

### Common Data Types
```typescript
// Date and Time
appointmentDate: Date;        // Stored as DATE
appointmentTime: string;      // Stored as TIME ('HH:mm' format)
createdAt: Date;             // Stored as TIMESTAMP

// Arrays
workingDays: string[];       // Stored as TEXT[]
tags: string[];              // Stored as TEXT[]

// JSON
workingHours: {              // Stored as JSONB
  startTime: string;
  endTime: string;
};

// Decimal
latitude: number;            // DECIMAL(10,8)
longitude: number;           // DECIMAL(11,8)
price: number;              // DECIMAL(10,2)
```

### Key Constraints
```sql
-- Unique Constraints
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
ALTER TABLE shop_owners ADD CONSTRAINT unique_shop_email UNIQUE (email);
ALTER TABLE staff ADD CONSTRAINT unique_staff_email UNIQUE (email);

-- Check Constraints
ALTER TABLE services ADD CONSTRAINT positive_price 
    CHECK (sale_price >= 0 AND actual_price >= 0);

ALTER TABLE appointments ADD CONSTRAINT valid_status 
    CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'));
```

## Indexes and Performance

### Required Indexes
```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_district ON users(district_id);

-- Shops
CREATE INDEX idx_shops_location ON shop_owners(district_id, state_id);
CREATE INDEX idx_shops_coordinates ON shop_owners USING gist (
    ll_to_earth(latitude, longitude)
);

-- Services
CREATE INDEX idx_services_shop ON services(shop_id);
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_active ON services(is_active);

-- Appointments
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_staff ON appointments(selected_staff_id);
CREATE INDEX idx_appointments_shop ON appointments(shop_id);
CREATE INDEX idx_appointments_status ON appointments(status);
```

### Performance Considerations
1. Appointment Queries
```sql
-- Common appointment queries should use indexes
SELECT * FROM appointments 
WHERE shop_id = ? 
    AND appointment_date = ? 
    AND status = 'PENDING'
ORDER BY appointment_time;

-- Staff availability check
SELECT * FROM appointments 
WHERE selected_staff_id = ?
    AND appointment_date = ?
    AND status NOT IN ('CANCELLED', 'NO_SHOW');
```

2. Service Lookups
```sql
-- Service search with category and staff
SELECT s.* FROM services s
JOIN service_staff ss ON s.id = ss.service_id
WHERE s.shop_id = ?
    AND s.category_id = ?
    AND ss.staff_id = ?
    AND s.is_active = true;
```

## Business Logic

### Appointment Scheduling Rules
1. Staff Availability:
   - Check working days
   - Check unavailable dates
   - Check existing appointments
   - Consider service duration

2. Service Pricing:
   - Check variable pricing for date
   - Calculate total for multiple services
   - Apply any special pricing rules

3. Shop Operating Hours:
   - Validate against shop hours
   - Consider staff working hours
   - Handle break times

### Status Workflows
1. Shop Owner:
```
Registration -> Pending -> Approved -> Active
```

2. Appointment:
```
Created -> Pending -> Confirmed -> Completed/Cancelled/No-Show
```

### Data Validation Rules
1. Contact Information:
   - Phone numbers: E.164 format
   - Email: RFC 5322 standard
   - Passwords: Min 8 chars, complexity rules

2. Location Data:
   - Latitude: -90 to 90
   - Longitude: -180 to 180
   - Valid district and state combinations

3. Scheduling:
   - Future dates only
   - Within operating hours
   - Minimum appointment duration
   - Maximum services per appointment

This documentation should help developers understand the database structure, relationships, and business rules for future development.