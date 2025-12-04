# HotelDesk - Business Analysis & Requirements

## 1. BUSINESS DESCRIPTION

### Project Overview
**Project Name**: HotelDesk  
**Domain**: Hotel Management System (Front Desk Operations)  
**Target Users**: Front desk staff, Managers, Receptionists  
**Deployment**: Desktop application (Windows/Mac/Linux via Electron)

### Business Goals
- Streamline hotel front desk operations
- Reduce manual booking management
- Improve guest check-in/check-out efficiency
- Provide real-time room availability
- Enable quick reporting and analytics
- Maintain guest and booking records

### Key Features
1. **Guest Management** - Create, update, search guest profiles
2. **Room Management** - Track room status (available, occupied, maintenance)
3. **Booking System** - Create, modify, cancel bookings with pricing
4. **Check-in/Check-out** - Automated guest arrival and departure workflows
5. **Dashboard** - Real-time occupancy, metrics, and KPIs
6. **Reports** - Revenue, occupancy, booking reports
7. **User Roles** - Admin, Manager, Receptionist with role-based access

---

## 2. BUSINESS WORKFLOWS

### Workflow 1: Booking Creation
```
Guest Inquiry
    ↓
Check Room Availability (Date Range)
    ↓
Display Available Room Types & Pricing
    ↓
Guest Selects Room & Dates
    ↓
Collect Guest Details (Name, Phone, Email)
    ↓
Add Special Requests/Notes
    ↓
Calculate Total Price (Room Rate × Nights)
    ↓
Confirm Booking
    ↓
Generate Booking Reference
    ↓
Send Confirmation (Email/SMS)
```

### Workflow 2: Check-in Process
```
Guest Arrives
    ↓
Search Guest/Booking in System
    ↓
Verify Booking Details
    ↓
Check Room Status (Clean & Ready)
    ↓
Collect Payment (If not pre-paid)
    ↓
Assign Room Key/Card
    ↓
Update Room Status to "Occupied"
    ↓
Provide House Rules & Information
    ↓
Mark Booking as "Checked In"
```

### Workflow 3: Check-out Process
```
Guest Requests Check-out
    ↓
Calculate Final Bill (Room + Extras)
    ↓
Process Payment/Settlement
    ↓
Collect Room Key/Card
    ↓
Inspect Room & Damage Assessment
    ↓
Mark Room as "Checkout"
    ↓
Schedule Housekeeping Cleaning
    ↓
Update Room Status to "Available" (After Cleaning)
    ↓
Mark Booking as "Checked Out"
    ↓
Archive Guest Record
```

### Workflow 4: Room Assignment
```
Available Room Request (Check-in)
    ↓
Filter Rooms by Type & Availability
    ↓
Check Room Cleanliness Status
    ↓
Consider Guest Preferences (Floor, View)
    ↓
Assign Optimal Room
    ↓
Update Room Occupancy Record
    ↓
Generate Key Card
```

---

## 3. USE CASES

### Primary Use Cases

| Use Case ID | Name | Actor | Description |
|---|---|---|---|
| UC-01 | Create Booking | Receptionist | Create new booking for guest with room selection, dates, pricing |
| UC-02 | Search Booking | Receptionist | Find existing bookings by guest name, booking ID, date |
| UC-03 | Modify Booking | Receptionist | Edit booking dates, room type, or guest information |
| UC-04 | Cancel Booking | Receptionist | Cancel booking with refund calculation |
| UC-05 | Check-in Guest | Receptionist | Process guest arrival and room assignment |
| UC-06 | Check-out Guest | Receptionist | Process guest departure and payment settlement |
| UC-07 | Manage Rooms | Manager | Update room status, add maintenance notes |
| UC-08 | Create Guest Profile | Receptionist | Register new guest with contact details |
| UC-09 | View Dashboard | Manager | View occupancy, revenue, key metrics |
| UC-10 | Generate Reports | Manager | Create revenue, occupancy, booking reports |
| UC-11 | Manage User Accounts | Admin | Create users, assign roles, manage permissions |
| UC-12 | View Room Availability | Receptionist | Check real-time room availability calendar |

### Use Case Diagram
```
                           ┌─────────────────┐
                           │     Guest       │
                           └─────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │ Inquiry  │  │ Check-in │  │Check-out │
              └──────────┘  └──────────┘  └──────────┘
                    │             │             │
        ┌───────────┴─────────────┴─────────────┴───────────┐
        │                                                   │
        ▼                                                   ▼
   ┌──────────────┐                              ┌──────────────┐
   │ Receptionist │                              │   Manager    │
   └──────────────┘                              └──────────────┘
        │                                              │
        ├─ Create Booking                             ├─ View Dashboard
        ├─ Modify Booking                             ├─ Generate Reports
        ├─ Cancel Booking                             ├─ Manage Rooms
        ├─ Check-in Guest                            └─ View Analytics
        ├─ Check-out Guest
        ├─ Search Booking
        ├─ View Availability
        └─ Create Guest Profile
              
        ┌──────────────┐
        │     Admin    │
        └──────────────┘
        │
        └─ Manage Users
```

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **Response Time**: UI interactions < 500ms, database queries < 1s
- **Concurrent Users**: Support 5-10 concurrent users in same location
- **Data Load**: Handle 1000+ bookings, 500+ guests, 100+ rooms

