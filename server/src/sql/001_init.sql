-- Enable UUID generation (skip if already enabled or if you don't have superuser)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_name TEXT NOT NULL,
  room_type TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  max_guests INT NOT NULL DEFAULT 1,
  bed_type TEXT NOT NULL,
  number_of_beds INT NOT NULL DEFAULT 1,
  room_size_sqm NUMERIC(10,2) NOT NULL DEFAULT 0,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Room units (individual sellable units)
CREATE TABLE IF NOT EXISTS room_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_room_units_room ON room_units(room_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Tables created successfully!';
END $$;