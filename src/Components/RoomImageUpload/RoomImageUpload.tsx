import React, { useState } from 'react';
import styles from './RoomImageUpload.module.css';

const API_URL = (import.meta as any).env.VITE_API_URL as string;

interface Props {
  roomId: string;
  currentImages: string[];
  onUploadSuccess: () => void;
}

export const RoomImageUpload: React.FC<Props> = ({ roomId, currentImages, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file count
    if (files.length > 10) {
      setError('Maximum 10 images allowed per upload');
      return;
    }

    // Validate total images
    if (currentImages.length + files.length > 20) {
      setError(`Room can have maximum 20 images. Currently: ${currentImages.length}`);
      return;
    }

    // Validate file types and sizes
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      if (files[i].size > 10 * 1024 * 1024) {
        setError(`File "${files[i].name}" is too large. Maximum size is 10MB`);
        return;
      }
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('hotel_token');
      
      // Simulate progress (Cloudinary uploads don't provide real-time progress easily)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(`${API_URL}/admin/rooms/${roomId}/images`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Reset input and refresh room data
      e.target.value = '';
      setTimeout(() => {
        setUploadProgress(0);
        onUploadSuccess();
      }, 500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const token = localStorage.getItem('hotel_token');
      const response = await fetch(`${API_URL}/admin/rooms/${roomId}/images`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Delete failed');
      }

      onUploadSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Room Images</h3>
        <span className={styles.imageCount}>
          {currentImages.length} / 20 images
        </span>
      </div>

      {error && (
        <div className={styles.error}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className={styles.closeError}>×</button>
        </div>
      )}

      {currentImages.length === 0 && (
        <div className={styles.emptyState}>
          <p>No images uploaded yet</p>
          <p className={styles.hint}>Upload high-quality images to showcase this room</p>
        </div>
      )}

      {currentImages.length > 0 && (
        <div className={styles.imageGrid}>
          {currentImages.map((img, idx) => (
            <div key={idx} className={styles.imageCard}>
              <img src={img} alt={`Room ${idx + 1}`} loading="lazy" />
              <button
                className={styles.deleteBtn}
                onClick={() => handleDeleteImage(img)}
                title="Delete image"
                disabled={uploading}
              >
                ×
              </button>
              {idx === 0 && <span className={styles.primaryBadge}>Primary</span>}
            </div>
          ))}
        </div>
      )}

      <div className={styles.uploadSection}>
        <label className={`${styles.uploadBtn} ${uploading ? styles.uploading : ''}`}>
          {uploading ? (
            <span>
              Uploading... {uploadProgress}%
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </span>
          ) : (
            <span>Upload Images</span>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading || currentImages.length >= 20}
            style={{ display: 'none' }}
          />
        </label>
        <p className={styles.hint}>
          Max 10 images per upload • 10MB each • JPEG, PNG, WEBP, GIF
        </p>
      </div>
    </div>
  );
};