### Reliability & Availability
- **Uptime**: 99% availability during business hours
- **Data Backup**: Automatic daily backup to cloud storage
- **Fault Tolerance**: Graceful handling of database connection loss
- **Recovery Time**: RTO < 1 hour, RPO < 1 day

### Security
- **Authentication**: Secure login with password hashing (bcrypt)
- **Authorization**: Role-based access control (RBAC)
- **Data Privacy**: Encrypt sensitive guest data at rest
- **Audit Trail**: Log all user actions and data modifications
- **Compliance**: GDPR-compliant data handling

### Usability
- **User Training**: System intuitive enough for 1-2 hours training
- **Accessibility**: Support for keyboard navigation
- **Error Messages**: Clear, actionable error messages
- **Documentation**: Built-in help and user guides

### Scalability
- **Database Growth**: Efficiently handle 5 years of booking history
- **Room Count**: Support up to 500 rooms
- **Multi-property**: Extensible for multiple hotel properties

### Maintainability
- **Code Quality**: 80%+ code coverage with unit tests
- **Documentation**: Inline code comments and API documentation
- **Version Control**: Git-based version management
- **Modularity**: Loosely coupled, highly cohesive components

---

## 5. DATA CONSTRAINTS & VALIDATION RULES

### Booking Validation Rules
- **Check-in Date**: Must be >= today
- **Check-out Date**: Must be > check-in date
- **Minimum Stay**: At least 1 night
- **Maximum Stay**: Cannot exceed 90 days
- **Guest Name**: Required, 2-100 characters
- **Email**: Valid email format if provided
- **Phone**: Valid format (10+ digits)

### Room Validation Rules
- **Room Number**: Unique, alphanumeric (e.g., "101", "2A1")
- **Room Type**: Must exist in system (Single, Double, Suite, etc.)
- **Capacity**: 1-8 persons
- **Price Range**: 100,000 - 10,000,000 VND per night
- **Status**: Only valid status values (Available, Occupied, Cleaning, Maintenance)

### Guest Validation Rules
- **ID Type**: Passport, ID Card, Driver License
- **ID Number**: Unique per ID type
- **Date of Birth**: Guest >= 18 years old
- **Nationality**: Valid country code
- **Contact**: At least email or phone required

### Payment Rules
- **Deposit**: 30% of total booking amount
- **Balance Payment**: Due before check-in
- **Cancellation Fee**: 100% if cancelled < 24 hours
- **No-show**: Charge full amount
- **Currency**: Vietnamese Dong (VND)

### Occupancy Rules
- **Double Booking Prevention**: One booking per room per date range
- **Status Transition**: Available → Occupied → Checkout → Cleaning → Available
- **Maintenance**: Can block rooms for scheduled maintenance
- **Overbooking**: System prevents overbooking
- **Early Check-in/Late Check-out**: Subject to availability and additional fees

---

## 6. DATA DICTIONARY

### Key Entities

#### Guest
- **guest_id**: UUID, Primary Key
- **full_name**: String, Required, 2-100 chars
- **email**: String, Optional, Valid email
- **phone**: String, Required, 10+ digits
- **id_type**: Enum (Passport, ID_Card, Driver_License)
- **id_number**: String, Unique
- **nationality**: String, 2-char country code
- **date_of_birth**: Date
- **created_at**: Timestamp
- **updated_at**: Timestamp

#### Room
- **room_id**: UUID, Primary Key
- **room_number**: String, Unique, Alphanumeric
- **room_type_id**: Foreign Key to RoomType
- **floor**: Integer
- **capacity**: Integer, 1-8
- **status**: Enum (Available, Occupied, Cleaning, Maintenance)
- **price_per_night**: Decimal, VND
- **features**: JSON (WiFi, AC, TV, Mini Bar, etc.)
- **created_at**: Timestamp
- **updated_at**: Timestamp

#### Booking
- **booking_id**: UUID, Primary Key
- **booking_reference**: String, Unique (Auto-generated)
- **guest_id**: Foreign Key to Guest
- **room_id**: Foreign Key to Room
- **check_in_date**: Date
- **check_out_date**: Date
- **number_of_nights**: Integer (calculated)
- **total_price**: Decimal, VND
- **deposit_paid**: Decimal, VND
- **status**: Enum (Pending, Confirmed, Checked_In, Checked_Out, Cancelled)
- **special_requests**: Text
- **created_at**: Timestamp
- **updated_at**: Timestamp

#### RoomType
- **room_type_id**: UUID, Primary Key
- **name**: String (Single, Double, Suite, Family)
- **description**: Text
- **base_price**: Decimal, VND
- **max_capacity**: Integer

#### User
- **user_id**: UUID, Primary Key
- **username**: String, Unique
- **email**: String, Unique
- **password_hash**: String (bcrypt)
- **role**: Enum (Admin, Manager, Receptionist)
- **status**: Enum (Active, Inactive, Suspended)
- **created_at**: Timestamp
- **last_login**: Timestamp

---

## Summary
HotelDesk is a comprehensive front-desk hotel management solution designed to streamline daily operations, reduce manual errors, and improve guest experience through efficient booking, check-in, check-out, and reporting workflows.
