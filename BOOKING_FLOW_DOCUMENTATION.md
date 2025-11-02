# Booking Flow Documentation

## Overview
A complete end-to-end booking system has been implemented for the Delta Hotel application. The flow includes room selection, guest details, payment processing, and booking confirmation.

---

## Booking Flow Diagram

```
Room Details Page
    ↓ (Click "Book Now")
    ↓ [If not logged in → Sign Up Page → Back to booking]
Booking Page (Guest Details)
    ↓ (Click "Continue to payment")
Payment Page (Card Details)
    ↓ (Click "Pay")
Booking Confirmation Page
    ├─ State 1: "Payment Successful" (3 seconds)
    └─ State 2: "Booking Confirmed" + Download Receipt
        ↓ (Click "Go to Dashboard")
Dashboard
```

---

## Pages & Components

### 1. **Room Details Page** (`src/Pages/Room_Details/RoomDetails.tsx`)

**Purpose**: Display room information and allow users to configure their booking.

**Features**:
- Room image gallery with full-screen overlay
- Room amenities display
- Hotel rules
- **Booking Form** (NEW):
  - Check-in date picker
  - Check-out date picker
  - Adults selector (1-6)
  - Children selector (0-4)
  - Real-time price calculation
  - Total price breakdown
- **Book Now Button**:
  - If **not logged in**: Stores booking data in `sessionStorage` and redirects to `/signup`
  - If **logged in**: Navigates to `/booking` with booking data

**Data Passed**:
```typescript
{
  hotelName: "Delta Hotel",
  roomType: string,
  roomImage: string,
  checkIn: string (ISO date),
  checkOut: string (ISO date),
  nights: number,
  adults: number,
  children: number,
  pricePerNight: number,
  totalPrice: number
}
```

---

### 2. **Sign Up Page** (`src/Pages/Auth/SignUp.tsx`)

**Enhancement**: After successful signup, checks for pending booking.

**Logic**:
```typescript
if (pendingBooking exists in sessionStorage) {
  Retrieve booking data
  Clear sessionStorage
  Navigate to /booking with booking data
} else {
  Navigate to /dashboard
}
```

---

### 3. **Booking Page** (`src/Pages/Booking_Page/BookingPage.tsx`)

**Purpose**: Collect guest information for the booking.

**Features**:
- Displays booking summary (left sidebar):
  - Hotel image
  - Hotel name
  - Room type
  - Check-in/Check-out dates
  - Number of nights
  - Total price
- Guest details form (right side):
  - First name, Last name
  - Email
  - Country (dropdown)
  - Phone number
  - "Add guest" button for multiple guests
- **Continue to payment** button

**Data Passed to Payment**:
```typescript
{
  ...bookingData from Room Details,
  guests: [
    {
      firstName: string,
      lastName: string,
      email: string,
      country: string,
      phone: string
    }
  ]
}
```

---

### 4. **Payment Page** (`src/Pages/Payment/PaymentPage.tsx`) ✨ NEW

**Purpose**: Process payment for the booking.

**Features**:
- Booking summary (left sidebar) - same as Booking Page
- Payment form (right side):
  - **Card Information**:
    - Cardholder name
    - Card number (auto-formatted: `1234 5678 9012 3456`)
    - Expiry date (MM/YY format)
    - CVV (3 digits, password masked)
  - **Billing Address**:
    - Street address
    - City
    - Postal code
    - Country (dropdown)
- **Pay Button**: Shows total amount
- **Validation**: All fields required with proper format checks
- **Simulated Processing**: 2-second delay before confirmation

**Data Passed to Confirmation**:
```typescript
{
  bookingId: string (auto-generated),
  ...all booking data,
  ...all guest data,
  paymentMethod: string (e.g., "Visa **** 1234"),
  cardholderName: string
}
```

---

### 5. **Booking Confirmation Page** (`src/Pages/BookingConfirmation/BookingConfirmation.tsx`) ✨ NEW

**Purpose**: Confirm successful booking and provide receipt.

**Two States**:

#### **State 1: Payment Successful** (3 seconds)
- Green checkmark animation
- "Payment Successful" title
- "Redirecting to booking confirmation..." message
- Loading spinner

#### **State 2: Booking Confirmed**
- Green checkmark animation
- "Booking Confirmed" title
- Booking ID display (e.g., `ID# ABC123XYZ`)
- Confirmation email message
- **Download Receipt** button:
  - Generates text file with booking details
  - Includes: Booking ID, dates, guests, payment info
- **Go to Dashboard** button:
  - Navigates to `/dashboard`

---

## Routes Added

```typescript
// src/App.tsx

// Protected Booking Flow
<Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
<Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
<Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
```

All booking flow routes are **protected** - users must be logged in to access them.

---

## Files Created

