-- Create deals table for weekend and promotional deals
CREATE TABLE IF NOT EXISTS deals (
  id SERIAL PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

-- Create index on room_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_deals_room_id ON deals(room_id);

-- Create index on active deals with date range for efficient querying
CREATE INDEX IF NOT EXISTS idx_deals_active ON deals(is_active, start_date, end_date) WHERE is_active = true;
