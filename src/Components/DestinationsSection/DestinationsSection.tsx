import { useState } from "react";
import { DestinationCard } from "../DestinationCard/DestinationCard";
import styles from "./DestinationsSection.module.css";

interface Destination {
  location?: string;
  price?: string;
  description?: string;
}

const destinations: Destination[] = [
  { 
    location: "Sandton",
    description: "Experience luxury in the heart of Africa's richest square mile. Discover world-class shopping at Sandton City, vibrant nightlife, and stunning urban sophistication."
  },
  { 
    location: "Stellenbosch",
    description: "Escape to the charming wine country where historic oak-lined streets meet world-renowned vineyards. Indulge in award-winning wines and breathtaking mountain scenery."
  },
  { 
    location: "Cape Town",
    description: "Discover the Mother City where iconic Table Mountain meets pristine beaches. Experience vibrant culture, award-winning cuisine, and unforgettable coastal adventures."
  },
  { 
    location: "Durban",
    description: "Embrace the golden sunshine on the warm Indian Ocean coast. Enjoy golden beaches, rich Zulu heritage, and the vibrant flavors of local street food and spices."
  },
  { 
    location: "Waterkloof",
    description: "Nestled in Pretoria's prestigious suburbs, enjoy tranquil luxury with easy access to Union Buildings, the National Zoological Gardens, and Jacaranda-lined streets."
  }
];

export const DestinationsSection = () => {
  const [showAll, setShowAll] = useState(false);

  const displayedDestinations = showAll ? destinations : destinations.slice(0, 3);

  return (
    <div className={styles.destinationGridWrapper}>
      <div className={styles.destinationGrid}>
        {displayedDestinations.map((destination, index) => (
          <DestinationCard key={index} data={destination} index={index} />
        ))}
      </div>
      {destinations.length > 3 && (
        <button 
          className={styles.viewAllBtn}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "View Less" : "View More"}
        </button>
      )}
    </div>
  );
};
