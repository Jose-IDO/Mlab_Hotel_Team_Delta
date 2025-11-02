# Authentication System Restoration Guide

## Current State: Manual Login (Working)
The authentication system has been temporarily reverted to a **manual localStorage-based login** system to bypass the broken API integration.

### Current Login Credentials:
- **Admin**: `admin@delta.com` / `admin123`
- **Customer**: `test@customer.com` / `customer123`

### What Changed:
1. **AuthContext.tsx** - Reverted to simple mock user authentication
2. **SignIn.tsx** - Updated to use synchronous login (no API calls)
3. **SignUp.tsx** - Updated to use synchronous signup (no API calls)

---

## Broken API Version (Backed Up)
The API-based authentication is saved in: `src/contexts/AuthContext.BACKUP_API_VERSION.tsx`

### Why It Was Broken:
- The API URL (`import.meta.env.VITE_API_URL`) was **undefined**
- No `.env` file exists with `VITE_API_URL` configured
- No backend server is running to handle `/auth/login` and `/auth/register` endpoints

---

## How to Restore API Authentication

### Step 1: Set Up Environment Variables
Create a `.env` file in the project root:
```env
VITE_API_URL=http://localhost:5000/api
```
Replace `http://localhost:5000/api` with your actual backend API URL.

### Step 2: Restore AuthContext
Copy the contents from `src/contexts/AuthContext.BACKUP_API_VERSION.tsx` back to `src/contexts/AuthContext.tsx`:

```bash
cp src/contexts/AuthContext.BACKUP_API_VERSION.tsx src/contexts/AuthContext.tsx
```

### Step 3: Update SignIn.tsx
Restore the async/await API call version in `src/Pages/Auth/SignIn.tsx`:

**Replace the `submit` function with:**
```typescript
const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;
  setLoading(true);

  try {
    const success = await login(email, password);
    if (success) {
      const savedUser = localStorage.getItem('hotel_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        const hasAdminRole = userData.roles?.some(
          (role: any) => role.name === 'super_admin' || role.name === 'hotel_manager'
        );
        
        if (hasAdminRole) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } else {
      setPasswordError('Invalid email or password');
    }
  } catch (err) {
    setPasswordError('Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

**Also update the useAuth destructuring:**
```typescript
const { login, error } = useAuth();
```

### Step 4: Update SignUp.tsx
Restore the async/await API call version in `src/Pages/Auth/SignUp.tsx`:

**Replace the `submit` function with:**
```typescript
const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;
  setLoading(true);

  try {
    const success = await signup(firstName, lastName, email, phone, password);
    if (success) {
      alert('Sign-up successful! Redirecting to dashboard...');
      navigate('/dashboard');
    } else {
      setErrors({ email: 'Registration failed. Email may already be registered.' });
    }
  } catch (err) {
    setErrors({ email: 'Registration failed. Please try again.' });
  } finally {
    setLoading(false);
  }
};
```

### Step 5: Start Your Backend
Ensure your backend API server is running and accessible at the URL specified in `.env`.

### Step 6: Test
1. Restart the development server: `npm run dev`
2. Try logging in with real credentials from your backend
3. Check browser console for any API errors

---

## Files Modified
- ✅ `src/contexts/AuthContext.tsx` - Reverted to manual login
- ✅ `src/Pages/Auth/SignIn.tsx` - Removed async API calls
- ✅ `src/Pages/Auth/SignUp.tsx` - Removed async API calls
- 📦 `src/contexts/AuthContext.BACKUP_API_VERSION.tsx` - Backup of API version
- 📝 `RESTORE_API_AUTH_INSTRUCTIONS.md` - This file

---

## Quick Reference

### Current (Manual) User Interface:
```typescript
interface User {
  name: string;
  email: string;
  role: 'customer' | 'admin';
}
```

### API Version User Interface:
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImageUrl?: string;
  emailVerified: boolean;
  isActive: boolean;
  roles?: Array<{ name: string; displayName: string }>;
}
```

---

**Note**: The manual login system is a temporary workaround. Restore the API version once your backend is configured and running.

