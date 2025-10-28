import React from "react";
import styles from "./DestinationCard.module.css";
import sandtonImage from "../../assets/sandton.jpg";
import pretoriaImage from "../../assets/pretoria.jpg";
import durbanImage from "../../assets/durban.jpg";
import capeTownImage from "../../assets/cape town.jpg";
import stellenboschImage from "../../assets/stellenbosch .jpg";

const destinationImages: { [key: string]: string } = {
  "sandton": sandtonImage,
  "stellenbosch": stellenboschImage,
  "cape town": capeTownImage,
  "durban": durbanImage,
  "waterkloof": pretoriaImage
};

interface DestinationCardProps {
  data?: {
    location?: string;
    price?: string;
    description?: string;
  };
  index?: number;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ data, index }) => {
  const location = data?.location?.toLowerCase() || "sandton";
  const imageSrc = destinationImages[location] || sandtonImage;
  const displayName = data?.location || "Sandton";

  return (
    <div className={styles.destinationCard}>
      <img 
        src={imageSrc} 
        alt={data?.location || "Destination"}
        className={styles.destinationImage}
      />
      <h4 className={styles.destinationName}>
        {displayName}
      </h4>
      <p className={styles.destinationDescription}>
        {data?.description ||
          "Experience the vibrant city life and luxurious accommodations."}
      </p>
    </div>
  );
};
