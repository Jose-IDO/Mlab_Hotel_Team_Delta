import React, { useState } from "react";
import styles from "./ManageAccom.module.css";

export const ManageAccom: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    roomType: "",
    numberOfRooms: "",
    price: "",
    starRating: "",
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
    console.log("Form data:", formData);
    // Add your submission logic here
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      name: "",
      address: "",
      roomType: "",
      numberOfRooms: "",
      price: "",
      starRating: "",
      amenities: [],
      photos: []
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1 className={styles.title}>Manage Accommodations</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>+ Add New</button>
      </div>

      {/* Overlay Form */}
      {showForm && (
        <div className={styles.overlay}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Add New Accommodation</h2>
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

              {/* Name */}
              <div className={styles.formGroup}>
                <label>Accommodation Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Ocean View Suite"
                />
              </div>

              {/* Address */}
              <div className={styles.formGroup}>
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>

              {/* Room Type */}
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
                </select>
              </div>

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
                  placeholder="e.g., 10"
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
                  placeholder="e.g., 220.00"
                />
              </div>

              {/* Star Rating */}
              <div className={styles.formGroup}>
                <label>Star Rating *</label>
                <select
                  name="starRating"
                  value={formData.starRating}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Rating</option>
                  <option value="1">⭐ 1 Star</option>
                  <option value="2">⭐⭐ 2 Stars</option>
                  <option value="3">⭐⭐⭐ 3 Stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
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
                  Add Accommodation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Published Accommodations */}
      <section className={styles.section}>
        <h3 className={styles.subtitle}>Published</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Accommodation ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rooms</th>
              <th>Price/Night</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#A2001</td>
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
              <td>#A2002</td>
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

      {/* Archived Accommodations */}
      <section className={styles.section}>
        <h3 className={styles.subtitle}>Archived</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Accommodation ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rooms</th>
              <th>Price/Night</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#A1991</td>
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
              <td>#A1988</td>
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