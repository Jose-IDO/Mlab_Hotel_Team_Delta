import React, { useState, useEffect } from "react";
import styles from "./ShareModal.module.css";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  roomName?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl, roomName }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleUrlClick = () => {
    handleCopy();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h3 className={styles.modalTitle}>Share {roomName || "Room"}</h3>
        <div className={styles.urlContainer}>
          <input
            type="text"
            value={shareUrl}
            readOnly
            className={styles.urlInput}
            onClick={handleUrlClick}
          />
          <button
            className={styles.copyButton}
            onClick={handleCopy}
            aria-label="Copy link"
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <p className={styles.helpText}>
          Click the URL or the Copy button to copy the link
        </p>
      </div>
    </div>
  );
};

export default ShareModal;


