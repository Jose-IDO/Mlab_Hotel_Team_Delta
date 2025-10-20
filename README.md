# Delta Hotel Booking App

A modern hotel booking web application built with React and TypeScript.  
This app allows users to browse hotel deals, search for rooms, and manage bookings with a clean, responsive interface.

## Features

- **Responsive Navbar**: Fixed navigation bar with hamburger menu for mobile.
- **Landing Page**: Welcoming hero section with background image and tagline.
- **Search Section**: Search form for hotel rooms with filters.
- **Deals Section**: "Deals For The Weekend" cards showing hotel deals, ratings, views, and prices.
- **Room Images**: Each deal card displays a real hotel room photo.
- **Sign In / Sign Up**: Prominent buttons for user authentication.
- **Modern Styling**: Uses CSS modules for scoped, maintainable styles.

## Folder Structure

```
Hotel_App/
  ├── src/
  │   ├── Components/
  │   │   ├── Navbar/
  │   │   ├── DealSection/
  │   │   ├── SearchSection/
  │   ├── Landing_Page/
  │   ├── assets/
  ├── README.md
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the development server**
   ```bash
   npm run dev
   ```
   The app runs on [http://localhost:3030](http://localhost:3030) (or your configured port).

3. **Build for production**
   ```bash
   npm run build
   ```

## Customization

- **Hotel Images**: Add or replace images in `src/assets/Hotel-Room-1.jpg`, `Hotel-Room-2.jpg`, `Hotel-Room-3.jpg`.
- **Deals**: Edit deals in `src/Components/DealSection/DealSection.tsx`.
- **Styling**: Update CSS modules for custom look and feel.

## Technologies Used

- React
- TypeScript
- CSS Modules
- Vite (or Create React App, depending on setup)

## License

This project is for educational/demo purposes.
