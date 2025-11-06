import { LoggedInNavbar } from "../../Components/LoggedInNavbar/LoggedInNavbar";
import { HotelRoomsGrid } from "../../Components/HotelRoomsGrid/HotelRoomsGrid";
import DealsSection from "../../Components/DealSection/DealSection";
import { DestinationsSection } from "../../Components/DestinationsSection/DestinationsSection";
import styles from "./CustomerDashboard.module.css";

export const CustomerDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <LoggedInNavbar />

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Rooms</h2>
        <HotelRoomsGrid />
      </div>

      <div className={styles.section}>
        <DealsSection />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Destinations</h2>
        <DestinationsSection />
      </div>
    </div>
  );
};
