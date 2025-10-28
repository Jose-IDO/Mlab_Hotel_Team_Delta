-- Add status column to rooms table for soft delete (archive) functionality
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'));

-- Update existing rooms to have 'active' status
UPDATE rooms SET status = 'active' WHERE status IS NULL;

-- Create index for better query performance when filtering by status
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
