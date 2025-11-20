-- Add type column to notifications table for categorizing notifications

DO $$
BEGIN
  -- Check if column doesn't exist before adding
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'notifications' 
    AND column_name = 'type'
  ) THEN
    ALTER TABLE notifications 
    ADD COLUMN type VARCHAR(50) DEFAULT 'general';
    
    RAISE NOTICE '✅ Added type column to notifications table';
  ELSE
    RAISE NOTICE 'ℹ️  Type column already exists in notifications table';
  END IF;
END $$;

-- Create index on type for faster filtering
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Update existing notifications to have proper types
UPDATE notifications 
SET type = 'booking_confirmation' 
WHERE booking_id IS NOT NULL AND type = 'general';

RAISE NOTICE '✅ Notification type migration completed';
