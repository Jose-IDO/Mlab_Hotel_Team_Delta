import React from 'react'
import { FcGoogle } from 'react-icons/fc'

const GoogleButton: React.FC<{ onClick?: ()=>void }> = ({ onClick }) => {
  return (
    <button onClick={onClick} className='w-full flex items-center gap-3 justify-center py-3 rounded-full border border-gray-200 hover:bg-gray-50'>
      <FcGoogle size={22} />
      <span className='font-medium text-gray-700'>Continue With Google</span>
    </button>
  )
}

export default GoogleButton
