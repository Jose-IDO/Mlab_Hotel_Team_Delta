-- Add payment fields to bookings table
ALTER TABLE bookings 
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Add index for payment reference lookups
CREATE INDEX IF NOT EXISTS idx_bookings_payment_ref ON bookings(payment_reference);

-- Add index for finding expired bookings
CREATE INDEX IF NOT EXISTS idx_bookings_expires_at ON bookings(expires_at) WHERE status = 'pending';

-- Update the status default to 'pending' instead of 'confirmed'
ALTER TABLE bookings ALTER COLUMN status SET DEFAULT 'pending';
