import React from 'react'

const Button: React.FC<{ text: string; onClick?: ()=>void; disabled?: boolean; type?: 'button'|'submit' }> = ({ text, onClick, disabled=false, type='button' }) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`btn-primary w-full ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      {text}
    </button>
  )
}

export default Button
