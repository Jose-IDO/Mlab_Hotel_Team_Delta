# 🏗️ Redux Architecture Diagram

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          BROWSER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────── App Component ────────────────────┐          │
│  │                                                     │          │
│  │  ┌──────────── Redux Provider ──────────────┐    │          │
│  │  │                                            │    │          │
│  │  │  Redux Store: { auth: {...} }            │    │          │
│  │  │                                            │    │          │
│  │  │  ┌─────── AuthProvider (Wrapper) ────┐  │    │          │
│  │  │  │                                     │  │    │          │
│  │  │  │  Wraps Redux with useAuth hook     │  │    │          │
│  │  │  │                                     │  │    │          │
│  │  │  │  ┌──────── Router ──────────┐     │  │    │          │
│  │  │  │  │                           │     │  │    │          │
│  │  │  │  │  Routes & Components      │     │  │    │          │
│  │  │  │  │                           │     │  │    │          │
│  │  │  │  └───────────────────────────┘     │  │    │          │
│  │  │  └─────────────────────────────────────┘  │    │          │
│  │  └────────────────────────────────────────────┘    │          │
│  └─────────────────────────────────────────────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### **1. User Login Flow**

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  SignIn  │────▶│  useAuth()   │────▶│   Redux     │────▶│ Backend  │
│   Page   │     │   .login()   │     │  authSlice  │     │   API    │
└──────────┘     └──────────────┘     └─────────────┘     └──────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │ LocalStorage│
                                      │ - token     │
                                      │ - user      │
                                      └─────────────┘
```

**Steps:**
1. User fills login form
2. Clicks "Sign In"
3. `login()` function calls `dispatch(loginUser({ email, password }))`
4. Redux dispatches `auth/loginUser/pending`
5. API call to `/auth/login`
6. On success: Redux dispatches `auth/loginUser/fulfilled`
7. User and token saved to Redux store
8. LocalStorage updated
9. Redirect to dashboard

---

### **2. Component Accessing User Data**

```
┌──────────────┐
│  Dashboard   │
│  Component   │
└──────┬───────┘
       │
       │ const { user } = useAuth();
       │
       ▼
┌──────────────┐
│ AuthContext  │
│  (Wrapper)   │
└──────┬───────┘
       │
       │ useAppSelector(selectUser)
       │
       ▼
┌──────────────┐
│ Redux Store  │
│  auth.user   │
└──────────────┘
```

**Steps:**
1. Component imports `useAuth` hook
2. Calls `const { user } = useAuth()`
3. AuthContext reads from Redux using `useAppSelector`
4. Returns user data from Redux store
5. Component renders with user data

---

### **3. Protected Route Check**

```
┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│   Navigate   │────▶│ Protected    │────▶│   Redux     │
│ to /dashboard│     │   Route      │     │ isAuth?     │
└──────────────┘     └──────────────┘     └──────┬──────┘
                                                   │
                                    ┌──────────────┴──────────────┐
                                    │                              │
                                    ▼                              ▼
                            ┌──────────────┐            ┌──────────────┐
                            │   Redirect   │            │   Render     │
                            │  to /signin  │            │  Dashboard   │
                            └──────────────┘            └──────────────┘
                            (Not logged in)              (Logged in)
```

**Steps:**
1. User navigates to protected route
2. ProtectedRoute component checks `useAuth().isAuthenticated`
3. AuthContext reads Redux `selectIsAuthenticated`
4. If `false`: Redirect to `/signin`
5. If `true`: Render protected component

---

## 📦 Redux Store Structure

```
Redux Store
│
└── auth (authSlice)
    ├── user: {
    │   ├── id: string
    │   ├── email: string
    │   ├── firstName: string
    │   ├── lastName: string
    │   ├── phone?: string
    │   └── role: 'customer' | 'admin'
    │   }
    ├── token: string | null
    ├── isAuthenticated: boolean
    ├── loading: boolean
    └── error: string | null
```

---

## 🎬 Action Flow Diagram

### **Login Action**

```
dispatch(loginUser({ email, password }))
           │
           ▼
    ┌──────────────────┐
    │ auth/loginUser/  │
    │    pending       │
    └────────┬─────────┘
             │
             │ loading: true
             ▼
    ┌──────────────────┐
    │   API Call to    │
    │  /auth/login     │
    └────────┬─────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
  Success       Failure
      │             │
      ▼             ▼
┌─────────────┐ ┌─────────────┐
│auth/login/  │ │auth/login/  │
│ fulfilled   │ │  rejected   │
└─────┬───────┘ └─────┬───────┘
      │               │
      │               ▼
      │         error: "..."
      │         loading: false
      │
      ▼
  ┌─────────────────┐
  │ user: {...}     │
  │ token: "..."    │
  │ isAuth: true    │
  │ loading: false  │
  └─────────────────┘
