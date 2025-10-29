import React, { useEffect, useState } from "react";
import styles from "./RoomDetails.module.css";
import { useParams, useNavigate } from "react-router-dom";   // ← useNavigate added
import { LoggedInNavbar } from "../../Components/LoggedInNavbar/LoggedInNavbar";
<<<<<<< HEAD
=======
import { Star } from "lucide-react";

>>>>>>> c5865fed94b8731d4e123abd3268549ddb2ca6cd
import room1 from "../../assets/room1.jpg";
import room2 from "../../assets/room1B.jpg";
import room3 from "../../assets/room1c.jpg";
import room4 from "../../assets/room1d.jpg";
import room5 from "../../assets/room1E.jpg";
import wifiIcon from "../../assets/wifi-signal.png";
import balconyIcon from "../../assets/balcony.png";
import acIcon from "../../assets/air-conditioner.png";
import minibarIcon from "../../assets/whisky.png";
import spaIcon from "../../assets/facial-massage.png";
import tvIcon from "../../assets/smart-tv.png";
import poolIcon from "../../assets/ooooooooooooooooooooooooooooooooooo.png";
import roomServiceIcon from "../../assets/room-service.png";
import noSmokingIcon from "../../assets/no-smoking.png";
import noPetsIcon from "../../assets/no-pets.png";
import checkInOutIcon from "../../assets/check-in.png";
import quietHoursIcon from "../../assets/mute.png";
import damageIcon from "../../assets/administrative-fine.png";
import calendarIcon from "../../assets/calendar.png";
import peopleIcon from "../../assets/people.png";

import profileIcon from "../../assets/user.png";
import likeIcon from "../../assets/like.png";
import dislikeIcon from "../../assets/dont-like.png";

