# HotelDesk - Setup & Installation Guide

## Prerequisites

- **Node.js**: v16.x or higher
- **npm**: v7.x or higher
- **Git**: Latest version
- **Operating System**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+

## Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/yourorg/hoteldesk.git
cd hoteldesk
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize Database
```bash
npm run db:init
```

This will:
- Create SQLite database file
- Run all migrations
- Seed initial data

### 4. Development Server
```bash
npm start
```

The application will start with:
- Angular dev server on `http://localhost:4200`
- Electron window opens automatically

### 5. Build for Distribution
```bash
# Build for current OS
npm run dist

# Build for specific OS
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

---

## Environment Configuration

### Create `.env` File
```bash
cp .env.example .env
```

### Required Variables
```
NODE_ENV=development
JWT_SECRET=your-secret-key-here
DATABASE_PATH=~/.hoteldesk/hoteldesk.db
LOG_LEVEL=info
```

---

## First Time Setup

### 1. Create Admin User
Login to the application with default credentials:
- **Username**: `admin`
- **Password**: `admin123`

### 2. Change Admin Password
After first login, immediately change the admin password:
1. Go to Settings → User Management
2. Select Admin user
3. Click "Change Password"
4. Enter new secure password

### 3. Create Additional Users
1. Go to Admin → User Management
2. Click "Add New User"
3. Fill in details:
   - Username (unique)
   - Email
   - Password (min 8 characters)
   - Role (Manager or Receptionist)
4. Click "Save"

### 4. Configure Room Types
1. Go to Admin → Room Management
2. Click "Add Room Type"
3. Enter:
   - Name (e.g., Single, Double, Suite)
   - Base Price
   - Max Capacity
4. Save

### 5. Add Rooms
1. Go to Admin → Rooms
2. Click "Add Room"
3. Fill in:
   - Room Number (e.g., 101, 201, 301)
   - Room Type
   - Floor
   - Price per night
   - Amenities (select checkboxes)
4. Save

---

## Database Management

### View Database
```bash
# Open SQLite browser
sqlite3 ~/.hoteldesk/hoteldesk.db

# List tables
.tables

# Query bookings
SELECT * FROM bookings LIMIT 10;
```

### Backup Database
```bash
cp ~/.hoteldesk/hoteldesk.db ~/.hoteldesk/hoteldesk.backup.db
```

### Reset Database
```bash
rm ~/.hoteldesk/hoteldesk.db
npm run db:init
```

---

## Troubleshooting

### Application Won't Start
**Solution**: Clear cache and reinstall
```bash
rm -rf node_modules dist
npm install
npm start
```

### Database Connection Error
**Solution**: Check database file permissions
```bash
# macOS/Linux
chmod 644 ~/.hoteldesk/hoteldesk.db

# Windows: Run as Administrator
```

### Port 4200 Already in Use
**Solution**: Kill process on port 4200
```bash
# macOS/Linux
lsof -i :4200
kill -9 <PID>

# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Module Not Found Error
**Solution**: Reinstall specific module
```bash
npm install --save <module-name>
npm start
```

---

## Development Commands

```bash
# Start dev server
npm start

# Build Angular only
npm run ng:build

# Run tests
npm run ng:test

# Lint code
npm run lint

# Format code
npm run format

# Electron only (after ng build)
npm run electron

# Database commands
npm run db:migrate     # Run migrations
npm run db:seed        # Seed test data
npm run db:init        # Both
```

---

## Production Deployment

### Build Release Version
```bash
npm run dist
```

Outputs:
- **Windows**: `dist/HotelDesk-1.0.0-setup.exe`
- **macOS**: `dist/HotelDesk-1.0.0.dmg`
- **Linux**: `dist/HotelDesk-1.0.0.AppImage`

### Install on Windows
1. Download `HotelDesk-1.0.0-setup.exe`
2. Double-click to run installer
3. Follow prompts
4. Application launches automatically

### Install on macOS
1. Download `HotelDesk-1.0.0.dmg`
2. Double-click to mount
3. Drag HotelDesk to Applications folder
4. Open from Applications

### Install on Linux
1. Download `HotelDesk-1.0.0.AppImage`
2. Make executable: `chmod +x HotelDesk-1.0.0.AppImage`
3. Run: `./HotelDesk-1.0.0.AppImage`

---

## Support & Documentation

- **User Guide**: See USER_GUIDE.md
- **API Documentation**: See API.md
- **Troubleshooting**: See TROUBLESHOOTING.md
- **Bug Reports**: GitHub Issues
- **Email Support**: support@hoteldesk.com
