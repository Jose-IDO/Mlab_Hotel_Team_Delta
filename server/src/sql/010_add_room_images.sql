-- Add images column to rooms table
ALTER TABLE rooms 
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

COMMENT ON COLUMN rooms.images IS 'Array of Cloudinary image URLs for the room';
