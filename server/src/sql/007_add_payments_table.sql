-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign keys
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Payment details
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) DEFAULT 'ZAR' NOT NULL,
    
    -- Payment status: pending, success, failed, refunded
    status VARCHAR(20) DEFAULT 'pending' NOT NULL 
        CHECK (status IN ('pending', 'success', 'failed', 'refunded', 'cancelled')),
    
    -- Payment gateway information
    payment_method VARCHAR(50), -- e.g., 'paystack', 'stripe', 'card', 'bank_transfer'
    payment_reference VARCHAR(255) UNIQUE, -- Gateway transaction reference
    gateway_response JSONB, -- Store full gateway response for audit trail
    
    -- Transaction metadata
    payment_date TIMESTAMPTZ, -- When payment was successfully processed
    failure_reason TEXT, -- Store reason if payment failed
    refund_amount DECIMAL(10, 2) CHECK (refund_amount >= 0 AND refund_amount <= amount),
    refund_date TIMESTAMPTZ,
    refund_reference VARCHAR(255),
    
    -- Audit timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(payment_reference);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_payments_updated_at ON payments;
CREATE TRIGGER set_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_payments_updated_at();

-- Add comment for documentation
COMMENT ON TABLE payments IS 'Stores payment transaction records for bookings';
COMMENT ON COLUMN payments.payment_reference IS 'Unique reference from payment gateway (e.g., Paystack transaction reference)';
COMMENT ON COLUMN payments.gateway_response IS 'Full JSON response from payment gateway for audit and debugging';
COMMENT ON COLUMN payments.status IS 'Payment status: pending (initiated), success (completed), failed (declined/error), refunded (money returned), cancelled (user cancelled)';

-- Grant permissions (adjust role names as needed)
-- GRANT SELECT, INSERT, UPDATE ON payments TO hotel_app_user;

-- Sample query to verify table creation
-- SELECT table_name, column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'payments' 
-- ORDER BY ordinal_position;
