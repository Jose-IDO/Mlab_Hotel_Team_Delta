# Database Hosting Guide - Step by Step
## Simplest Method: Supabase (Free PostgreSQL Database)

This guide will walk you through hosting your PostgreSQL database online using Supabase, which is the simplest and easiest free option available.

---

## Prerequisites
- A Supabase account (free)
- Your backend code ready
- Access to your GitHub repository

---

## PART 1: Setting Up Supabase Database

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up using:
   - GitHub account (recommended), OR
   - Email address
4. Verify your email if required

### Step 2: Create a New Project
1. Once logged in, click **"New Project"** button
2. Fill in the project details:
   - **Name**: `delta-hotel-db` (or any name you prefer)
   - **Database Password**: Create a strong password (SAVE THIS - you'll need it!)
     - Use a password manager or write it down securely
     - Example: `MySecurePass123!@#`
   - **Region**: Choose closest to your users (e.g., `South Africa` if available, or `US East`)
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be created

### Step 3: Get Database Connection Details
1. Once project is created, go to **Settings** (gear icon in left sidebar)
2. Click on **"Database"** in the settings menu
3. Scroll down to **"Connection string"** section
4. Find **"URI"** tab - this is your full connection string
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. Also note these individual values (you'll need them):
   - **Host**: `db.xxxxx.supabase.co` (the part after @)
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: The password you created in Step 2

### Step 4: Test Database Connection (Optional)
1. In Supabase dashboard, go to **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Type: `SELECT version();`
4. Click **"Run"** (or press Ctrl+Enter)
5. You should see PostgreSQL version information - this confirms your database is working

---

## PART 2: Setting Up Database Tables

### Step 5: Run Database Migrations
Your backend has SQL migration files that need to be run on Supabase.

1. In Supabase dashboard, go to **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open your local project and navigate to: `server/src/sql/`
4. You'll see files numbered like:
   - `000_setup.sql`
   - `001_init.sql`
   - `002_add_status_column.sql`
   - etc.

5. **Run migrations in order:**
   - Copy the contents of `000_setup.sql`
   - Paste into Supabase SQL Editor
   - Click **"Run"**
   - Wait for success message
   - Repeat for `001_init.sql`
   - Continue with all numbered files in order

6. **Alternative method** (if you have many files):
   - You can combine all SQL files into one
   - Copy all content from all `.sql` files in order
   - Paste into one query in Supabase
   - Click **"Run"**

### Step 6: Verify Tables Were Created
1. In Supabase dashboard, go to **"Table Editor"** (left sidebar)
2. You should see tables like:
   - `users`
   - `rooms`
   - `bookings`
   - `payments`
   - etc.
3. If you see these tables, your database is set up correctly!

---

## PART 3: Hosting Your Backend API

### Step 7: Choose Backend Hosting Platform
**Recommended: Railway** (easiest and free tier available)

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign up using GitHub (recommended)

### Step 8: Deploy Backend to Railway
1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub if prompted
4. Select your repository: `Mlab_Hotel_Team_Delta`
5. Railway will detect your project

### Step 9: Configure Railway Project
1. After selecting repo, Railway will show project settings
2. Click on the service that was created
3. Go to **"Settings"** tab
4. Find **"Root Directory"** setting
5. Set it to: `server` (this tells Railway where your backend code is)
6. Click **"Save"**

### Step 10: Set Environment Variables in Railway
1. In Railway, go to your service
2. Click on **"Variables"** tab
3. Click **"New Variable"** button
4. Add each of these variables one by one:

   **Database Variables:**
   - Name: `DB_HOST`
     Value: `db.xxxxx.supabase.co` (from Step 3)
   
   - Name: `DB_USER`
     Value: `postgres`
   
   - Name: `DB_PASS`
     Value: Your Supabase password (from Step 2)
   
   - Name: `DB_NAME`
     Value: `postgres`
   
   - Name: `DB_PORT`
     Value: `5432`

   **Server Variables:**
   - Name: `PORT`
     Value: `4000`

   **JWT Secret:**
   - Name: `JWT_SECRET`
     Value: Generate a random string (you can use: https://randomkeygen.com/)
     Example: `aB3$kL9@mN2#pQ7&rT5*wY8!`

   **OAuth/Public URL:**
   - Name: `PUBLIC_BASE_URL`
     Value: Your frontend URL (e.g., `https://Jose-IDO.github.io/Mlab_Hotel_Team_Delta`)

   **Cloudinary (if using image uploads):**
   - Name: `CLOUDINARY_CLOUD_NAME`
     Value: Your Cloudinary cloud name (if you have one)
   
   - Name: `CLOUDINARY_API_KEY`
     Value: Your Cloudinary API key
   
   - Name: `CLOUDINARY_API_SECRET`
     Value: Your Cloudinary API secret

5. After adding all variables, Railway will automatically redeploy

### Step 11: Get Your Backend API URL
1. In Railway, go to your service
2. Click on **"Settings"** tab
3. Scroll to **"Domains"** section
4. You'll see a domain like: `your-app.railway.app`
5. Copy this URL - this is your backend API URL
6. Example: `https://delta-hotel-api.railway.app`

### Step 12: Test Your Backend API
1. Open a new browser tab
2. Go to: `https://your-backend-url.railway.app/health`
3. You should see:
   ```json
   {"ok": true, "message": "Server is running"}
   ```
4. If you see this, your backend is working!

---

## PART 4: Updating Frontend to Use Hosted Backend

### Step 13: Create Frontend Environment File
1. In your project root (same level as `package.json`), create a file named `.env`
2. Add this line:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   Replace `your-backend-url.railway.app` with the URL from Step 11

3. **Important:** Make sure `.env` is in `.gitignore` so you don't commit secrets
   - Check if `.gitignore` exists in root
   - If not, create it and add: `.env`

### Step 14: Update Frontend Code (If Needed)
Check if your frontend code uses the environment variable correctly:

1. Open `src/Components/SearchSection/SearchSection.tsx`
2. Look for: `const API_URL = (import.meta as any).env.VITE_API_URL as string;`
3. If it's there, it's already configured correctly!

4. Check other files that use API_URL - they should all use:
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
   ```

### Step 15: Test Frontend Locally
1. Make sure your `.env` file is in the root directory
2. Stop your dev server if running (Ctrl+C)
3. Restart it: `npm run dev`
4. Open your app in browser
5. Check browser console (F12) for any API errors
6. Try to load data (rooms, deals, etc.)
7. If data loads, your frontend is connected correctly!

---

## PART 5: Deploying Updated Frontend

### Step 16: Build and Deploy Frontend
1. Make sure `.env` file is in root (but NOT committed to git)
2. Build your frontend:
   ```bash
   npm run build
   ```
3. This creates a `dist` folder with production files

4. **For GitHub Pages deployment:**
   - Your `package.json` already has deploy script
   - Run: `npm run deploy`
   - This will build and deploy to GitHub Pages

5. **Important:** GitHub Pages doesn't support server-side environment variables
   - You need to set the API URL differently for production
   - Option 1: Hardcode in a config file (not recommended for secrets)
   - Option 2: Use GitHub Secrets and build-time injection
   - Option 3: Create a config file that gets the URL from window location

### Step 17: Create Production Config (For GitHub Pages)
Since GitHub Pages is static hosting, create a config file:

1. Create `src/config/api.ts`:
   ```typescript
   const getApiUrl = () => {
     // In production (GitHub Pages), use the Railway backend URL
     if (import.meta.env.PROD) {
       return 'https://your-backend-url.railway.app';
     }
     // In development, use environment variable or default
     return import.meta.env.VITE_API_URL || 'http://localhost:4000';
   };

   export const API_URL = getApiUrl();
   ```

2. Update all files that use `API_URL` to import from this config:
   ```typescript
   import { API_URL } from '../../config/api';
   ```

---

## PART 6: Verification Checklist

### Step 18: Verify Everything Works
Go through this checklist:

- [ ] Supabase database is created and accessible
- [ ] Database tables are created (check Table Editor in Supabase)
- [ ] Backend is deployed on Railway
- [ ] Backend health check works: `/health` endpoint returns success
- [ ] Environment variables are set in Railway
- [ ] Frontend `.env` file has correct API URL
- [ ] Frontend can connect to backend (check browser console)
- [ ] Data loads on frontend (rooms, deals, etc.)
- [ ] Frontend is deployed to GitHub Pages
- [ ] Live site shows data from hosted database

### Step 19: Test All Features
Test these features to ensure they work:

- [ ] User registration
- [ ] User login
- [ ] View rooms
- [ ] View deals
- [ ] Search functionality
- [ ] Booking creation
- [ ] Payment processing
- [ ] Admin dashboard (if applicable)

---

## Troubleshooting

### Problem: Backend returns 500 errors
**Solution:**
- Check Railway logs: Go to Railway → Your service → "Deployments" → Click latest deployment → View logs
- Check if database connection is correct
- Verify all environment variables are set

### Problem: Frontend shows "Failed to fetch"
**Solution:**
- Check if backend URL is correct in `.env`
- Check browser console for CORS errors
- Verify backend is running (test `/health` endpoint)
- Make sure Railway service is not sleeping (free tier may sleep after inactivity)

### Problem: Database connection fails
**Solution:**
- Verify Supabase database is running (check Supabase dashboard)
- Check if password is correct
- Verify host, port, and database name are correct
- Check Supabase connection pooling settings

### Problem: Tables not found
**Solution:**
- Re-run SQL migrations in Supabase SQL Editor
- Check if migrations ran successfully (no errors)
- Verify table names match what your code expects

### Problem: CORS errors
**Solution:**
- Backend should have CORS enabled (check `server/src/app.ts`)
- Add your frontend URL to CORS allowed origins in backend
- For Railway, you may need to configure CORS for your domain

---

## Quick Reference: Important URLs

- **Supabase Dashboard**: https://app.supabase.com
- **Railway Dashboard**: https://railway.app
- **Your Backend API**: `https://your-app.railway.app`
- **Your Frontend**: `https://Jose-IDO.github.io/Mlab_Hotel_Team_Delta`

---

## Environment Variables Summary

### Supabase Database:
```
Host: db.xxxxx.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: [Your Supabase password]
```

### Railway Backend:
```
DB_HOST=db.xxxxx.supabase.co
DB_USER=postgres
DB_PASS=[Your Supabase password]
DB_NAME=postgres
DB_PORT=5432
PORT=4000
JWT_SECRET=[Random secure string]
PUBLIC_BASE_URL=https://Jose-IDO.github.io/Mlab_Hotel_Team_Delta
```

### Frontend (.env):
```
VITE_API_URL=https://your-backend-url.railway.app
```

---

## Next Steps After Setup

1. **Seed initial data** (if needed):
   - Add some test rooms, deals, etc. through Supabase Table Editor
   - Or create a seed script in your backend

2. **Set up monitoring**:
   - Railway provides basic logs
   - Supabase has built-in monitoring

3. **Backup strategy**:
   - Supabase free tier includes daily backups
   - Consider exporting database periodically

4. **Scale when needed**:
   - Upgrade Supabase plan if database grows
   - Upgrade Railway plan if traffic increases

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Railway Docs**: https://docs.railway.app
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## Notes

- Supabase free tier is generous but has limits (500MB database, 2GB bandwidth)
- Railway free tier gives $5 credit/month
- Both services may sleep after inactivity (free tier limitation)
- Always keep your database password and JWT secret secure
- Never commit `.env` files to Git

---

**Last Updated**: January 2025
**Method**: Supabase (Database) + Railway (Backend API)

