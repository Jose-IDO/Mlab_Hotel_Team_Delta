import React, { useEffect, useState } from "react";
import styles from "./RoomDetails.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { LoggedInNavbar } from "../../Components/LoggedInNavbar/LoggedInNavbar";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Wifi, Wind, Tv, Wine, Palmtree, ConciergeBell, Waves, 
  CircleSlash2, PawPrint, Clock, Volume2, AlertCircle,
  Calendar, Users, Sparkles, Coffee, Bath
} from "lucide-react";

// Room images (used to represent types)
import room1 from "../../assets/room1.jpg";
import room2 from "../../assets/room1B.jpg";
import room3 from "../../assets/room1c.jpg";
import room4 from "../../assets/room1d.jpg";
import room5 from "../../assets/room1E.jpg";

type ApiRoom = {
  id: string;
  roomName: string;
  roomType: string;
  price: number;
  maxGuests?: number;
  bedType?: string;
  numberOfBeds?: number;
  roomSizeSqm?: number;
  amenities?: string[];
  description?: string;
};

type UiRoom = {
  id: string;
  name: string;
  image: string;
  price: number;
  adults: number;
  kids: number;
  bedType: string;
  numberOfBeds: number;
  roomSize: number;
  amenities: string[];
  description?: string;
};

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<UiRoom | null>(null);

  const pickImage = (type?: string, name?: string) => {
    const t = (type || name || '').toLowerCase();
    if (t.includes('presidential')) return room5;
    if (t.includes('suite')) return room5;
    if (t.includes('family')) return room4;
    if (t.includes('superior')) return room3;
    if (t.includes('double')) return room2;
    return room1;
  };

  // Map amenity names to icons
  const getAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi')) return <Wifi size={32} />;
    if (a.includes('air') || a.includes('conditioning')) return <Wind size={32} />;
    if (a.includes('tv') || a.includes('netflix')) return <Tv size={32} />;
    if (a.includes('bar') || a.includes('mini')) return <Wine size={32} />;
    if (a.includes('balcony') || a.includes('view')) return <Palmtree size={32} />;
    if (a.includes('room service') || a.includes('service')) return <ConciergeBell size={32} />;
    if (a.includes('spa')) return <Palmtree size={32} />;
    if (a.includes('pool') || a.includes('swimming')) return <Waves size={32} />;
    if (a.includes('toiletries')) return <Sparkles size={32} />;
    if (a.includes('kettle') || a.includes('coffee')) return <Coffee size={32} />;
    if (a.includes('bathtub') || a.includes('bath')) return <Bath size={32} />;
    return <ConciergeBell size={32} />; // default icon
  };

  // Map rule names to icons
  const getRuleIcon = (rule: string) => {
    const r = rule.toLowerCase();
    if (r.includes('smoking')) return <CircleSlash2 size={32} />;
    if (r.includes('pet')) return <PawPrint size={32} />;
    if (r.includes('check')) return <Clock size={32} />;
    if (r.includes('quiet')) return <Volume2 size={32} />;
    if (r.includes('damage')) return <AlertCircle size={32} />;
    return <AlertCircle size={32} />; // default icon
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const API_URL = (import.meta as any).env.VITE_API_URL as string;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/admin/rooms/${id}`);
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to fetch room');
        const r = json.data as ApiRoom;
        const mapped: UiRoom = {
          id: r.id,
          name: r.roomName,
          image: pickImage(r.roomType, r.roomName),
          price: Number(r.price) || 0,
          adults: r.maxGuests ?? 2,
          kids: 0,
          bedType: r.bedType || 'Queen Bed',
          numberOfBeds: r.numberOfBeds || 1,
          roomSize: r.roomSizeSqm || 25,
          amenities: Array.isArray(r.amenities) ? r.amenities : [],
          description: r.description,
        };
        setRoom(mapped);
        setSelectedImage(mapped.image);
      } catch (e: any) {
        setError(e.message || 'Failed to load room');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const handleBookNow = () => {
    if (!room) return;
    const bookingData = {
      roomId: room.id, // Include room ID for backend booking
      hotelName: "Delta Hotel",
      roomType: room.name,
      roomImage: room.image,
      pricePerNight: room.price,
    };

    if (!isAuthenticated) {
      sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate('/signup');
    } else {
      navigate('/booking', { state: bookingData });
    }
  };

  return (
    <>
      <LoggedInNavbar />
      <div className={styles.container}>

      {loading && <div style={{padding: 12}}>Loading room…</div>}
      {error && !loading && (
        <div style={{padding: 12, color:'#b00020'}}>
          {error}
          <div>
            <button className={styles.bookNowBtn} style={{marginTop: 12}} onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      )}

      {!loading && !error && room && (
        <>
          <div className={styles.gallery}>
            <div className={styles.mainImage} onClick={() => setSelectedImage(room.image)}>
              <img src={room.image} alt={room.name} />
            </div>
            <div className={styles.sideImages}>
              <img src={room1} alt="Room 1" onClick={() => setSelectedImage(room1)} />
              <img src={room2} alt="Room 2" onClick={() => setSelectedImage(room2)} />
              <img src={room3} alt="Room 3" onClick={() => setSelectedImage(room3)} />
              <img src={room4} alt="Room 4" onClick={() => setSelectedImage(room4)} />
            </div>
          </div>

          {/* INFO & BOOKING SECTION */}
          <div className={styles.infoSection}>
            <div className={styles.roomType}>
              <h2>{room.name}</h2>
              <p className={styles.price}>R {room.price.toLocaleString()}</p>
            </div>

            <button className={styles.bookNowBtn} onClick={handleBookNow}>
              {isAuthenticated ? 'Book Now' : 'Sign Up to Book'}
            </button>
          </div>

          {/* ROOM DETAILS */}
          <div className={styles.roomDetailsSection}>
            <h2>Room Details</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>👥</span>
                <div className={styles.detailContent}>
                  <span className={styles.detailLabel}>Max Guests</span>
                  <span className={styles.detailValue}>{room.adults} Adults, {room.kids} Children</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>🛏️</span>
                <div className={styles.detailContent}>
                  <span className={styles.detailLabel}>Bed Type</span>
                  <span className={styles.detailValue}>{room.numberOfBeds} × {room.bedType}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>📐</span>
                <div className={styles.detailContent}>
                  <span className={styles.detailLabel}>Room Size</span>
                  <span className={styles.detailValue}>{room.roomSize} m²</span>
                </div>
              </div>
            </div>
          </div>

          {/* AMENITIES */}
          <div className={styles.amenitiesSection}>
            <h2>Amenities</h2>
            <div className={styles.amenitiesContainer}>
              {(room.amenities && room.amenities.length > 0 ? room.amenities : [
                'Free WiFi','Air Conditioning','TV/Netflix','Mini Bar','Balcony View','Room Service','Spa Access','Swimming Pool'
              ]).map((a) => (
                <div key={a} className={styles.amenity}>
                  {getAmenityIcon(a)}
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RULES */}
          <div className={styles.rulesSection}>
            <h2>Hotel Rules</h2>
            <div className={styles.rulesContainer}>
              {['No Smoking','No Pets Allowed','Check-in: 2:00pm | Check-out: 10:00pm','Quiet hours after 10pm','Damage to property will incur a fee'].map((r) => (
                <div key={r} className={styles.rule}>
                  {getRuleIcon(r)}
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AVAILABILITY (static placeholder) */}
          <div className={styles.availabilitySection}>
            <h2>Availability</h2>
            <div className={styles.availabilityInfo}>
              <div className={styles.availabilityItem}>
                <Calendar size={24} className={styles.availabilityIcon} />
                <span>Tue 18 Nov - Thu 27 Nov</span>
              </div>
              <div className={styles.availabilityItem}>
                <Users size={24} className={styles.availabilityIcon} />
                <span>{room.adults} Adults, {room.kids} Children • 1 Room</span>
              </div>
            </div>
          </div>
        </>
      )}

        {/* ---------- IMAGE OVERLAY MODAL ---------- */}
        {selectedImage && (
          <div className={styles.imageOverlay} onClick={() => setSelectedImage(null)}>
            <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
              <button 
                className={styles.closeButton} 
                onClick={() => setSelectedImage(null)}
                aria-label="Close image"
              >
                ✕
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
