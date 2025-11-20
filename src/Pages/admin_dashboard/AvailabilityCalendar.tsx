import React, { useEffect, useMemo, useState } from 'react';
import styles from './AvailabilityCalendar.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../config/api';

interface RoomAvailability {
  roomId: string;
  roomName: string;
  roomType: string;
  dates: { [date: string]: 'available' | 'booked' | 'maintenance' };
}

export const AvailabilityCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [rooms, setRooms] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

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

  // Build weekly chunks (7 days) including leading empties
  const buildWeekChunks = (room: RoomAvailability) => {
    const leading = startingDayOfWeek; // 0-6 where 0=Sun
    const cells: Array<{ key: string; status?: 'available'|'booked'|'maintenance'; day?: number } | null> = [];
    for (let i = 0; i < leading; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const status = getStatusForDate(room, d);
      cells.push({ key: `${year}-${month}-${d}`, status, day: d });
    }
    // pad to multiple of 7
    while (cells.length % 7 !== 0) cells.push(null);
    // chunk
    const weeks: typeof cells[] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  };

  // Fetch availability for current month
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const start = `${year}-${String(month + 1).padStart(2,'0')}-01`;
        const endDate = new Date(year, month + 1, 0).getDate();
        const end = `${year}-${String(month + 1).padStart(2,'0')}-${String(endDate).padStart(2,'0')}`;
        const res = await fetch(`${API_URL}/bookings/admin/availability?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response. Is the API running?');
        }
        const json = await res.json();
        if (!res.ok || json.ok === false) throw new Error(json.error || 'Failed to load availability');
        const data = (json.data || []) as Array<any>;
        const mapped: RoomAvailability[] = data.map((r: any) => ({
          roomId: r.roomId,
          roomName: r.roomName,
          roomType: r.roomType,
          dates: r.dates || {}
        }));
        setRooms(mapped);
      } catch (e: any) {
        setError(e.message || 'Failed to load availability');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, token]);

  const filteredRooms = useMemo(() => (selectedRoom === 'all' ? rooms : rooms.filter(r => r.roomId === selectedRoom)), [rooms, selectedRoom]);

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

  {/* Loading / Error */}
  {loading && (<div className={styles.legend}>Loading availability…</div>)}
  {error && !loading && (<div className={styles.legend} style={{color:'#b00020'}}>⚠️ {error}</div>)}

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

          {/* Room Rows rendered by weeks to keep 7 columns aligned */}
          {filteredRooms.map(room => {
            const weeks = buildWeekChunks(room);
            return (
              <React.Fragment key={room.roomId}>
                {weeks.map((week, wIdx) => (
                  <div key={`${room.roomId}-w${wIdx}`} className={styles.roomRow}>
                    {wIdx === 0 ? (
                      <div className={styles.roomNameCell}>
                        <div className={styles.roomName}>{room.roomName}</div>
                        <div className={styles.roomType}>{room.roomType}</div>
                      </div>
                    ) : (
                      <div className={styles.roomNameSpacer} />
                    )}
                    {week.map((cell, idx) => {
                      if (!cell) return <div key={`e-${idx}`} className={styles.emptyCell}></div>;
                      const isToday = 
                        cell.day === new Date().getDate() && 
                        month === new Date().getMonth() && 
                        year === new Date().getFullYear();
                      return (
                        <div
                          key={`d-${cell.day}`}
                          className={`${styles.dateCell} ${styles[cell.status!]} ${isToday ? styles.today : ''}`}
                          title={`${room.roomName} - ${formatDate(cell.day!)} - ${cell.status}`}
                        >
                          <span className={styles.dayNumber}>{cell.day}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </div>
  );
};