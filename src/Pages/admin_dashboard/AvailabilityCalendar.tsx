import React, { useState } from 'react';
import styles from './AvailabilityCalendar.module.css';

interface RoomAvailability {
  roomId: string;
  roomName: string;
  roomType: string;
  dates: { [date: string]: 'available' | 'booked' | 'maintenance' };
}

export const AvailabilityCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string>('all');

  // Static room data
  const rooms: RoomAvailability[] = [
    {
      roomId: 'R2001',
      roomName: 'Ocean View Suite 101',
      roomType: 'Suite',
      dates: {
        '2025-10-27': 'booked',
        '2025-10-28': 'booked',
        '2025-10-29': 'booked',
        '2025-10-30': 'available',
        '2025-10-31': 'maintenance',
        '2025-11-01': 'available',
        '2025-11-05': 'booked',
        '2025-11-06': 'booked',
      }
    },
    {
      roomId: 'R2002',
      roomName: 'Deluxe King 202',
      roomType: 'Deluxe',
      dates: {
        '2025-10-27': 'available',
        '2025-10-28': 'available',
        '2025-10-29': 'booked',
        '2025-10-30': 'booked',
        '2025-10-31': 'booked',
        '2025-11-01': 'booked',
        '2025-11-02': 'available',
        '2025-11-10': 'maintenance',
      }
    },
    {
      roomId: 'R2003',
      roomName: 'Standard Double 305',
      roomType: 'Standard',
      dates: {
        '2025-10-27': 'booked',
        '2025-10-28': 'available',
        '2025-10-29': 'available',
        '2025-10-30': 'available',
        '2025-10-31': 'available',
        '2025-11-01': 'maintenance',
        '2025-11-08': 'booked',
        '2025-11-09': 'booked',
      }
    },
    {
      roomId: 'R2004',
      roomName: 'Presidential Suite 401',
      roomType: 'Presidential',
      dates: {
        '2025-10-27': 'available',
        '2025-10-28': 'booked',
        '2025-10-29': 'booked',
        '2025-10-30': 'booked',
        '2025-10-31': 'booked',
        '2025-11-01': 'booked',
        '2025-11-02': 'booked',
        '2025-11-03': 'available',
      }
    }
  ];

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getStatusForDate = (room: RoomAvailability, day: number) => {
    const dateStr = formatDate(day);
    return room.dates[dateStr] || 'available';
  };

  const filteredRooms = selectedRoom === 'all' 
    ? rooms 
    : rooms.filter(r => r.roomId === selectedRoom);

  // Calculate summary stats
  const totalRooms = rooms.length;
  const bookedToday = rooms.filter(r => 
    getStatusForDate(r, new Date().getDate()) === 'booked'
  ).length;
  const availableToday = totalRooms - bookedToday;
  const occupancyRate = Math.round((bookedToday / totalRooms) * 100);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerBar}>
        <h1 className={styles.title}>Availability Calendar</h1>
        <div className={styles.filterSection}>
          <label>Filter by Room:</label>
          <select 
            value={selectedRoom} 
            onChange={(e) => setSelectedRoom(e.target.value)}
            className={styles.roomSelect}
          >
            <option value="all">All Rooms</option>
            {rooms.map(room => (
              <option key={room.roomId} value={room.roomId}>
                {room.roomName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏨</div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Total Rooms</div>
            <div className={styles.statValue}>{totalRooms}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Available Today</div>
            <div className={styles.statValue}>{availableToday}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Booked Today</div>
            <div className={styles.statValue}>{bookedToday}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Occupancy Rate</div>
            <div className={styles.statValue}>{occupancyRate}%</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.available}`}></span>
          Available
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.booked}`}></span>
          Booked
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.maintenance}`}></span>
          Maintenance
        </span>
      </div>

      {/* Calendar Section */}
      <section className={styles.calendarSection}>
        {/* Month Navigation */}
        <div className={styles.monthNav}>
          <button onClick={previousMonth} className={styles.navBtn}>
            ← Previous
          </button>
          <h2 className={styles.monthTitle}>
            {monthNames[month]} {year}
          </h2>
          <button onClick={nextMonth} className={styles.navBtn}>
            Next →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className={styles.calendarGrid}>
          {/* Header Row - Days of Week */}
          <div className={styles.calendarHeader}>
            <div className={styles.roomNameCell}>Room</div>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className={styles.dayHeader}>{day}</div>
            ))}
          </div>

          {/* Room Rows */}
          {filteredRooms.map(room => (
            <div key={room.roomId} className={styles.roomRow}>
              <div className={styles.roomNameCell}>
                <div className={styles.roomName}>{room.roomName}</div>
                <div className={styles.roomType}>{room.roomType}</div>
              </div>
              
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className={styles.emptyCell}></div>
              ))}
              
              {/* Date cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const status = getStatusForDate(room, day);
                const isToday = 
                  day === new Date().getDate() && 
                  month === new Date().getMonth() && 
                  year === new Date().getFullYear();

                return (
                  <div 
                    key={day} 
                    className={`${styles.dateCell} ${styles[status]} ${isToday ? styles.today : ''}`}
                    title={`${room.roomName} - ${formatDate(day)} - ${status}`}
                  >
                    <span className={styles.dayNumber}>{day}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};