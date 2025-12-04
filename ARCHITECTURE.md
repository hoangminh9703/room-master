# HotelDesk - System Architecture & Design

## 1. SYSTEM ARCHITECTURE DIAGRAM

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                    ELECTRON APPLICATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────┐         ┌─────────────────────┐   │
│  │   ANGULAR RENDERER      │         │  ELECTRON MAIN      │   │
│  │   (Frontend)            │◄───────►│  (Backend)          │   │
│  ├────────────────────────┤         ├─────────────────────┤   │
│  │ • Components           │         │ • IPC Handler      │   │
│  │ • Services (RxJS)      │         │ • Business Logic   │   │
│  │ • State Management     │         │ • Database Layer   │   │
│  │ • TailwindCSS Styling  │         │ • File Operations  │   │
│  │ • Routing              │         │ • System APIs      │   │
│  │ • Forms & Validation   │         └─────────────────────┘   │
│  └────────────────────────┘                 │                  │
│                                              │                  │
│                                              ▼                  │
│                                    ┌─────────────────────┐     │
│                                    │   SQLITE DATABASE   │     │
│                                    │   (Local Storage)   │     │
│                                    ├─────────────────────┤     │
│                                    │ • Guests            │     │
│                                    │ • Bookings          │     │
│                                    │ • Rooms             │     │
│                                    │ • Users             │     │
│                                    │ • Transactions      │     │
│                                    └─────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────┐
        │   OPTIONAL CLOUD SERVICES            │
        ├──────────────────────────────────────┤
        │ • Email Service (Backup/Restore)    │
        │ • Cloud Storage (Data Backup)       │
        │ • Authentication Service (SSO)      │
        └──────────────────────────────────────┘
```

### IPC Communication Layer
```
RENDERER PROCESS              →    MAIN PROCESS
(Angular App)                       (Node.js Backend)
        │                                  │
        ├─ ipcRenderer.invoke()  ──────→  ipcMain.handle()
        │                                  │
        ├─ ipcRenderer.send()    ──────→  ipcMain.on()
        │                                  │
        └─ ipcRenderer.on()      ←──────  ipcMain.send()
        
        Data Flow:
        1. User Action (UI)
        2. ipcRenderer.invoke('channel', data)
        3. Main Process Receives via ipcMain.handle()
        4. Execute Business Logic / DB Query
        5. Return Result to Renderer
        6. Update UI with Response
