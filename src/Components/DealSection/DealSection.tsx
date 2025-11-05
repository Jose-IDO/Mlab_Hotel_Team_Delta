import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./DealSection.module.css"; 

type Deal = {
  id: number;
  roomId: string;
  roomName: string;
  roomType: string;
  title: string;
  description?: string;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  images?: string[];
  maxGuests: number;
  bedType: string;
};

const STAR_SVG = ({ filled }: { filled: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={filled ? "#FBBF24" : "none"}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M12 2.5l2.9 5.88 6.49.95-4.69 4.57 1.11 6.47L12 17.77l-5.81 3.6 1.11-6.47L2.6 9.33l6.49-.95L12 2.5z"
      stroke="#B79A1B"
      strokeWidth="0.4"
    />
  </svg>
);

const EYE_SVG = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
      stroke="#374151"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" fill="#374151" />
  </svg>
);

import hotelRoom1 from "../../assets/Hotel-Room-1.jpg";
import hotelRoom2 from "../../assets/Hotel-Room-2.jpg";
import hotelRoom3 from "../../assets/Hotel-Room-3.jpg";

const fallbackImages = [hotelRoom1, hotelRoom2, hotelRoom3];

const DealsSection: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchActiveDeals();
  }, []);

  const fetchActiveDeals = async () => {
    try {
      const res = await fetch(`${API_URL}/deals/active`);
      const data = await res.json();
      if (data.ok && data.data) {
        setDeals(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch active deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (deal: Deal, index: number) => {
    // Use Cloudinary image if available, otherwise use fallback
    if (deal.images && deal.images.length > 0) {
      return deal.images[0];
    }
    return fallbackImages[index % fallbackImages.length];
  };

  const getRating = () => {
    // Generate random rating between 3-5 for display
    return 4; // Fixed rating for simplicity
  };

  const getViews = () => {
    // Generate random views between 200-2000
    return Math.floor(Math.random() * 1800) + 200;
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>Deals For The Weekend</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Loading deals...
        </div>
      </section>
    );
  }

  if (deals.length === 0) {
    return null; // Don't show section if no deals available
  }

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Deals For The Weekend</h2>
      </div>

      <div className={styles.grid}>
        {deals.map((deal, idx) => (
          <Link 
            to={`/room-details/${deal.roomId}?dealPrice=${deal.discountedPrice}&dealId=${deal.id}`}
            key={deal.id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
          <div className={styles.card} style={{ cursor: 'pointer' }}>
            <img
              src={getImageUrl(deal, idx)}
              alt={deal.roomName}
              className={styles.hotelImage}
              style={{ objectFit: "cover", width: "100%", height: "175px" }}
            />

            <div className={styles.content}>
              <div className={styles.titleRow}>
                <h3 className={styles.hotelTitle}>{deal.title}</h3>
                <span className={styles.location}>{deal.roomType} Room</span>
              </div>

              <div className={styles.metaRow}>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={styles.star}>
                      <STAR_SVG filled={i < getRating()} />
                    </span>
                  ))}
                </div>
                <div className={styles.views}>
                  <span className={styles.eyeIcon}><EYE_SVG /></span>
                  <span className={styles.viewCount}>{getViews()}</span>
                </div>
              </div>

              <p className={styles.nights}>
                {deal.discountPercentage}% OFF • {deal.maxGuests} guests
              </p>

              <div className={styles.pricing}>
                <span className={styles.oldPrice}>R{deal.originalPrice.toFixed(0)}</span>
                <span className={styles.newPrice}>R{deal.discountedPrice.toFixed(0)}</span>
              </div>
            </div>
          </div>
          </Link>
        ))}
      </div>

      <div className={styles.buttonRow}>
        <button className={styles.viewAllBtn}>
          View All
        </button>
      </div>
    </section>
  );
};

export default DealsSection;