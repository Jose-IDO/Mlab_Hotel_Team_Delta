import React, { useState, useRef, useEffect } from 'react';
import styles from './EventImageUpload.module.css';

interface Props {
  currentImage?: string; // existing image URL (for edit)
  onChange: (file: File | null) => void;
}

export const EventImageUpload: React.FC<Props> = ({ currentImage, onChange }) => {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
    // Keep preview in sync if editing event changes
    useEffect(() => {
      if (currentImage && !uploading) {
        setPreview(currentImage);
      } else if (!currentImage && !uploading) {
        // if currentImage removed externally
        setPreview(undefined);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentImage]);
  const [error, setError] = useState<string>('');
  const [uploading, setUploading] = useState(false); // purely UI state for consistency
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // validations
    if (!file.type.startsWith('image/')) {
      setError('Only image files allowed');
      onChange(null);
      return;
    }
    if (file.size > 8 * 1024 * 1024) { // 8MB
      setError('Max size 8MB');
      onChange(null);
      return;
    }
    setError('');
    setPreview(URL.createObjectURL(file));
    onChange(file);
    simulateProgress();
  };

  const simulateProgress = () => {
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 15;
        if (next >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
              setUploading(false);
              setProgress(0);
            }, 500);
          }, 300);
        }
        return next;
      });
    }, 200);
  };

  const handleReplaceClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange(null);
  };

  return (
    <div className={`${styles.container} ${uploading ? styles.uploading : ''}`}>
      <div className={styles.header}>
        <h4 className={styles.title}>Event Image</h4>
      </div>
      {error && (
        <div className={styles.error}>
          <span>⚠️ {error}</span>
          <button className={styles.closeError} onClick={() => setError('')}>×</button>
        </div>
      )}
      {!preview && (
        <label className={styles.imageSlot}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Click to select image<br/><small style={{ fontWeight: 400 }}>JPEG • PNG • WEBP • Max 8MB</small></span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className={styles.input}
            onChange={handleSelect}
          />
        </label>
      )}
      {preview && (
        <div className={styles.preview}>
          <img src={preview} alt="Event" />
          <button type="button" className={styles.removeBtn} onClick={handleRemove} title="Remove image">×</button>
          <button type="button" className={styles.replaceBtn} onClick={handleReplaceClick}>Replace</button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className={styles.input}
            onChange={handleSelect}
          />
        </div>
      )}
      {uploading && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      )}
      <p className={styles.hint}>Only one image per event. Shown across listings.</p>
    </div>
  );
};