```

---

## 2. MODULE DECOMPOSITION

### Frontend Modules (Angular)

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── auth.service.ts          [Authentication & Authorization]
│   │   │   ├── ipc.service.ts           [IPC Communication Wrapper]
│   │   │   ├── storage.service.ts       [Local Storage Management]
│   │   │   └── error.service.ts         [Error Handling & Logging]
│   │   ├── guards/
│   │   │   ├── auth.guard.ts            [Route Protection]
│   │   │   └── role.guard.ts            [Role-Based Access]
│   │   ├── interceptors/
│   │   │   └── error.interceptor.ts     [HTTP Error Handling]
│   │   └── models/
│   │       ├── auth.model.ts            [Auth Types]
│   │       ├── booking.model.ts         [Booking Types]
│   │       ├── guest.model.ts           [Guest Types]
│   │       ├── room.model.ts            [Room Types]
│   │       └── user.model.ts            [User Types]
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── sidebar/                 [Navigation]
│   │   │   ├── header/                  [Top Bar]
│   │   │   ├── confirmation-dialog/     [Modal]
│   │   │   ├── toast/                   [Notifications]
│   │   │   └── loading-spinner/         [Loading State]
│   │   ├── pipes/
│   │   │   ├── date-format.pipe.ts     [Date Formatting]
│   │   │   ├── currency.pipe.ts        [VND Currency]
│   │   │   └── status-badge.pipe.ts    [Status Display]
│   │   ├── directives/
│   │   │   ├── has-role.directive.ts   [Role-Based Display]
│   │   │   └── required-field.directive.ts [Form Validation]
│   │   └── shared.module.ts
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   │   ├── login-page/
│   │   │   │   │   ├── login-page.component.ts
│   │   │   │   │   ├── login-page.component.html
│   │   │   │   │   └── login-page.component.css
│   │   │   │   └── role-selection-page/
│   │   │   ├── services/
│   │   │   │   └── auth-service.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   │   └── dashboard-page/
│   │   │   ├── components/
│   │   │   │   ├── occupancy-card/
│   │   │   │   ├── revenue-card/
│   │   │   │   ├── checkin-card/
│   │   │   │   └── upcoming-bookings/
│   │   │   ├── services/
│   │   │   │   └── dashboard.service.ts
│   │   │   └── dashboard.module.ts
│   │   │
│   │   ├── booking/
│   │   │   ├── pages/
│   │   │   │   ├── booking-list-page/
│   │   │   │   └── booking-create-page/
│   │   │   ├── components/
│   │   │   │   ├── booking-form/
│   │   │   │   ├── booking-list-table/
│   │   │   │   ├── date-range-picker/
│   │   │   │   └── room-selector/
│   │   │   ├── services/
│   │   │   │   └── booking.service.ts
│   │   │   └── booking.module.ts
│   │   │
│   │   ├── room/
│   │   │   ├── pages/
│   │   │   │   ├── room-list-page/
│   │   │   │   └── room-availability-page/
│   │   │   ├── components/
│   │   │   │   ├── room-card/
│   │   │   │   ├── room-filter/
│   │   │   │   ├── availability-calendar/
│   │   │   │   └── room-status-badge/
│   │   │   ├── services/
│   │   │   │   └── room.service.ts
│   │   │   └── room.module.ts
│   │   │
│   │   ├── checkin/
│   │   │   ├── pages/
│   │   │   │   └── checkin-page/
│   │   │   ├── components/
│   │   │   │   ├── guest-search/
│   │   │   │   ├── checkin-form/
│   │   │   │   ├── room-assignment/
│   │   │   │   └── key-generation/
│   │   │   ├── services/
│   │   │   │   └── checkin.service.ts
│   │   │   └── checkin.module.ts
│   │   │
│   │   ├── checkout/
│   │   │   ├── pages/
│   │   │   │   └── checkout-page/
│   │   │   ├── components/
│   │   │   │   ├── checkout-form/
│   │   │   │   ├── payment-processor/
│   │   │   │   ├── damage-assessment/
│   │   │   │   └── receipt-generator/
│   │   │   ├── services/
│   │   │   │   └── checkout.service.ts
│   │   │   └── checkout.module.ts
│   │   │
│   │   ├── guest/
│   │   │   ├── pages/
│   │   │   │   ├── guest-list-page/
│   │   │   │   └── guest-profile-page/
│   │   │   ├── components/
│   │   │   │   ├── guest-form/
│   │   │   │   ├── guest-search/
│   │   │   │   └── guest-history/
│   │   │   ├── services/
│   │   │   │   └── guest.service.ts
│   │   │   └── guest.module.ts
│   │   │
│   │   ├── reports/
│   │   │   ├── pages/
│   │   │   │   ├── revenue-report-page/
│   │   │   │   ├── occupancy-report-page/
│   │   │   │   └── booking-report-page/
│   │   │   ├── components/
│   │   │   │   ├── chart-widget/
│   │   │   │   ├── export-button/
│   │   │   │   └── date-range-filter/
│   │   │   ├── services/
│   │   │   │   └── report.service.ts
│   │   │   └── reports.module.ts
│   │   │
│   │   └── admin/
│   │       ├── pages/
│   │       │   ├── user-management-page/
│   │       │   └── system-settings-page/
│   │       ├── components/
│   │       │   ├── user-form/
│   │       │   ├── user-list-table/
│   │       │   └── settings-form/
│   │       ├── services/
│   │       │   └── admin.service.ts
│   │       └── admin.module.ts
│   │
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.routing.ts                  [Main Routing]
│   └── app.module.ts
│
├── assets/                             [Images, Icons, Fonts]
├── styles/                             [Global Styles, TailwindCSS]
│   ├── globals.css
│   ├── tailwind.css
│   ├── variables.css
│   └── themes.css
│
├── environments/
│   ├── environment.ts                  [Development]
│   └── environment.prod.ts             [Production]
│
└── main.ts                             [Angular Bootstrap]
```

### Backend Modules (Electron Main)

```
electron/
├── main.js                             [Main Process Entry]
├── preload.js                          [Secure Context Bridge]
│
├── ipc/
│   ├── channels.js                     [IPC Channel Definitions]
│   ├── auth-handler.js                 [Auth Operations]
│   ├── booking-handler.js              [Booking Operations]
│   ├── room-handler.js                 [Room Operations]
│   ├── guest-handler.js                [Guest Operations]
│   ├── checkin-handler.js              [Check-in Operations]
│   ├── checkout-handler.js             [Check-out Operations]
│   ├── report-handler.js               [Report Generation]
│   └── admin-handler.js                [User Management]
│
├── database/
│   ├── db.js                           [SQLite Connection]
│   ├── migrations/
│   │   ├── 001-initial-schema.sql     [Initial Tables]
│   │   ├── 002-add-indexes.sql        [Performance Indexes]
│   │   └── 003-seed-data.sql          [Initial Data]
│   └── repositories/
│       ├── guest-repo.js              [Guest CRUD]
│       ├── booking-repo.js            [Booking CRUD]
│       ├── room-repo.js               [Room CRUD]
│       ├── user-repo.js               [User CRUD]
│       ├── transaction-repo.js        [Transaction CRUD]
│       └── query-builder.js           [SQL Helpers]
│
├── services/
│   ├── auth-service.js                [Authentication]
│   ├── booking-service.js             [Booking Business Logic]
│   ├── room-service.js                [Room Management]
│   ├── guest-service.js               [Guest Management]
│   ├── checkin-service.js             [Check-in Logic]
│   ├── checkout-service.js            [Check-out Logic]
│   ├── report-service.js              [Report Generation]
│   ├── pricing-service.js             [Rate Calculation]
│   ├── validation-service.js          [Data Validation]
│   └── notification-service.js        [Email/SMS]
│
├── utils/
│   ├── logger.js                       [Logging]
│   ├── error-handler.js               [Error Processing]
│   ├── date-utils.js                  [Date Helpers]
│   ├── crypto-utils.js                [Encryption]
│   ├── config.js                      [Configuration]
│   └── constants.js                   [App Constants]
│
└── security/
    ├── password-hasher.js             [bcrypt]
    ├── jwt-handler.js                 [JWT Token]
    └── encryption.js                  [Data Encryption]
```

