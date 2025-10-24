import React, { useState } from "react";
import styles from "./ManageAccom.module.css";

export const ManageAccom: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomName: "",
    roomType: "",
    newRoomType: "",
    numberOfRooms: "",
    price: "",
    maxGuests: "",
    bedType: "",
    amenities: [] as string[],
    photos: [] as File[]
  });

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...Array.from(e.target.files!)]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      roomName: formData.roomName,
      roomType: formData.roomType === "__new" ? formData.newRoomType : formData.roomType,
      numberOfRooms: formData.numberOfRooms,
      price: formData.price,
      maxGuests: formData.maxGuests,
      bedType: formData.bedType,
      amenities: formData.amenities,
      photos: formData.photos
    };
    console.log("New room payload:", payload);
    // TODO: submit payload to API
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      roomName: "",
      roomType: "",
      newRoomType: "",
      numberOfRooms: "",
      price: "",
      maxGuests: "",
      bedType: "",
      amenities: [],
      photos: []
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1 className={styles.title}>Manage Rooms</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>+ Add Room</button>
      </div>

      {/* Overlay Form */}
      {showForm && (
        <div className={styles.overlay}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Add New Room</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              
              {/* Photo Upload */}
              <div className={styles.formGroup}>
                <label>Photos</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className={styles.fileInput}
                />
                <div className={styles.photoPreview}>
                  {formData.photos.map((photo, index) => (
                    <div key={index} className={styles.photoItem}>
                      <img src={URL.createObjectURL(photo)} alt={`Preview ${index}`} />
                    </div>
                  ))}
                </div>
              </div>

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

              {/* Number of Rooms */}
              <div className={styles.formGroup}>
                <label>Number of Rooms *</label>
                <input
                  type="number"
                  name="numberOfRooms"
                  value={formData.numberOfRooms}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="e.g., 5"
                />
              </div>

              {/* Price */}
              <div className={styles.formGroup}>
                <label>Price per Night (USD) *</label>
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
                  onChange={handleInputChange}
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

              {/* Amenities */}
              <div className={styles.formGroup}>
                <label>Amenities</label>
                <div className={styles.amenitiesGrid}>
                  {["WiFi", "Pool", "Gym", "Parking", "Restaurant", "Room Service", "Spa", "Bar", "Air Conditioning", "TV"].map(amenity => (
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

              {/* Form Actions */}
              <div className={styles.formActions}>
                <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Published Rooms */}
      <section className={styles.section}>
        <h3 className={styles.subtitle}>Published Rooms</h3>
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
            <tr>
              <td>#R2001</td>
              <td>Ocean View Suite</td>
              <td>Suite</td>
              <td>10</td>
              <td>$220</td>
              <td><span className={`${styles.statusBadge} ${styles.published}`}>Published</span></td>
              <td>
                <button className={styles.editBtn}>Edit</button>
                <button className={styles.archiveBtn}>Archive</button>
              </td>
            </tr>
            <tr>
              <td>#R2002</td>
              <td>Deluxe King</td>
              <td>Deluxe</td>
              <td>8</td>
              <td>$160</td>
              <td><span className={`${styles.statusBadge} ${styles.published}`}>Published</span></td>
              <td>
                <button className={styles.editBtn}>Edit</button>
                <button className={styles.archiveBtn}>Archive</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Archived Rooms */}
      <section className={styles.section}>
        <h3 className={styles.subtitle}>Archived Rooms</h3>
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
            <tr>
              <td>#R1991</td>
              <td>Standard Single</td>
              <td>Standard</td>
              <td>15</td>
              <td>$90</td>
              <td><span className={`${styles.statusBadge} ${styles.archived}`}>Archived</span></td>
              <td>
                <button className={styles.restoreBtn}>Restore</button>
                <button className={styles.deleteBtn}>Delete</button>
              </td>
            </tr>
            <tr>
              <td>#R1988</td>
              <td>Economy Twin</td>
              <td>Economy</td>
              <td>12</td>
              <td>$75</td>
              <td><span className={`${styles.statusBadge} ${styles.archived}`}>Archived</span></td>
              <td>
                <button className={styles.restoreBtn}>Restore</button>
                <button className={styles.deleteBtn}>Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};