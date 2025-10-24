# Delta Hotel Booking & Management System

A comprehensive hotel booking and management web application built with React and TypeScript.  
This dual-interface system allows customers to browse and book hotel rooms while providing administrators with complete hotel management capabilities.

## 🏨 Customer Interface Features

- **Hero Section**: Rotating image carousel showcasing Santorini hotel locations with welcoming tagline
- **Search Functionality**: Advanced search form with city, room type, dates, and guest count filters
- **Deals Section**: "Deals For The Weekend" showcasing hotel packages with ratings, views, and pricing
- **Amenities Showcase**: "Why Choose Us" section highlighting free coffee, WiFi, and air-conditioned rooms
- **Responsive Navigation**: Mobile-friendly navbar with hamburger menu
- **Modern UI**: Clean, responsive design with CSS modules

## 🛠️ Admin Dashboard Features

- **Booking Management**: 
  - View and manage pending bookings (approve/cancel)
  - Track confirmed and checked-in bookings
  - Process guest checkouts
- **Room Management**:
  - Add new rooms with detailed specifications
  - Upload room photos
  - Configure pricing, amenities, and availability
  - Archive/restore room listings
- **Administrator Management**: Manage admin user accounts
- **Statistics & Reports**: View hotel performance data

## 📁 Project Structure

```
mlcab-hotel/
├── src/
│   ├── Components/
│   │   ├── Navbar/                 # Customer navigation
│   │   ├── AdminNavbar/           # Admin navigation
│   │   ├── AdminSidebar/          # Admin sidebar menu
│   │   ├── DealSection/           # Weekend deals display
│   │   └── SearchSection/         # Hotel search form
│   ├── Pages/
│   │   ├── Landing_Page/          # Customer homepage
│   │   └── admin_dashboard/       # Admin management interface
│   │       ├── AdminDashboard.tsx
│   │       ├── ManageBooking.tsx
│   │       ├── ManageAccom.tsx
│   │       └── Administrators.tsx
│   ├── assets/                    # Images and icons
│   ├── App.tsx                    # Main app component
│   └── main.tsx                   # App entry point
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
└── README.md
```

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```
   The app runs on [http://localhost:5173](http://localhost:5173) (Vite default port).

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔧 Current Development Status

### ✅ Completed Features
- Complete UI/UX design for both customer and admin interfaces
- Responsive design implementation
- Form structures and data handling
- Image carousel functionality
- Admin dashboard routing and navigation
- Room management forms with photo upload
- Booking management tables and status tracking

### 🚧 In Development / TODO
- **Backend Integration**: Connect forms to actual API endpoints
- **Authentication System**: Implement user login/signup functionality
- **Database Integration**: Connect to hotel booking database
- **Search Functionality**: Link search form to room availability
- **Booking Process**: Complete customer booking workflow
- **Payment Integration**: Add payment processing
- **Real-time Updates**: Live booking status updates

### 🐛 Known Issues
- Search form doesn't connect to room data
- Sign In/Sign Up buttons are non-functional
- No data persistence (all data is currently hardcoded)
- Admin forms only log to console (no API integration)

## 🛠️ Technologies Used

- **Frontend**: React 19.1.1, TypeScript 5.9.3
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.4
- **Styling**: CSS Modules
- **Development**: ESLint, TypeScript compiler
- **Deployment**: GitHub Pages ready

## 📝 Customization

- **Hotel Images**: Replace images in `src/assets/` directory
- **Deals Data**: Edit deals in `src/Components/DealSection/DealSection.tsx`
- **Room Types**: Modify room types in `src/Pages/admin_dashboard/ManageAccom.tsx`
- **Styling**: Update CSS modules in respective component folders
- **Branding**: Update logo and colors in component CSS files

## 🤝 Contributing

This is a collaborative final project for the Mlab codetribe 2025 cohort (Team Delta).

## 📄 License

This project is for educational/demo purposes.
