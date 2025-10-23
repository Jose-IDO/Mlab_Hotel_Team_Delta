import React from "react";
import styles from "./DealSection.module.css"; 

type Deal = {
  id: string;
  hotel: string;
  location: string;
  nights: string;
  rating: number; 
  views: number;
  oldPrice: string;
  newPrice: string;
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

const baseDeals: Deal[] = [
  {
    id: "d-1",
    hotel: "Delta Hotel",
    location: "Pretoria, South Africa",
    nights: "2 nights",
    rating: 4,
    views: 1134,
    oldPrice: 'R1850',
    newPrice: 'R1250',
  },
  {
    id: "d-2",
    hotel: "Delta Hotel",
    location: "Pretoria, South Africa",
    nights: "2 nights",
    rating: 5,
    views: 550,
    oldPrice: 'R2200',
    newPrice: 'R1800',
  },
  {
    id: "d-3",
    hotel: "Delta Hotel",
    location: "Pretoria, South Africa",
    nights: "1 night",
    rating: 3,
    views: 777,
    oldPrice: 'R1100',
    newPrice: 'R700',
  },
];

import hotelRoom1 from "../../assets/Hotel-Room-1.jpg";
import hotelRoom2 from "../../assets/Hotel-Room-2.jpg";
import hotelRoom3 from "../../assets/Hotel-Room-3.jpg";

const hotelImages = [hotelRoom1, hotelRoom2, hotelRoom3];

const DealsSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Deals For The Weekend</h2>
      </div>

      <div className={styles.grid}>
        {baseDeals.map((deal, idx) => (
          <div className={styles.card} key={deal.id}>
            <img
              src={hotelImages[idx % hotelImages.length]}
              alt={`Hotel room ${idx + 1}`}
              className={styles.hotelImage}
              style={{ objectFit: "cover", width: "100%", height: "175px" }}
            />

            <div className={styles.content}>
              <div className={styles.titleRow}>
                <h3 className={styles.hotelTitle}>{deal.hotel}</h3>
                <span className={styles.location}>{deal.location}</span>
              </div>

              <div className={styles.metaRow}>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={styles.star}>
                      <STAR_SVG filled={i < deal.rating} />
                    </span>
                  ))}
                </div>
                <div className={styles.views}>
                  <span className={styles.eyeIcon}><EYE_SVG /></span>
                  <span className={styles.viewCount}>{deal.views}</span>
                </div>
              </div>

              <p className={styles.nights}>{deal.nights}</p>

              <div className={styles.pricing}>
                <span className={styles.oldPrice}>{deal.oldPrice}</span>
                <span className={styles.newPrice}>{deal.newPrice}</span>
              </div>
            </div>
          </div>
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