```

---

## 🔌 Component Integration

### **Before Redux (Old Way - Still Works!)**

```typescript
// Component doesn't know about Redux

import { useAuth } from '../../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login } = useAuth();
  
  // Component logic here...
  
  return <div>Hello {user?.firstName}</div>;
}
```

### **Behind the Scenes (New Way - Automatic!)**

```typescript
// AuthContext internally uses Redux

export const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);        // ← Redux!
  const isAuthenticated = useAppSelector(selectIsAuthenticated); // ← Redux!
  
  const login = async (email, password) => {
    return dispatch(loginUser({ email, password })); // ← Redux!
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Result:** Components don't change, but Redux powers everything!

---

## 🌐 Full Application Flow

```
┌────────────────────────────────────────────────────────────────┐
│                      Landing Page                               │
└─────────────────────┬──────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌──────────────┐            ┌──────────────┐
│   Sign In    │            │   Sign Up    │
└──────┬───────┘            └──────┬───────┘
       │                           │
       │ dispatch(loginUser)       │ dispatch(signupUser)
       │                           │
       └─────────┬─────────────────┘
                 │
                 ▼
         ┌──────────────┐
         │ Redux Store  │
         │ auth.user    │
         │ auth.token   │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ isAuth: true │
         └──────┬───────┘
                │
      ┌─────────┴─────────┐
      │                   │
      ▼                   ▼
┌──────────┐       ┌──────────┐
│Customer  │       │  Admin   │
│Dashboard │       │Dashboard │
└────┬─────┘       └────┬─────┘
     │                  │
     ├─► Profile        ├─► Manage Rooms
     ├─► Booking        ├─► Manage Bookings
     └─► History        └─► Settings
```

---

## 🔐 Authentication State Machine

```
         ┌─────────────┐
         │  Initial    │
         │  State      │
         │ isAuth:false│
         └──────┬──────┘
                │
       ┌────────┴────────┐
       │                 │
       │ Login/Signup    │
       │                 │
       └────────┬────────┘
                │
                ▼
         ┌─────────────┐
         │  Loading    │
         │ loading:true│
         └──────┬──────┘
                │
       ┌────────┴────────┐
       │                 │
   Success           Failure
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│Authenticated│   │   Error     │
│isAuth: true │   │error: "..." │
│user: {...}  │   │isAuth:false │
└──────┬──────┘   └─────────────┘
       │
       │ Logout
       │
       ▼
┌─────────────┐
│Logged Out   │
│isAuth: false│
│user: null   │
└─────────────┘
```

---

## 📱 Component Tree with Redux

```
App
│
├── Redux Provider ← Redux Store Lives Here
│   │
│   └── AuthProvider ← Wraps Redux, Provides useAuth
│       │
│       └── Router
│           │
│           ├── LandingPage
│           │   └── Navbar (reads Redux via useAuth)
│           │
│           ├── SignIn (dispatches loginUser)
│           │
│           ├── SignUp (dispatches signupUser)
│           │
│           ├── ProtectedRoute (reads Redux isAuth)
│           │   │
│           │   ├── CustomerDashboard
│           │   │   └── LoggedInNavbar (reads Redux user)
│           │   │
│           │   ├── BookingPage (reads Redux user & token)
│           │   │
│           │   ├── UserProfile (reads Redux user & token)
│           │   │
│           │   └── AdminDashboard (reads Redux user.role)
│           │       └── AdminNavbar (reads Redux user)
│           │
│           └── HotelDetails
│               └── RoomCards
                    └── Book Now (triggers auth check)
```

---

## 🎯 Key Takeaways

### **1. Layered Architecture**
```
Components (use useAuth)
    ↓
AuthContext (wraps Redux)
    ↓
Redux Store (manages state)
    ↓
LocalStorage (persists data)
```

### **2. Backward Compatible**
- ✅ Components unchanged
- ✅ useAuth hook unchanged
- ✅ Redux powers everything behind the scenes

### **3. Single Source of Truth**
- ✅ All auth state in Redux
- ✅ No scattered state
- ✅ Predictable updates

### **4. Debuggable**
- ✅ Redux DevTools shows everything
- ✅ Time-travel debugging
- ✅ Action history

---

## 📊 Performance Flow

```
User Action
    │
    ▼
useAuth Hook
    │
    ▼
AuthContext ← Memoized with useCallback/useMemo
    │
    ▼
Redux Selector ← Only re-renders if auth state changes
    │
    ▼
Redux Store
    │
    ▼
Component Re-render (optimized)
```

---

## 🎉 Summary

**Redux is now the single source of truth for authentication state, but existing components don't need to know!**

✅ All components use `useAuth` (no change)
✅ AuthContext wraps Redux (transparent)
✅ Redux manages state (centralized)
✅ DevTools available (debuggable)

**Result: Best of both worlds!** 🚀

---

**Architecture Date:** November 4, 2025
**Status:** Production Ready ✅

