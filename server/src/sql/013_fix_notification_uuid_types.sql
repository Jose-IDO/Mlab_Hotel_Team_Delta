-- Fix notifications table to use UUID types for user_id and booking_id
-- This aligns with the users and bookings tables which use UUID primary keys

-- Step 1: Drop existing foreign key constraints if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notifications_user_id_fkey') THEN
        ALTER TABLE notifications DROP CONSTRAINT notifications_user_id_fkey;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notifications_booking_id_fkey') THEN
        ALTER TABLE notifications DROP CONSTRAINT notifications_booking_id_fkey;
    END IF;
END $$;

-- Step 2: Clear existing data (since we can't convert INT to UUID for existing rows)
TRUNCATE TABLE notifications;

-- Step 3: Alter columns to UUID type
ALTER TABLE notifications 
    ALTER COLUMN user_id TYPE UUID USING NULL,
    ALTER COLUMN booking_id TYPE UUID USING NULL;

-- Step 4: Add foreign key constraints
ALTER TABLE notifications
    ADD CONSTRAINT notifications_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE notifications
    ADD CONSTRAINT notifications_booking_id_fkey 
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Notifications table updated to use UUID types!';
END $$;
