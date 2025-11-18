import React, { useState } from 'react';
import { usePopia } from '../../contexts/PopiaContext';
import PrivacyPolicyOverlay from './PrivacyPolicyOverlay';
import ReadMoreOverlay from './ReadMoreOverlay';
import styles from './PopiaOverlay.module.css';

const PopiaOverlay: React.FC = () => {
  const { showOverlay, acceptConsent, declineConsent } = usePopia();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  if (!showOverlay) return null;

  const handleAccept = () => {
    acceptConsent();
  };

  const handleDecline = () => {
    declineConsent();
  };

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Privacy Notice</h2>
            <p className={styles.subtitle}>Protection of Personal Information Act (POPIA)</p>
          </div>

          <div className={styles.body}>
            <p className={styles.text}>
              We respect your privacy and are committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA) of South Africa.
            </p>
            <p className={styles.text}>
              By using our website, you consent to the collection, use, and processing of your personal information as described in our{' '}
              <button
                className={styles.linkButton}
                onClick={() => setShowPrivacyPolicy(true)}
                type="button"
              >
                Privacy Policy
              </button>
              . We use cookies and similar technologies to enhance your experience, analyze site usage, and assist in our marketing efforts.
            </p>
            <p className={styles.text}>
              <button
                className={styles.linkButton}
                onClick={() => setShowReadMore(true)}
                type="button"
              >
                Read More
              </button>
              {' '}about how we collect, use, and protect your information.
            </p>
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.button} ${styles.declineButton}`}
              onClick={handleDecline}
              type="button"
            >
              Decline
            </button>
            <button
              className={`${styles.button} ${styles.acceptButton}`}
              onClick={handleAccept}
              type="button"
            >
              Accept
            </button>
          </div>
        </div>
      </div>

      {showPrivacyPolicy && (
        <PrivacyPolicyOverlay onClose={() => setShowPrivacyPolicy(false)} />
      )}

      {showReadMore && (
        <ReadMoreOverlay onClose={() => setShowReadMore(false)} />
      )}
    </>
  );
};

export default PopiaOverlay;

