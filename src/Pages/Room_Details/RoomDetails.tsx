import React, { useState } from "react";
import styles from "./RoomDetails.module.css";
import { useParams } from "react-router-dom";
import { Navbar } from "../../Components/Navbar/Navbar";

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
  const roomId = Number(id);

  const rooms: Room[] = [
    { id: 1, name: "Double Room", image: room1, price: "R1200 PN", adults: 3, kids: 0 },
    { id: 2, name: "Superior Double Room", image: room2, price: "R1470 PN", adults: 2, kids: 0 },
    { id: 3, name: "Continental Room", image: room3, price: "R1720 PN", adults: 3, kids: 0 },
    { id: 4, name: "Family Room", image: room4, price: "R1950 PN", adults: 3, kids: 3 },
    { id: 5, name: "Presidential Suite", image: room5, price: "R2600 PN", adults: 3, kids: 0 },
  ];

  const selectedRoom = rooms.find(room => room.id === roomId) || rooms[0];

  return (
    <div className={styles.container}>
      {<div className={styles.filterContainer}>
        <select className={styles.filterSelect}>
          <option value="all">All</option>
          <option value="single">Single Room</option>
          <option value="double">Double Room</option>
          <option value="suite">Suite</option>
        </select>

        <select className={styles.filterSelect}>
          <option value="all">Room Type</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="family">Family</option>
        </select>

        <select className={styles.filterSelect}>
          <option value="all">Price Range</option>
          <option value="0-1000">R0 - R1000</option>
          <option value="1001-2000">R1001 - R2000</option>
          <option value="2001-3000">R2001+</option>
        </select>

        <select className={styles.filterSelect}>
          <option value="all">Amenities</option>
          <option value="wifi">WiFi</option>
          <option value="pool">Pool</option>
          <option value="parking">Parking</option>
          <option value="spa">Spa</option>
        </select>

        <select className={styles.filterSelect}>
          <option value="all">Rating</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
        </select>

        <select className={styles.filterSelect}>
          <option value="all">Availability</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
        </select>
      </div>}
      <Navbar />

      {}
      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          <img src={selectedRoom.image} alt={selectedRoom.name} />
        </div>
        <div className={styles.sideImages}>
          <img src={room1} alt="Room 1" />
          <img src={room2} alt="Room 2" />
          <img src={room3} alt="Room 3" />
          <img src={room4} alt="Room 4" />

        </div>
      </div>


{}
<div className={styles.infoSection}>
  <div className={styles.roomType}>
    <h2>{selectedRoom.name}</h2>
    <p className={styles.price}>{selectedRoom.price}</p>
  </div>

  <button className={styles.bookNowBtn}>Book Now</button>
</div>


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
</div>

    </div>
  );
};

export default RoomDetails;
