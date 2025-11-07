import React from "react";
import styles from "./FavoriteButton.module.css";

interface FavoriteButtonProps {
  /** Unique id – "hotel" for the hotel, room.id for a room */
  id: string;
  /** true = filled heart */
  isFavorite: boolean;
  /** Called when the user clicks */
  onToggle: (id: string, next: boolean) => void;
}

/**
 * Heart button that matches the one on HotelDetails header.
 * Gradient, hover, and active state are identical to the generic Button.
 */
const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  id,
  isFavorite,
  onToggle,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent navigation when clicking the heart
    onToggle(id, !isFavorite);
  };

  return (
    <button
      type="button"
      className={`${styles.favBtn} ${isFavorite ? styles.filled : ""}`}
      onClick={handleClick}
      aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
    >
      {isFavorite ? "Heart" : "Heart"}
    </button>
  );
};

export default FavoriteButton;