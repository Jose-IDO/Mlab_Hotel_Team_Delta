// ──────────────────────────────────────
// Imports (add these at the top)
import FavoriteButton from "../../components/FavoriteButton";
import { useFavorites } from "../../contexts/FavoritesContext";
import hotelMain from "../../assets/Hotel-Room-1.jpg";

// ──────────────────────────────────────
// Inside the component
const { toggleFavorite, isFavorite } = useFavorites();
const hotelFavoriteId = "hotel";

// ──────────────────────────────────────
// Replace the header actions block
<div className={styles.headerActions}>
  <button className={styles.mapBtn} onClick={scrollToMap}>
    View on Map
  </button>

  <FavoriteButton
    id={hotelFavoriteId}
    isFavorite={isFavorite(hotelFavoriteId)}
    onToggle={(id, next) => {
      toggleFavorite({
        id,
        type: "hotel",
        name: hotelData.name,
        image: hotelData.mainImage,
      });
    }}
  />
</div>

// ──────────────────────────────────────
// Inside each room card (inside .roomDetails)
<div className={styles.roomDetails}>
  <h3 className={styles.roomName}>{room.name}</h3>
  <div className={styles.starRating}>…</div>
  <p>{room.adults} adults • {room.kids} kids</p>
  <p className={styles.price}>Price per night: R {room.price.toLocaleString()}</p>

  {/* HEART BUTTON */}
  <div className={styles.roomFavWrapper}>
    <FavoriteButton
      id={room.id}
      isFavorite={isFavorite(room.id)}
      onToggle={(id, next) => {
        toggleFavorite({
          id,
          type: "room",
          name: room.name,
          price: room.price,
          image: room.image,
        });
      }}
    />
  </div>
</div>