import React, { useState, useEffect } from "react";
import styles from "./ManageRooms.module.css"
import { RoomImageUpload } from "../../Components/RoomImageUpload/RoomImageUpload";
import { ConfirmDialog } from "../../Components/Shared/ConfirmDialog";

export const ManageRooms: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedRoomForImages, setSelectedRoomForImages] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [archivedRooms, setArchivedRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterBedType, setFilterBedType] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'warning'
  });
  const [formData, setFormData] = useState({
    roomName: "",
    roomType: "",
    newRoomType: "",
    numberOfRooms: "",
    price: "",
    maxGuests: "",
    bedType: "",
    unitPrefix: "",
    startNumber: "1",
    amenities: [] as string[],
    numberOfBeds: "1",
    roomSizeSqm: ""
  });
  const API_URL = import.meta.env.VITE_API_URL;

  // Bed type defaults and constraints
  const bedTypeDefaults: Record<string, { defaultBeds: number; min: number; max: number }> = {
    single: { defaultBeds: 1, min: 1, max: 2 },
    double: { defaultBeds: 1, min: 1, max: 2 },
    queen: { defaultBeds: 1, min: 1, max: 2 },
    king: { defaultBeds: 1, min: 1, max: 2 },
    twin: { defaultBeds: 2, min: 2, max: 4 },
    bunk: { defaultBeds: 2, min: 2, max: 4 }
  };

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
    fetchArchivedRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/rooms?status=active`);
      const data = await res.json();
      if (data.ok) {
        setRooms(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArchivedRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/rooms?status=archived`);
      const data = await res.json();
      if (data.ok) {
        setArchivedRooms(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch archived rooms:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(formData.numberOfRooms || "0", 10);
    const start = parseInt(formData.startNumber || "1", 10);

    const units = Array.from({ length: Math.max(count, 0) }, (_, i) => ({
      unitNumber: `${formData.unitPrefix}${start + i}`
    }));

    const payload = {
      roomName: formData.roomName,
      roomType: formData.roomType === "__new" ? formData.newRoomType : formData.roomType,
      price: Number(formData.price),
      maxGuests: Number(formData.maxGuests),
      bedType: formData.bedType,
      numberOfBeds: Number(formData.numberOfBeds),
      roomSizeSqm: Number(formData.roomSizeSqm || 0),
      amenities: formData.amenities,
      units
    };

    try {
      const url = editingRoomId 
        ? `${API_URL}/admin/rooms/${editingRoomId}`
        : `${API_URL}/admin/rooms`;
      const method = editingRoomId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to ${editingRoomId ? 'update' : 'create'} room`);
      
      setShowForm(false);
      setEditingRoomId(null);
      setSuccessMessage(`Room ${editingRoomId ? 'updated' : 'created'} successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchRooms(); // ← Refresh list
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating/updating room');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRoomId(null);
    setFormData({
      roomName: "",
      roomType: "",
      newRoomType: "",
      numberOfRooms: "",
      price: "",
      maxGuests: "",
      bedType: "",
      unitPrefix: "",
      startNumber: "1",
      amenities: [] as string[],
      numberOfBeds: "1",
      roomSizeSqm: ""
    });
  };

  const handleEditRoom = (room: any) => {
    setEditingRoomId(room.id);
    setFormData({
      roomName: room.roomName,
      roomType: room.roomType,
      newRoomType: "",
      numberOfRooms: String(room.units?.length || 0),
      price: String(room.price),
      maxGuests: String(room.maxGuests),
      bedType: room.bedType,
      unitPrefix: "",
      startNumber: "1",
      amenities: room.amenities || [],
      numberOfBeds: String(room.numberOfBeds || 1),
      roomSizeSqm: String(room.roomSizeSqm || 0)
    });
    setShowForm(true);
  };

  const handleArchiveRoom = (roomId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Archive Room',
      message: 'Are you sure you want to archive this room? It will be moved to the archived section.',
      variant: 'warning',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_URL}/admin/rooms/${roomId}/archive`, {
            method: 'PATCH'
          });
          const data = await res.json();
          
          if (data.ok) {
            setSuccessMessage('Room archived successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
            fetchRooms();
            fetchArchivedRooms();
          }
        } catch (err) {
          console.error('Archive error:', err);
          setErrorMessage('Failed to archive room');
          setTimeout(() => setErrorMessage(null), 5000);
        }
      }
    });
  };

  const handleRestoreRoom = (roomId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Restore Room',
      message: 'Are you sure you want to restore this room? It will be moved back to active rooms.',
      variant: 'info',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_URL}/admin/rooms/${roomId}/restore`, {
            method: 'PATCH'
          });
          const data = await res.json();
          
          if (data.ok) {
            setSuccessMessage('Room restored successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
            fetchRooms();
            fetchArchivedRooms();
          }
        } catch (err) {
          console.error('Restore error:', err);
          setErrorMessage('Failed to restore room');
          setTimeout(() => setErrorMessage(null), 5000);
        }
      }
    });
  };

  const handleDeleteRoom = (roomId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Room Permanently',
      message: 'This will permanently delete the room and all its units. This action cannot be undone. Are you absolutely sure?',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_URL}/admin/rooms/${roomId}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          
          if (data.ok) {
            setSuccessMessage('Room deleted successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
            fetchRooms();
            fetchArchivedRooms();
          } else {
            setErrorMessage(data.error || 'Failed to delete room');
            setTimeout(() => setErrorMessage(null), 5000);
          }
        } catch (err) {
          console.error('Delete error:', err);
          setErrorMessage('Failed to delete room');
          setTimeout(() => setErrorMessage(null), 5000);
        }
      }
    });
  };

  const handleManageImages = (room: any) => {
    setSelectedRoomForImages(room);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedRoomForImages(null);
    fetchRooms(); // Refresh rooms to get updated images
  };

  // Get unique room types and bed types for filters
  const uniqueRoomTypes = Array.from(new Set(rooms.map(r => r.roomType)));
  const uniqueBedTypes = Array.from(new Set(rooms.map(r => r.bedType)));

  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter((room) => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      room.roomName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.id?.toLowerCase().includes(searchTerm.toLowerCase());

    // Room type filter
    const matchesType = filterType === "all" || room.roomType === filterType;

    // Bed type filter
    const matchesBedType = filterBedType === "all" || room.bedType === filterBedType;

    // Price range filter
    const minPrice = priceRange.min === "" ? 0 : Number(priceRange.min);
    const maxPrice = priceRange.max === "" ? Infinity : Number(priceRange.max);
    const matchesPrice = room.price >= minPrice && room.price <= maxPrice;

    return matchesSearch && matchesType && matchesBedType && matchesPrice;
  });

  // Filter archived rooms
  const filteredArchivedRooms = archivedRooms.filter((room) => {
    return searchTerm === "" || 
      room.roomName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.id?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.container}>
      {successMessage && <div className={styles.successAlert}>✓ {successMessage}</div>}
      {errorMessage && <div className={styles.errorAlert}>⚠️ {errorMessage}</div>}
      
      <div className={styles.headerBar}>
        <h1 className={styles.title}>Manage Rooms</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>+ Add Room</button>
      </div>

      {/* Overlay Form */}
      {showForm && (
        <div className={styles.overlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                {editingRoomId ? 'Edit Room' : 'Add New Room'}
              </h2>
              <button 
                className={styles.closeFormBtn} 
                onClick={handleCancel}
                type="button"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              
              {/* Room Name/Label */}
              <div className={styles.formGroup}>
                <label>Room Name/Label</label>
                <input
                  type="text"
                  name="roomName"
                  value={formData.roomName}
                  onChange={handleInputChange}
                  placeholder="e.g., Deluxe King Sea View"
                />
              </div>

              {/* Room Type + Add New */}
              <div className={styles.formGroup}>
                <label>Room Type *</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Room Type</option>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                  <option value="presidential">Presidential Suite</option>
                  <option value="__new">+ Add new type...</option>
                </select>
              </div>

              {formData.roomType === "__new" && (
                <div className={styles.formGroup}>
                  <label>New Room Type *</label>
                  <input
                    type="text"
                    name="newRoomType"
                    value={formData.newRoomType}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Family Suite"
                  />
                </div>
              )}

              {/* Price */}
              <div className={styles.formGroup}>
                <label>Price per Night *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="e.g., 180.00"
                />
              </div>

              {/* Max Guests */}
              <div className={styles.formGroup}>
                <label>Max Guests *</label>
                <input
                  type="number"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="e.g., 2"
                />
              </div>

              {/* Bed Type */}
              <div className={styles.formGroup}>
                <label>Bed Type *</label>
                <select
                  name="bedType"
                  value={formData.bedType}
                  onChange={(e) => {
                    handleInputChange(e);
                    const bt = e.target.value;
                    const defaults = bedTypeDefaults[bt] || { defaultBeds: 1, min: 1, max: 4 };
                    setFormData(prev => ({ ...prev, numberOfBeds: String(defaults.defaultBeds) }));
                  }}
                  required
                >
                  <option value="">Select Bed Type</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="queen">Queen</option>
                  <option value="king">King</option>
                  <option value="twin">Twin</option>
                  <option value="bunk">Bunk</option>
                </select>
              </div>

              {/* Number of Beds (correlates with bed type) */}
              <div className={styles.formGroup}>
                <label>Beds per Unit *</label>
                <input
                  type="number"
                  name="numberOfBeds"
                  value={formData.numberOfBeds}
                  onChange={handleInputChange}
                  required
                  min={(bedTypeDefaults[formData.bedType]?.min ?? 1)}
                  max={(bedTypeDefaults[formData.bedType]?.max ?? 4)}
                  step="1"
                  placeholder="e.g., 1"
                />
                <small>
                  Suggested for {formData.bedType || 'selected type'}:{" "}
                  {(bedTypeDefaults[formData.bedType]?.defaultBeds ?? 1)} bed(s)
                </small>
              </div>

              {/* Room Size */}
              <div className={styles.formGroup}>
                <label>Room Size (sqm) *</label>
                <input
                  type="number"
                  name="roomSizeSqm"
                  value={formData.roomSizeSqm}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.1"
                  placeholder="e.g., 28.5"
                />
              </div>

              {/* Amenities */}
              <div className={styles.formGroup}>
                <label>Amenities</label>
                <div className={styles.amenitiesGrid}>
                  {["WiFi", "Bathtub", "Hairdrier", "Electric Kettle", "Mini Bar", "Room Service", "Toiletries", "Air Conditioning", "Smart TV"].map(amenity => (
                    <label key={amenity} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              {/* Number of Units */}
              <div className={styles.formGroup}>
                <label>Number of Units to Create *</label>
                <input
                  type="number"
                  name="numberOfRooms"
                  value={formData.numberOfRooms}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="e.g., 10"
                />
              </div>

              {/* Unit numbering helper */}
              <div className={styles.formGroup}>
                <label>Unit Numbering (optional)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input
                    type="text"
                    name="unitPrefix"
                    value={formData.unitPrefix}
                    onChange={handleInputChange}
                    placeholder="Prefix (e.g., 10 for 101,102...)"
                  />
                  <input
                    type="number"
                    name="startNumber"
                    value={formData.startNumber}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="Start number (e.g., 1)"
                  />
                </div>
                <small>Example result: {formData.unitPrefix || "10"}{formData.startNumber || "1"}, {formData.unitPrefix || "10"}{(parseInt(formData.startNumber || "1",10)+1)}</small>
              </div>

              {/* Form Actions */}
              <div className={styles.formActions}>
                <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingRoomId ? 'Update Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <section className={styles.filterSection}>
        <div className={styles.filterRow}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Types</option>
            {uniqueRoomTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select 
            value={filterBedType} 
            onChange={(e) => setFilterBedType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Bed Types</option>
            {uniqueBedTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <div className={styles.priceRange}>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
              className={styles.priceInput}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
              className={styles.priceInput}
            />
          </div>

          <button 
            className={styles.clearFilters}
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
              setFilterBedType("all");
              setPriceRange({ min: "", max: "" });
            }}
          >
            Clear
          </button>

          <div className={styles.resultCount}>
            {filteredRooms.length} of {rooms.length}
          </div>
        </div>
      </section>

      {/* Published Rooms */}
      <section className={styles.section}>
        <h3 className={styles.subtitle}>Published Rooms</h3>
        {loading ? (
          <p>Loading rooms...</p>
        ) : filteredRooms.length === 0 ? (
          <p>{rooms.length === 0 ? 'No rooms yet. Click "Add Room" to create one.' : 'No rooms match your filters.'}</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Room Name</th>
                <th>Room Type</th>
                <th>Units</th>
                <th>Price/Night</th>
                <th>Max Guests</th>
                <th>Size (sqm)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room.id}>
                  <td>#{room.id.slice(0, 8)}</td>
                  <td>{room.roomName}</td>
                  <td>{room.roomType}</td>
                  <td>{room.units?.length || 0}</td>
                  <td>${room.price}</td>
                  <td>{room.maxGuests}</td>
                  <td>{room.roomSizeSqm}</td>
                  <td>
                    <button className={styles.editBtn} onClick={() => handleEditRoom(room)}>
                      Edit
                    </button>
                    <button className={styles.imagesBtn} onClick={() => handleManageImages(room)}>
                      Images
                    </button>
                    <button className={styles.archiveBtn} onClick={() => handleArchiveRoom(room.id)}>
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Archived Rooms */}
      <section className={styles.section}>
        <h3 className={styles.subtitle}>Archived Rooms</h3>
        {filteredArchivedRooms.length === 0 ? (
          <p>{archivedRooms.length === 0 ? 'No archived rooms.' : 'No archived rooms match your search.'}</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Room Name</th>
                <th>Room Type</th>
                <th>Units</th>
                <th>Price/Night</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArchivedRooms.map((room) => (
                <tr key={room.id}>
                  <td>#{room.id.slice(0, 8)}</td>
                  <td>{room.roomName}</td>
                  <td>{room.roomType}</td>
                  <td>{room.units?.length || 0}</td>
                  <td>${room.price}</td>
                  <td><span className={`${styles.statusBadge} ${styles.archived}`}>Archived</span></td>
                  <td>
                    <button className={styles.restoreBtn} onClick={() => handleRestoreRoom(room.id)}>
                      Restore
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteRoom(room.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Image Management Modal */}
      {showImageModal && selectedRoomForImages && (
        <div className={styles.overlay}>
          <div className={styles.imageModalContainer}>
            <div className={styles.imageModalHeader}>
              <h2>Manage Images - {selectedRoomForImages.roomName}</h2>
              <button 
                className={styles.closeBtn} 
                onClick={handleCloseImageModal}
              >
                ×
              </button>
            </div>
            <div className={styles.imageModalContent}>
              <RoomImageUpload
                roomId={selectedRoomForImages.id}
                currentImages={selectedRoomForImages.images || []}
                onUploadSuccess={handleCloseImageModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        confirmText={confirmDialog.variant === 'danger' ? 'Delete' : 'Confirm'}
      />
    </div>
  );
};