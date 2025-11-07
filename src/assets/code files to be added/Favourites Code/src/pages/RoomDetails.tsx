// ──────────────────────────────────────
// Add imports
import FavoriteButton from "../../components/FavoriteButton";
import { useFavorites } from "../../contexts/FavoritesContext";

// ──────────────────────────────────────
// Inside component (after room is loaded)
const { toggleFavorite, isFavorite } = useFavorites();

// ──────────────────────────────────────
// Inside the infoSection (next to Book Now)
<div className={styles.infoSection}>
  <div className={styles.roomType}>…</div>

  <FavoriteButton
    id={room!.id}
    isFavorite={isFavorite(room!.id)}
    onToggle={(id, next) => {
      toggleFavorite({
        id,
        type: "room",
        name: room!.name,
        price: room!.price,
        image: room!.image,
      });
    }}
  />

  <button className={styles.bookNowBtn} onClick={handleBookNow}>…</button>
</div>