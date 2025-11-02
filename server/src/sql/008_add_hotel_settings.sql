-- Create accommodation table (singleton pattern - only one row)
CREATE TABLE IF NOT EXISTS accommodation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    hotel_name VARCHAR(255) NOT NULL DEFAULT 'Delta Hotel',
    tagline TEXT DEFAULT 'Your Comfort, Our Priority',
    description TEXT,
    
    -- Contact Information
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'South Africa',
    
    -- Operational Details
    check_in_time TIME DEFAULT '14:00:00',
    check_out_time TIME DEFAULT '11:00:00',
    
    -- Social Media
    facebook_url VARCHAR(255),
    instagram_url VARCHAR(255),
    twitter_url VARCHAR(255),
    
    -- Features & Amenities (stored as JSON array)
    amenities JSONB DEFAULT '[]'::jsonb,
    
    -- Images
    logo_url TEXT,
    hero_image_url TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    
    -- Business Info
    tax_rate DECIMAL(5, 2) DEFAULT 15.00,
    currency VARCHAR(3) DEFAULT 'ZAR',
    
    -- Policies
    cancellation_policy TEXT,
    terms_and_conditions TEXT,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure only one row exists
    CONSTRAINT single_row CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid)
);

-- Insert default settings row
INSERT INTO accommodation (id, hotel_name, description, email, phone, address_line1, city, country)
VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Delta Hotel',
    'Experience luxury and comfort at Delta Hotel. Our world-class amenities and exceptional service ensure an unforgettable stay.',
    'info@deltahotel.com',
    '+27 12 345 6789',
    '123 Main Street, Hatfield',
    'Pretoria',
    'South Africa'
)
ON CONFLICT (id) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_accommodation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_accommodation_updated_at ON accommodation;
CREATE TRIGGER set_accommodation_updated_at
    BEFORE UPDATE ON accommodation
    FOR EACH ROW
    EXECUTE FUNCTION update_accommodation_updated_at();

-- Add comments
COMMENT ON TABLE accommodation IS 'Stores hotel configuration and information (singleton - only one row allowed)';
COMMENT ON CONSTRAINT single_row ON accommodation IS 'Ensures only one settings row exists';

-- Sample query to verify
-- SELECT hotel_name, email, phone, address_line1, city FROM accommodation;
