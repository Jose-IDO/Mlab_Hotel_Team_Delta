import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import styles from './GoogleButton.module.css';

interface GoogleButtonProps {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick }) => {
  return (
    <button 
      type="button"
      onClick={onClick} 
      className={styles.googleButton}
    >
      <FcGoogle size={22} />
      <span className={styles.text}>Continue With Google</span>
    </button>
  );
};

export default GoogleButton;

