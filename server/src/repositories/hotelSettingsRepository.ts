import pool from '../config/db';
import { HotelSettings, UpdateHotelSettingsDTO } from '../types/hotelSettings.types';

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

function rowToSettings(r: any): HotelSettings {
  return {
    id: r.id,
    hotelName: r.hotel_name,
    tagline: r.tagline,
    description: r.description,
    email: r.email,
    phone: r.phone,
    website: r.website,
    addressLine1: r.address_line1,
    addressLine2: r.address_line2,
    city: r.city,
    stateProvince: r.state_province,
    postalCode: r.postal_code,
    country: r.country,
    checkInTime: r.check_in_time,
    checkOutTime: r.check_out_time,
    facebookUrl: r.facebook_url,
    instagramUrl: r.instagram_url,
    twitterUrl: r.twitter_url,
    amenities: r.amenities || [],
    logoUrl: r.logo_url,
    heroImageUrl: r.hero_image_url,
    galleryImages: r.gallery_images || [],
    taxRate: r.tax_rate ? Number(r.tax_rate) : 15,
    currency: r.currency,
    cancellationPolicy: r.cancellation_policy,
    termsAndConditions: r.terms_and_conditions,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export class HotelSettingsRepository {
  async get(): Promise<HotelSettings> {
    const { rows } = await pool.query(
      'SELECT * FROM accommodation WHERE id = $1',
      [SETTINGS_ID]
    );
    if (!rows[0]) throw new Error('Hotel settings not found');
    return rowToSettings(rows[0]);
  }

  async update(dto: UpdateHotelSettingsDTO): Promise<HotelSettings> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (dto.hotelName !== undefined) {
      updates.push(`hotel_name = $${paramIndex++}`);
      values.push(dto.hotelName);
    }
    if (dto.tagline !== undefined) {
      updates.push(`tagline = $${paramIndex++}`);
      values.push(dto.tagline);
    }
    if (dto.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(dto.description);
    }
    if (dto.email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(dto.email);
    }
    if (dto.phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(dto.phone);
    }
    if (dto.website !== undefined) {
      updates.push(`website = $${paramIndex++}`);
      values.push(dto.website);
    }
    if (dto.addressLine1 !== undefined) {
      updates.push(`address_line1 = $${paramIndex++}`);
      values.push(dto.addressLine1);
    }
    if (dto.addressLine2 !== undefined) {
      updates.push(`address_line2 = $${paramIndex++}`);
      values.push(dto.addressLine2);
    }
    if (dto.city !== undefined) {
      updates.push(`city = $${paramIndex++}`);
      values.push(dto.city);
    }
    if (dto.stateProvince !== undefined) {
      updates.push(`state_province = $${paramIndex++}`);
      values.push(dto.stateProvince);
    }
    if (dto.postalCode !== undefined) {
      updates.push(`postal_code = $${paramIndex++}`);
      values.push(dto.postalCode);
    }
    if (dto.country !== undefined) {
      updates.push(`country = $${paramIndex++}`);
      values.push(dto.country);
    }
    if (dto.checkInTime !== undefined) {
      updates.push(`check_in_time = $${paramIndex++}`);
      values.push(dto.checkInTime);
    }
    if (dto.checkOutTime !== undefined) {
      updates.push(`check_out_time = $${paramIndex++}`);
      values.push(dto.checkOutTime);
    }
    if (dto.facebookUrl !== undefined) {
      updates.push(`facebook_url = $${paramIndex++}`);
      values.push(dto.facebookUrl);
    }
    if (dto.instagramUrl !== undefined) {
      updates.push(`instagram_url = $${paramIndex++}`);
      values.push(dto.instagramUrl);
    }
    if (dto.twitterUrl !== undefined) {
      updates.push(`twitter_url = $${paramIndex++}`);
      values.push(dto.twitterUrl);
    }
    if (dto.amenities !== undefined) {
      updates.push(`amenities = $${paramIndex++}`);
      values.push(JSON.stringify(dto.amenities));
    }
    if (dto.logoUrl !== undefined) {
      updates.push(`logo_url = $${paramIndex++}`);
      values.push(dto.logoUrl);
    }
    if (dto.heroImageUrl !== undefined) {
      updates.push(`hero_image_url = $${paramIndex++}`);
      values.push(dto.heroImageUrl);
    }
    if (dto.galleryImages !== undefined) {
      updates.push(`gallery_images = $${paramIndex++}`);
      values.push(JSON.stringify(dto.galleryImages));
    }
    if (dto.taxRate !== undefined) {
      updates.push(`tax_rate = $${paramIndex++}`);
      values.push(dto.taxRate);
    }
    if (dto.currency !== undefined) {
      updates.push(`currency = $${paramIndex++}`);
      values.push(dto.currency);
    }
    if (dto.cancellationPolicy !== undefined) {
      updates.push(`cancellation_policy = $${paramIndex++}`);
      values.push(dto.cancellationPolicy);
    }
    if (dto.termsAndConditions !== undefined) {
      updates.push(`terms_and_conditions = $${paramIndex++}`);
      values.push(dto.termsAndConditions);
    }

    if (updates.length === 0) return this.get();

    values.push(SETTINGS_ID);
    const { rows } = await pool.query(
      `UPDATE accommodation SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return rowToSettings(rows[0]);
  }
}

export const hotelSettingsRepository = new HotelSettingsRepository();
