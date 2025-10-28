# Delta Hotel Booking & Management System

A comprehensive hotel booking and management web application built with React and TypeScript.  
This dual-interface system allows customers to browse and book hotel rooms while providing administrators with complete hotel management capabilities.

## 🏨 Customer Interface Features

- **Hero Section**: Rotating image carousel showcasing Santorini hotel locations with welcoming tagline
- **Landing Page Navigation**: 
  - Role-based navigation (different views for logged-in/out users)
  - Home icon with red glow hover effect
  - Rooms button navigates to public browsing page
  - Sign In/Sign Up buttons for guest users
- **Customer Dashboard (95% Complete)**: 
  - Hotel rooms grid with star ratings, prices, and amenities
  - Room details display with SVG icons (bedrooms, bathrooms, guest capacity)
  - Weekend deals section with matching card styling
  - Destinations section with location-based filtering
  - Search functionality in navbar
  - User authentication and protected routes
  - Glass effect styling on hotel cards
  - South African flag icon next to username
  - Clickable hotel cards navigate to hotel details page
- **Hotel Details Page**:
  - Hotel information (name, address, location)
  - Image gallery with main and thumbnail images
  - Functional filtering system (Room Type, Price Range, Rating, Amenities)
  - Real-time room filtering with immediate results
  - 5 available rooms with detailed information
  - Clickable room cards navigate to room details
  - Results counter and "no results" message
  - FAQ section with 12 expandable questions (2-column layout)
  - Arrow toggle buttons with red glow effect
  - View Map and Add to Favorites buttons
- **Room Details Page**:
  - Detailed room information and image gallery
  - Room amenities, policies, and booking information
  - Pricing and capacity details
  - Book Now functionality
  - Integrated with hotel details page
- **Public Rooms Page**: Browse rooms without login, with Sign In/Sign Up prompts
- **Authentication System**:
  - Full-page login/signup forms with background image
  - Role-based routing (admins → /admin, customers → /dashboard)
  - Form validation (email format, password strength)
  - Session persistence across page reloads
- **Search Functionality**: Advanced search form with city, room type, dates, and guest count filters
- **Deals Section**: "Deals For The Weekend" showcasing hotel packages with ratings, views, and pricing
- **Amenities Showcase**: "Why Choose Us" section highlighting free coffee, WiFi, and air-conditioned rooms
- **Responsive Navigation**: Mobile-friendly navbar with hamburger menu
- **Modern UI**: Clean, responsive design with CSS modules and glass morphism effects

## 🛠️ Admin Dashboard Features

- **Admin Navigation**:
  - Dedicated admin navbar with home icon
  - Home icon navigates back to landing page
  - Admin profile display with logout functionality
  - Protected admin-only routes
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
- **Role-Based Access**: Automatic redirect to admin dashboard on login

## 📁 Project Structure

```
mlcab-hotel/
├── src/
│   ├── Components/
│   │   ├── Navbar/                 # Landing page navigation
│   │   ├── LoggedInNavbar/        # Customer dashboard navigation
│   │   ├── AdminNavbar/           # Admin navigation with home icon
│   │   ├── AdminSidebar/          # Admin sidebar menu
│   │   ├── DealSection/           # Weekend deals display
│   │   ├── HotelRoomsGrid/        # Hotel rooms grid with icons
│   │   ├── DestinationsSection/   # Destinations display
│   │   ├── DestinationCard/       # Individual destination card
│   │   ├── SearchSection/         # Hotel search form
│   │   ├── ProtectedRoute/        # Route protection component
│   │   └── Shared/                # Shared components (Input, Button, etc.)
│   ├── Pages/
│   │   ├── Landing_Page/          # Customer homepage
│   │   ├── Customer_Dashboard/    # Customer dashboard (90% complete)
│   │   ├── Auth/                  # Authentication pages
│   │   │   ├── SignIn.tsx         # Full-page login
│   │   │   └── SignUp.tsx         # Full-page registration
│   │   └── admin_dashboard/       # Admin management interface
│   │       ├── AdminDashboard.tsx
│   │       ├── ManageBooking.tsx
│   │       ├── ManageAccom.tsx
│   │       └── Administrators.tsx
│   ├── assets/                    # Images, icons, and SVGs
│   │   ├── LOGIN_CREDENTIALS.txt  # Login credentials documentation
│   │   ├── CURRENT_STATUS.txt     # App status documentation
│   │   └── [Various SVG icons]    # Bedroom, bathroom, guest, flag, home icons
│   ├── contexts/                  # React contexts (AuthContext)
│   ├── utils/                     # Utility functions (validation)
│   ├── App.tsx                    # Main app with routing
│   └── main.tsx                   # App entry point
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
└── README.md                      # Project documentation
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
- Admin dashboard routing and navigation with home icon
- Room management forms with photo upload
- Booking management tables and status tracking
- **Full Authentication System**:
  - Full-page login/signup forms with background image
  - Role-based routing (admin → /admin, customer → /dashboard)
  - Form validation (email, password strength)
  - Session persistence
  - Protected routes with ProtectedRoute component
  - Public /rooms route for browsing without login
- **Customer Dashboard (95% Complete)**:
  - Hotel rooms grid with star ratings
  - Room details with SVG icons (bedrooms, bathrooms, guests)
  - Price per day display
  - Amenity badges with hover effects
  - Weekend deals section with matching card styling
  - Destinations section with location images
  - Search functionality in navbar
  - South African flag icon next to username
  - Clickable hotel cards navigate to hotel details
- **Hotel Details Page (100% Complete)**:
  - Hotel information display
  - Image gallery with main and thumbnail images
  - Functional filtering system (4 filters)
  - Real-time room filtering
  - 5 rooms with full details
  - Clickable room cards
  - FAQ section with 12 questions
  - 2-column responsive layout
- **Room Details Page (100% Complete)**:
  - Room-specific information
  - Image gallery
  - Amenities and policies
  - Booking information
  - Book Now button
- **Navigation System**:
  - Landing page navbar with role-based display
  - Customer dashboard navbar with auth state handling
  - Admin navbar with home icon (red glow on hover)
  - Delta Hotel logo clickable on all navbars
  - Home icon navigation based on user role
  - Underline hover effects on navbar items
  - Fixed navbar positioning at top of page
  - LoggedInNavbar used on hotel and room details pages

### 🚧 In Development / TODO
- Complete remaining 5% of customer dashboard:
  - Booking functionality
  - Cart functionality
- **Backend Integration**: Connect forms to actual API endpoints
- **Database Integration**: Connect to hotel booking database
- **Payment Integration**: Add payment processing for bookings
- **Real-time Updates**: Live booking status updates
- **Map Integration**: Implement "View Map" functionality
- **Favorites System**: Implement "Add to Favorites" functionality

### 🐛 Known Issues
- Customer dashboard search not fully functional (UI complete)
- Booking functionality not yet implemented
- No data persistence (all data stored in localStorage only)
- Admin forms only log to console (no API integration)
- No backend server or database integration

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
