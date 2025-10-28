import React from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import GoogleButton from '../components/GoogleButton'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { updateField, setError, setLoading, reset } from '../store/authSlice'
import { isEmail, isPhone, isStrongPassword } from '../utils/validation'
import { Link } from 'react-router-dom'

const SignUp: React.FC = () => {
  const auth = useSelector((s: RootState) => s.auth)
  const dispatch = useDispatch<AppDispatch>()

  const validate = () => {
    let ok = true
    if (!auth.firstName.trim()) { dispatch(setError({ field: 'firstName', message: 'First name is required' })); ok=false }
    if (!auth.lastName.trim()) { dispatch(setError({ field: 'lastName', message: 'Last name is required' })); ok=false }
    if (!isEmail(auth.email)) { dispatch(setError({ field: 'email', message: 'Invalid email' })); ok=false }
    if (!isPhone(auth.phone)) { dispatch(setError({ field: 'phone', message: 'Invalid phone' })); ok=false }
    if (!isStrongPassword(auth.password)) { dispatch(setError({ field: 'password', message: 'Password must be 8+ chars, include uppercase & number' })); ok=false }
    if (auth.password !== auth.confirm) { dispatch(setError({ field: 'confirm', message: 'Passwords do not match' })); ok=false }
    return ok
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    dispatch(setLoading(true))
    setTimeout(()=>{
      dispatch(setLoading(false))
      alert('Mock sign-up successful — integrate backend to persist user.')
      dispatch(reset())
    },800)
  }

  return (
    <div className='min-h-screen grid grid-cols-1 md:grid-cols-2'>
      <div className='hidden md:block left-bg'>
        <div className='left-overlay h-full flex items-center'>
          <div className='max-w-lg text-white p-12 pl-20'>
            <h1 className='text-4xl font-semibold mb-4'>Enjoy Your Luxury<br/>Stay With Us.</h1>
            <p className='opacity-90'>Book with comfort and style. Join our community for exclusive offers and fast booking.</p>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center bg-white py-12 px-6'>
        <div className='w-full max-w-md card-bg p-8'>
          <h2 className='text-2xl font-semibold mb-6 text-center'>Sign Up</h2>
          <form onSubmit={submit}>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Input label='First Name' placeholder='ex.Kgopotso' value={auth.firstName} onChange={(v)=>dispatch(updateField({ field:'firstName', value:v }))} error={auth.errors.firstName} name='firstName' />
              <Input label='Last Name' placeholder='ex.Mangena' value={auth.lastName} onChange={(v)=>dispatch(updateField({ field:'lastName', value:v }))} error={auth.errors.lastName} name='lastName' />
            </div>
            <Input label='E-mail' placeholder='example32@gmail.com' value={auth.email} onChange={(v)=>dispatch(updateField({ field:'email', value:v }))} error={auth.errors.email} name='email' />
            <Input label='Contact Number' placeholder='+27831234567' value={auth.phone} onChange={(v)=>dispatch(updateField({ field:'phone', value:v }))} error={auth.errors.phone} name='phone' />
            <Input label='Password' type='password' placeholder='••••••••' value={auth.password} onChange={(v)=>dispatch(updateField({ field:'password', value:v }))} error={auth.errors.password} name='password' />
            <Input label='Confirm Password' type='password' placeholder='••••••••' value={auth.confirm} onChange={(v)=>dispatch(updateField({ field:'confirm', value:v }))} error={auth.errors.confirm} name='confirm' />
            <div className='mt-6'>
              <Button text={auth.loading ? 'Signing up...' : 'Sign Up'} type='submit' disabled={auth.loading} />
            </div>
          </form>

          <div className='mt-4 text-center text-gray-500'>Already Have Account? <Link to='/signin' className='text-rose-500 font-medium'>Log-in</Link></div>

          <div className='my-4 text-center text-gray-400'>Or</div>
          <GoogleButton onClick={()=>alert('Mock Google Sign-up')} />
        </div>
      </div>
    </div>
  )
}

export default SignUp
