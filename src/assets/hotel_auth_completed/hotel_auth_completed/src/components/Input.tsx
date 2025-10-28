import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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

  // Dynamic icon color: rose when visible, gray when hidden
  const iconColor = showPassword ? 'text-rose-500' : 'text-gray-400';

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          type={inputType}
          placeholder={placeholder}
          className={`w-full input-style bg-white pr-10`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${iconColor} hover:text-rose-600 focus:outline-none`}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