---

## 3. FOLDER STRUCTURE

### Complete Project Structure
```
HotelDesk/
├── src/                                [Angular Source]
│   ├── app/                            [See above]
│   ├── assets/
│   ├── styles/
│   ├── environments/
│   ├── index.html
│   └── main.ts
│
├── electron/                           [Electron Main Process]
│   ├── main.js
│   ├── preload.js
│   ├── ipc/
│   ├── database/
│   ├── services/
│   ├── utils/
│   └── security/
│
├── build/                              [Build Output]
│   ├── dist/                           [Compiled Angular]
│   └── app/                            [Packaged Electron]
│
├── tests/
│   ├── unit/
│   ├── e2e/
│   └── fixtures/
│
├── scripts/
│   ├── build.js
│   ├── start.js
│   ├── package.js
│   ├── migrate-db.js
│   ├── seed-data.js
│   └── deploy.js
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── SETUP.md
│   ├── TROUBLESHOOTING.md
│   └── USER_GUIDE.md
│
├── .github/
│   └── workflows/                      [CI/CD]
│
├── node_modules/
├── package.json
├── package-lock.json
├── angular.json
├── tsconfig.json
├── tailwind.config.js
├── webpack.config.js
├── .env
├── .env.example
├── .gitignore
└── README.md
```

---

## 4. NAMING CONVENTIONS

### File Naming
- **Components**: `feature.component.ts` (e.g., `booking-form.component.ts`)
- **Services**: `feature.service.ts` (e.g., `booking.service.ts`)
- **Models**: `feature.model.ts` (e.g., `booking.model.ts`)
- **Guards**: `feature.guard.ts` (e.g., `auth.guard.ts`)
- **Interceptors**: `feature.interceptor.ts` (e.g., `error.interceptor.ts`)
- **Modules**: `feature.module.ts` (e.g., `booking.module.ts`)
- **Routing**: `feature-routing.module.ts` (e.g., `booking-routing.module.ts`)

### Class Naming (UpperCamelCase)
- **Components**: `BookingFormComponent`
- **Services**: `BookingService`
- **Models**: `BookingModel` or just `Booking`
- **Guards**: `AuthGuard`
- **Interfaces**: `IBooking` or `IGuest` (with I prefix)

### Variable Naming (lowerCamelCase)
- Properties: `firstName`, `totalPrice`, `isAvailable`
- Methods: `createBooking()`, `searchGuest()`, `getAvailableRooms()`
- Constants: `MAX_BOOKING_DAYS`, `DEFAULT_CURRENCY`

### Database Naming (snake_case)
- Tables: `guests`, `bookings`, `rooms`, `room_types`, `users`
- Columns: `guest_id`, `first_name`, `created_at`, `updated_at`
- Foreign Keys: `guest_id` (references guests.id)
- Indexes: `idx_guest_email`, `idx_booking_guest_id`

### IPC Channel Naming
- **Format**: `feature:action` (e.g., `booking:create`, `guest:search`)
- **Async operations**: `feature:action`
- **Events**: `feature:event` (e.g., `room:status-changed`)

### CSS/TailwindCSS Naming
- **Classes**: Tailwind utilities directly + custom classes as `feature-component`
- **CSS Variables**: `--primary-color`, `--spacing-base`
- **Themes**: `light-mode`, `dark-mode`

---

## 5. API DESIGN (IPC Channels)

### Authentication Channels
```javascript
// Invoke (Request/Response)
ipcRenderer.invoke('auth:login', { username, password })
  → ipcMain.handle('auth:login', async (event, { username, password }) => {...})
  ← { success: true, token: '...', user: {...} }

ipcRenderer.invoke('auth:logout', {})
  → Response: { success: true }

ipcRenderer.invoke('auth:verify-token', { token })
  → Response: { valid: true, user: {...} }

ipcRenderer.invoke('auth:refresh-token', { token })
  → Response: { token: '...', expiresIn: 3600 }
```