### New Pages:
- `src/Pages/Payment/PaymentPage.tsx`
- `src/Pages/Payment/PaymentPage.module.css`
- `src/Pages/BookingConfirmation/BookingConfirmation.tsx`
- `src/Pages/BookingConfirmation/BookingConfirmation.module.css`

### Modified Files:
- `src/Pages/Room_Details/RoomDetails.tsx` - Added booking form and Book Now functionality
- `src/Pages/Room_Details/RoomDetails.module.css` - Added booking form styles
- `src/Pages/Auth/SignUp.tsx` - Added pending booking redirect logic
- `src/Pages/Booking_Page/BookingPage.tsx` - Updated to receive room data and navigate to payment
- `src/App.tsx` - Added payment and confirmation routes

---

## Data Flow

### 1. **Room Details → Booking**
```typescript
sessionStorage (if not logged in) or navigate state:
{
  hotelName, roomType, roomImage,
  checkIn, checkOut, nights,
  adults, children,
  pricePerNight, totalPrice
}
```

### 2. **Booking → Payment**
```typescript
navigate state:
{
  ...bookingData,
  guests: [...]
}
```

### 3. **Payment → Confirmation**
```typescript
navigate state:
{
  bookingId,
  ...bookingData,
  ...guests,
  paymentMethod,
  cardholderName
}
```

---

## API Integration Preparation

All booking data is structured to be easily sent to a backend API:

### Booking Creation Endpoint (Future)
```typescript
POST /api/bookings
{
  hotelId: string,
  roomId: string,
  checkIn: string,
  checkOut: string,
  guests: Guest[],
  totalPrice: number,
  paymentDetails: {
    cardholderName: string,
    last4: string,
    billingAddress: Address
  }
}

Response:
{
  bookingId: string,
  confirmationNumber: string,
  status: "confirmed"
}
```

---

## User Experience Highlights

### ✅ Authentication Flow
- Non-logged-in users are seamlessly redirected to sign up
- Booking intent is preserved across signup
- Immediate redirect to booking after signup

### ✅ Form Validation
- Real-time validation on all forms
- Clear error messages
- Disabled submit buttons during processing

### ✅ Visual Feedback
- Loading states on all buttons
- Animated checkmark on confirmation
- Smooth transitions between states
- Price calculations update in real-time

### ✅ Data Persistence
- Booking data flows through all pages
- No data loss between steps
- Session storage for pre-login bookings

---

## Testing the Flow

### Test Scenario 1: Logged-in User
1. Navigate to any room details page (e.g., `/room-details/1`)
2. Select check-in/check-out dates and guests
3. Click "Book Now"
4. Fill in guest details
5. Click "Continue to payment"
6. Fill in payment details
7. Click "Pay R[amount]"
8. See payment success animation
9. See booking confirmation with ID
10. Download receipt
11. Click "Go to Dashboard"

### Test Scenario 2: Non-logged-in User
1. Navigate to any room details page
2. Configure booking
3. Click "Sign Up to Book"
4. Complete sign-up form
5. **Automatically redirected to booking page** with data preserved
6. Continue with steps 4-11 from Scenario 1

---

## Future Enhancements

### Recommended Additions:
1. **Backend Integration**:
   - Connect to real payment gateway (Stripe, PayPal)
   - Store bookings in database
   - Send confirmation emails

2. **Booking Management**:
   - View bookings in dashboard
   - Cancel/modify bookings
   - Booking history

3. **Enhanced Features**:
   - Room availability calendar
   - Special requests field
   - Promo code support
   - Multiple room booking
   - PDF receipt generation (instead of text)

4. **Validation**:
   - Check room availability before booking
   - Prevent double bookings
   - Validate payment details with payment processor

---

## Notes

- **Payment Processing**: Currently simulated with 2-second delay
- **Booking ID**: Randomly generated client-side
- **Receipt**: Plain text file (can be upgraded to PDF with `jspdf` library)
- **Email**: Confirmation email message shown but not sent (requires backend)
- **Dependencies**: All functionality uses existing dependencies except for potential future PDF generation

---

**Status**: ✅ Complete and Functional
**Last Updated**: October 31, 2025

## Recent Updates (October 31, 2025)

### Simplified Guest Details
- **Changed**: Guest details now require only ONE contact person
- **Removed**: Multiple guest forms that previously matched guest count
- **Benefit**: Faster, simpler booking process
- **Note**: Guest count (adults + children) still tracked for pricing and room allocation

### Booking Form Consolidation
- **Moved**: Date pickers and guest selectors from Room Details to Booking Page
- **Removed**: Duplicate data requests
- **Flow**: Room Details (info only) → Booking Page (all booking configuration) → Payment → Confirmation

### Authentication Pages Enhancement
- **Added**: Home button (home icon) on Sign In and Sign Up pages
- **Location**: Top-left corner
- **Style**: Circular white button with red glow on hover
- **Function**: Navigates back to landing page

