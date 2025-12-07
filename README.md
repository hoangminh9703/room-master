# HotelDesk - Hotel Management System

A modern, professional desktop application for hotel front-desk operations built with Angular, Electron, and SQLite.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20|%20macOS%20|%20Linux-blue.svg)

## Features

### Core Functionality
- **Guest Management**: Create, search, and manage guest profiles with ID verification
- **Room Management**: Track room status, amenities, pricing, and availability in real-time
- **Booking System**: Full booking lifecycle - create, modify, cancel with automatic pricing calculation
- **Check-in/Check-out**: Streamlined guest arrival/departure workflows with key generation
- **Dashboard**: Real-time occupancy, revenue, and key metrics
- **Reports**: Revenue, occupancy, and booking analysis with export capabilities
- **User Management**: Role-based access control (Admin, Manager, Receptionist)

### Technical Features
- **Secure Authentication**: JWT-based authentication with password hashing (bcrypt)
- **Offline First**: All data stored locally in SQLite database
- **Real-time Updates**: Live room status and booking updates
- **Audit Trail**: Complete logging of all user actions and data changes
- **Data Validation**: Comprehensive validation at both frontend and backend
- **Error Handling**: Graceful error handling with user-friendly messages
- **Performance**: Optimized database queries with proper indexing
- **Security**: Context isolation, no remote execution, secure IPC

## Technology Stack

### Frontend
- **Angular 17**: Modern web framework
- **RxJS**: Reactive programming
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development
- **Material UI**: Professional component library

### Backend
- **Electron 28**: Desktop application shell
- **Node.js**: Backend runtime
- **Better-sqlite3**: High-performance database driver
- **bcryptjs**: Password hashing
- **UUID**: Unique identifier generation

### Development
- **NPM**: Package management
- **Angular CLI**: Project scaffolding
- **Electron Builder**: Distribution packaging
- **Prettier**: Code formatting
- **ESLint**: Code linting

## Quick Start

### Prerequisites
- Node.js v16+ and npm v7+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/yourorg/hoteldesk.git
cd hoteldesk

# Install dependencies
npm install

# Start development server
npm start
```

### Default Login
- **Username**: `admin`
- **Password**: `admin123`

> ⚠️ **Important**: Change default password immediately after first login!

## Usage

### Dashboard
Access the main dashboard to view:
- Current occupancy percentage
- Today's revenue
- Check-in/check-out schedule
- Upcoming bookings

### Create Booking
1. Navigate to Bookings → New Booking
2. Search or create guest
3. Select room type and dates
4. Review pricing
5. Confirm booking

### Check-in Guest
1. Go to Check-in
2. Search guest/booking
3. Verify details
4. Assign room
5. Generate key card
6. Mark as checked in


## Project Structure

```
hoteldesk/
├── src/                    # Angular application
│   ├── app/               # Angular modules and components
│   ├── assets/            # Images, icons
│   ├── styles/            # Global styles
│   └── main.ts            # Entry point
├── electron/              # Electron main process
│   ├── main.js           # App entry
│   ├── preload.js        # Context bridge
│   ├── ipc/              # IPC handlers
│   ├── database/         # SQLite layer
│   ├── services/         # Business logic
│   ├── utils/            # Utilities
│   └── security/         # Authentication
├── scripts/               # Build and setup scripts
├── package.json          # Dependencies
├── angular.json          # Angular config
├── tsconfig.json         # TypeScript config
└── tailwind.config.js    # TailwindCSS config
```

## Available Scripts

```bash
# Development
npm start                 # Start dev server with Electron
npm run ng:serve         # Angular dev server only
npm run electron         # Electron only

# Building
npm run build            # Build all
npm run ng:build         # Build Angular only
npm run dist             # Package application
npm run dist:win         # Windows executable
npm run dist:mac         # macOS DMG
npm run dist:linux       # Linux AppImage

# Database
npm run db:init          # Initialize database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed test data

# Code Quality
npm run lint             # Run linter
npm run ng:test          # Run tests
npm run format           # Format code
```

## Configuration

### Environment Variables
Create `.env` file in project root:

```env
NODE_ENV=development
JWT_SECRET=your-secret-key-here
DATABASE_PATH=~/.hoteldesk/hoteldesk.db
LOG_LEVEL=info
APP_NAME=HotelDesk
APP_VERSION=1.0.0
```

## Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Installation and initial setup
- **[Architecture](./ARCHITECTURE.md)** - System design and components
- **[Database Design](./DATABASE_DESIGN.md)** - Schema and relationships
- **[UI/UX Design](./UI_UX_DESIGN.md)** - Screen specifications
- **[Business Analysis](./BUSINESS_ANALYSIS.md)** - Requirements and workflows
- **[API Documentation](./API.md)** - IPC channel reference
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[User Guide](./USER_GUIDE.md)** - End-user documentation

## Performance

- **Database**: Optimized queries with proper indexing
- **UI**: Lazy loading, virtual scrolling for large lists
- **Memory**: Efficient state management with RxJS
- **Startup**: < 3 seconds on modern hardware

## Security

- **Authentication**: JWT tokens with 1-hour expiration
- **Password**: Bcrypt hashing with 10 salt rounds
- **Database**: Parameterized queries to prevent SQL injection
- **IPC**: Context isolation and no remote execution
- **Data**: Encryption at rest for sensitive fields
- **Audit**: Complete audit trail of all operations

## Testing

```bash
# Unit tests
npm run ng:test

# E2E tests (if available)
npm run e2e

# Test coverage
npm run ng:test -- --code-coverage
```

## Deployment

### Windows
```bash
npm run dist:win
# Output: dist/HotelDesk-1.0.0-setup.exe
```

### macOS
```bash
npm run dist:mac
# Output: dist/HotelDesk-1.0.0.dmg
```

### Linux
```bash
npm run dist:linux
# Output: dist/HotelDesk-1.0.0.AppImage
```

## Browser Support

HotelDesk is a desktop application and runs in Electron, not browsers. However, the Angular component supports Chromium-based browsers for testing purposes.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## Support

- **Documentation**: [Full documentation](./docs/)
- **Issues**: [GitHub Issues](https://github.com/yourorg/hoteldesk/issues)
- **Email**: support@hoteldesk.com
- **Website**: https://hoteldesk.com

## Author

HotelDesk Team - Professional Hotel Management Solutions

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Production Ready