interface Room {
  id: number;
  name: string;
  image: string;
  price: string;
  adults: number;
  kids: number;
}

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();                          // ← Hook
  const roomId = Number(id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const rooms: Room[] = [
    { id: 1, name: "Double Room", image: room1, price: "R1200 PN", adults: 3, kids: 0 },
    { id: 2, name: "Superior Double Room", image: room2, price: "R1470 PN", adults: 2, kids: 0 },
    { id: 3, name: "Continental Room", image: room3, price: "R1720 PN", adults: 3, kids: 0 },
    { id: 4, name: "Family Room", image: room4, price: "R1950 PN", adults: 3, kids: 3 },
    { id: 5, name: "Presidential Suite", image: room5, price: "R2600 PN", adults: 3, kids: 0 },
  ];

  const selectedRoom = rooms.find(room => room.id === roomId) || rooms[0];

  // ← BOOK NOW: Send real data to BookingPage
  const handleBookNow = () => {
    const pricePerNight = parseFloat(selectedRoom.price.replace(/[^\d.]/g, ""));
    const totalPrice = pricePerNight * 3; // 3 nights

    navigate('/booking', {
      state: {
        hotelName: "Ritz Plaza Hotel",
        roomType: selectedRoom.name,
        checkIn: "2025-10-14",
        checkOut: "2025-10-17",
        nights: 3,
        totalPrice: totalPrice,
      },
    });
  };

  return (
    <>
      <LoggedInNavbar />
      <div className={styles.container}>
        {/* GALLERY */}
        <div className={styles.gallery}>
          <div className={styles.mainImage} onClick={() => setSelectedImage(selectedRoom.image)}>
            <img src={selectedRoom.image} alt={selectedRoom.name} />
          </div>
          <div className={styles.sideImages}>
            <img src={room1} alt="Room 1" onClick={() => setSelectedImage(room1)} />
            <img src={room2} alt="Room 2" onClick={() => setSelectedImage(room2)} />
            <img src={room3} alt="Room 3" onClick={() => setSelectedImage(room3)} />
            <img src={room4} alt="Room 4" onClick={() => setSelectedImage(room4)} />
          </div>
        </div>

        {/* INFO SECTION */}
        <div className={styles.infoSection}>
          <div className={styles.roomType}>
            <h2>{selectedRoom.name}</h2>
            <p className={styles.price}>{selectedRoom.price}</p>
          </div>
          {/* BOOK NOW BUTTON */}
          <button className={styles.bookNowBtn} onClick={handleBookNow}>
            Book Now
          </button>
        </div>

        {/* AMENITIES */}
        <div className={styles.amenitiesSection}>
          <h2>Amenities</h2>
          <div className={styles.amenitiesContainer}>
            <div className={styles.amenity}><img src={wifiIcon} alt="WiFi" /><span>Free WiFi</span></div>
            <div className={styles.amenity}><img src={balconyIcon} alt="Balcony" /><span>Balcony View</span></div>
            <div className={styles.amenity}><img src={acIcon} alt="AC" /><span>Air Conditioning</span></div>
            <div className={styles.amenity}><img src={minibarIcon} alt="Mini Bar" /><span>Mini Bar</span></div>
            <div className={styles.amenity}><img src={spaIcon} alt="Spa" /><span>Spa</span></div>
            <div className={styles.amenity}><img src={tvIcon} alt="TV/Netflix" /><span>TV/Netflix</span></div>
            <div className={styles.amenity}><img src={poolIcon} alt="Swimming Pool" /><span>Swimming Pool</span></div>
            <div className={styles.amenity}><img src={roomServiceIcon} alt="Room Service" /><span>Room Service</span></div>
          </div>
        </div>

        {/* RULES */}
        <div className={styles.rulesSection}>
          <h2>Hotel Rules</h2>
          <div className={styles.rulesContainer}>
            <div className={styles.rule}><img src={noSmokingIcon} alt="No Smoking" /><span>No Smoking</span></div>
            <div className={styles.rule}><img src={noPetsIcon} alt="No Pets" /><span>No Pets Allowed</span></div>
            <div className={styles.rule}><img src={checkInOutIcon} alt="Check-in/out" /><span>Check-in: 2:00pm | Check-out: 10:00pm</span></div>
            <div className={styles.rule}><img src={quietHoursIcon} alt="Quiet Hours" /><span>Quiet hours after 10pm</span></div>
            <div className={styles.rule}><img src={damageIcon} alt="Damage" /><span>Damage to property will incur a fee</span></div>
          </div>
        </div>

        {/* AVAILABILITY */}
        <div className={styles.availabilitySection}>
          <h2>Availability</h2>
          <div className={styles.availabilityInfo}>
            <div className={styles.availabilityItem}>
              <img src={calendarIcon} alt="Calendar Icon" className={styles.availabilityIcon} />
              <span>Tue 18 Nov - Thu 27 Nov</span>
            </div>
            <div className={styles.availabilityItem}>
              <img src={peopleIcon} alt="People Icon" className={styles.availabilityIcon} />
              <span>2 Adults, 0 Children • 1 Room</span>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* IMAGE MODAL */}
=======

      {}
<div className={styles.amenitiesSection}>
  <h2>Amenities</h2>
  <div className={styles.amenitiesContainer}>
    <div className={styles.amenity}><img src={wifiIcon} alt="WiFi" /><span>Free WiFi</span></div>
    <div className={styles.amenity}><img src={balconyIcon} alt="Balcony" /><span>Balcony View</span></div>
    <div className={styles.amenity}><img src={acIcon} alt="AC" /><span>Air Conditioning</span></div>
    <div className={styles.amenity}><img src={minibarIcon} alt="Mini Bar" /><span>Mini Bar</span></div>
    <div className={styles.amenity}><img src={spaIcon} alt="Spa" /><span>Spa</span></div>
    <div className={styles.amenity}><img src={tvIcon} alt="TV/Netflix" /><span>TV/Netflix</span></div>
    <div className={styles.amenity}><img src={poolIcon} alt="Swimming Pool" /><span>Swimming Pool</span></div>
    <div className={styles.amenity}><img src={roomServiceIcon} alt="Room Service" /><span>Room Service</span></div>
  </div>
</div>

<div className={styles.rulesSection}>
  <h2>Hotel Rules</h2>
  <div className={styles.rulesContainer}>
    <div className={styles.rule}><img src={noSmokingIcon} alt="No Smoking" /><span>No Smoking</span></div>
    <div className={styles.rule}><img src={noPetsIcon} alt="No Pets" /><span>No Pets Allowed</span></div>
    <div className={styles.rule}><img src={checkInOutIcon} alt="Check-in/out" /><span>Check-in: 2:00pm | Check-out: 10:00pm</span></div>
    <div className={styles.rule}><img src={quietHoursIcon} alt="Quiet Hours" /><span>Quiet hours after 10pm</span></div>
    <div className={styles.rule}><img src={damageIcon} alt="Damage" /><span>Damage to property will incur a fee</span></div>
  </div>
</div>

<div className={styles.availabilitySection}>
  <h2>Availability</h2>
  <div className={styles.availabilityInfo}>
    <div className={styles.availabilityItem}>
      <img src={calendarIcon} alt="Calendar Icon" className={styles.availabilityIcon} />
      <span>Tue 18 Nov - Thu 27 Nov</span>
    </div>
    <div className={styles.availabilityItem}>
      <img src={peopleIcon} alt="People Icon" className={styles.availabilityIcon} />
      <span>2 Adults, 0 Children • 1 Room</span>
    </div>
  </div>

<div className={styles.reviewsSection}>
  <h2>Reviews & Ratings</h2>

  <div className={styles.reviewsRow}>
    <div className={styles.reviewsContainer}>
      {/* Review 1 */}
      <div className={styles.reviewCard}>
        <div className={styles.reviewHeader}>
          <img src={profileIcon} alt="User 1" className={styles.profileImg} />
          <div className={styles.userInfo}>
            <span className={styles.userName}>Maluleke Florence</span>
            <div className={styles.userRating}>
              {[1,2,3,4,5].map((i) => (
                <Star key={i} size={16} className={styles.star} />
              ))}
            </div>
          </div>
          <span className={styles.reviewDate}>August 18, 2025</span>
        </div>
        <p className={styles.reviewMessage}>
          Amazing room! Very clean, comfortable, and the staff were friendly.
        </p>
        <div className={styles.reviewActions}>
          <button className={styles.likeBtn}><img src={likeIcon} alt="Like" /> Like</button>
          <button className={styles.dislikeBtn}><img src={dislikeIcon} alt="Dislike" /> Dislike</button>
        </div>
      </div>

      {/* Review 2 */}
      <div className={styles.reviewCard}>
        <div className={styles.reviewHeader}>
          <img src={profileIcon} alt="User 2" className={styles.profileImg} />
          <div className={styles.userInfo}>
            <span className={styles.userName}>Kgopotso Lethole</span>
            <div className={styles.userRating}>
              {[1,2,3,4].map((i) => <Star key={i} size={16} className={styles.star} />)}
            </div>
          </div>
          <span className={styles.reviewDate}>Nov 20, 2025</span>
        </div>
        <p className={styles.reviewMessage}>
          Great view from the balcony and the WiFi was excellent!
        </p>
        <div className={styles.reviewActions}>
          <button className={styles.likeBtn}><img src={likeIcon} alt="Like" /> Like</button>
          <button className={styles.dislikeBtn}><img src={dislikeIcon} alt="Dislike" /> Dislike</button>
        </div>
      </div>

      {/* Review 3 */}
      <div className={styles.reviewCard}>
        <div className={styles.reviewHeader}>
          <img src={profileIcon} alt="User 3" className={styles.profileImg} />
          <div className={styles.userInfo}>
            <span className={styles.userName}>Alick Macheso</span>
            <div className={styles.userRating}>
              {[1,2,3].map((i) => <Star key={i} size={16} className={styles.star} />)}
            </div>
          </div>
          <span className={styles.reviewDate}>Nov 22, 2025</span>
        </div>
        <p className={styles.reviewMessage}>
          Comfortable bed and excellent room service. Highly recommended!
        </p>
        <div className={styles.reviewActions}>
          <button className={styles.likeBtn}><img src={likeIcon} alt="Like" /> Like</button>
          <button className={styles.dislikeBtn}><img src={dislikeIcon} alt="Dislike" /> Dislike</button>
        </div>
      </div>

      {/* Review 4 */}
      <div className={styles.reviewCard}>
        <div className={styles.reviewHeader}>
          <img src={profileIcon} alt="User 4" className={styles.profileImg} />
          <div className={styles.userInfo}>
            <span className={styles.userName}>Michael Jackson</span>
            <div className={styles.userRating}>
              {[1,2,3,4,5].map((i) => <Star key={i} size={16} className={styles.star} />)}
            </div>
          </div>
          <span className={styles.reviewDate}>Nov 25, 2025</span>
        </div>
        <p className={styles.reviewMessage}>
          Very spacious room and excellent amenities. Loved the pool!
        </p>
        <div className={styles.reviewActions}>
          <button className={styles.likeBtn}><img src={likeIcon} alt="Like" /> Like</button>
          <button className={styles.dislikeBtn}><img src={dislikeIcon} alt="Dislike" /> Dislike</button>
        </div>
      </div>
    </div>
  </div>
</div>
 

</div>

        {/* ---------- IMAGE OVERLAY MODAL ---------- */}
>>>>>>> c5865fed94b8731d4e123abd3268549ddb2ca6cd
        {selectedImage && (
          <div className={styles.imageOverlay} onClick={() => setSelectedImage(null)}>
            <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedImage(null)}
                aria-label="Close image"
              >
                X
              </button>
              <img src={selectedImage} alt="Full size view" className={styles.fullImage} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RoomDetails;