### Booking Channels
```javascript
ipcRenderer.invoke('booking:create', bookingData)
  → Response: { success: true, bookingId: '...', reference: 'BK-001' }

ipcRenderer.invoke('booking:search', { query, filters })
  → Response: { bookings: [...], total: 10 }

ipcRenderer.invoke('booking:update', { bookingId, updates })
  → Response: { success: true, booking: {...} }

ipcRenderer.invoke('booking:cancel', { bookingId, reason })
  → Response: { success: true, refundAmount: 1500000 }

ipcRenderer.invoke('booking:get-by-id', { bookingId })
  → Response: { booking: {...} }
```

### Room Channels
```javascript
ipcRenderer.invoke('room:list', { filters })
  → Response: { rooms: [...], total: 25 }

ipcRenderer.invoke('room:availability', { startDate, endDate })
  → Response: { availability: {...} }

ipcRenderer.invoke('room:update-status', { roomId, status })
  → Response: { success: true, room: {...} }

ipcRenderer.invoke('room:get-by-id', { roomId })
  → Response: { room: {...} }
```

### Check-in Channels
```javascript
ipcRenderer.invoke('checkin:validate', { bookingId })
  → Response: { valid: true, booking: {...}, room: {...} }

ipcRenderer.invoke('checkin:process', checkinData)
  → Response: { success: true, keyCode: '12345', room: '201' }

ipcRenderer.invoke('checkin:generate-key', { roomId })
  → Response: { keyCode: '12345', expiresAt: '...' }
```

### Check-out Channels
```javascript
ipcRenderer.invoke('checkout:get-bill', { bookingId })
  → Response: { bill: { roomCharge, extras, total, balance } }

ipcRenderer.invoke('checkout:process', checkoutData)
  → Response: { success: true, receipt: '...', refund: 0 }

ipcRenderer.invoke('checkout:damage-report', { roomId, damages })
  → Response: { success: true, reportId: '...' }
```

### Report Channels
```javascript
ipcRenderer.invoke('report:revenue', { startDate, endDate })
  → Response: { revenue: [...], total: 50000000, period: '...' }

ipcRenderer.invoke('report:occupancy', { startDate, endDate })
  → Response: { occupancy: [...], average: 75, peak: 95 }

ipcRenderer.invoke('report:bookings', { filters })
  → Response: { bookings: [...], stats: {...} }

ipcRenderer.invoke('report:export', { reportType, format })
  → Response: { filePath: '...' }
```

### Admin Channels
```javascript
ipcRenderer.invoke('admin:create-user', userData)
  → Response: { success: true, userId: '...' }

ipcRenderer.invoke('admin:list-users', {})
  → Response: { users: [...], total: 5 }

ipcRenderer.invoke('admin:update-user', { userId, updates })
  → Response: { success: true, user: {...} }

ipcRenderer.invoke('admin:delete-user', { userId })
  → Response: { success: true }
```

### Error Response Format
```javascript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'INTERNAL_ERROR',
    message: 'Human-readable error message',
    details: { field: 'error details' }
  }
}
```

### Event Channels (One-way Messages)
```javascript
ipcMain.send('room:status-changed', { roomId, status, timestamp })

ipcRenderer.on('room:status-changed', (event, data) => {
  // Handle room status change in real-time
})

ipcMain.send('booking:reminder', { bookingId, message, type })

ipcRenderer.on('booking:reminder', (event, data) => {
  // Handle booking reminder notification
})
```

---

## 6. SECURITY ARCHITECTURE

### Authentication Flow
```
User Input (Login)
    ↓
Validate Credentials (bcrypt)
    ↓
Generate JWT Token
    ↓
Return Token to Client
    ↓
Store Token in Secure Storage
    ↓
Include Token in IPC Calls
    ↓
Verify Token on Backend
    ↓
Check User Role/Permissions
```

### Data Security
- **Encryption**: Sensitive data encrypted at rest (AES-256)
- **Hashing**: Passwords hashed with bcrypt (10 rounds)
- **IPC**: Messages validated and sanitized
- **SQL Injection**: Parameterized queries only
- **Access Control**: Role-based authorization checks

### Audit & Logging
- All user actions logged with timestamp and user ID
- Database modifications tracked with change history
- Sensitive operations require confirmation
- Failed login attempts monitored

---

## Summary
HotelDesk architecture provides a secure, scalable, and maintainable hotel management system with clear separation of concerns between frontend (Angular) and backend (Electron Main) processes, utilizing SQLite for local data persistence and IPC for inter-process communication.
