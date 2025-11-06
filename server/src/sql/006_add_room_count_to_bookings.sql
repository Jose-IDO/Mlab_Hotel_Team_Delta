-- Add room_count column to bookings table
ALTER TABLE bookings 
  ADD COLUMN IF NOT EXISTS room_count INT NOT NULL DEFAULT 1 CHECK (room_count > 0);

-- Index for room_count queries (optional)
CREATE INDEX IF NOT EXISTS idx_bookings_room_count ON bookings(room_count);