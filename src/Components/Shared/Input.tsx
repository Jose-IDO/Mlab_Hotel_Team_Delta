import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

interface Props {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  error?: string;
  name?: string;
}

const Input: React.FC<Props> = ({
  label,
  placeholder,
  type = 'text',
  value = '',
  onChange,
  error,
  name,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const iconColor = showPassword ? styles.iconVisible : styles.iconHidden;

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputContainer}>
        <input
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          type={inputType}
          placeholder={placeholder}
          className={styles.input}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={`${styles.eyeButton} ${iconColor}`}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className={styles.eyeIcon} />
            ) : (
              <Eye className={styles.eyeIcon} />
            )}
          </button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Input;

