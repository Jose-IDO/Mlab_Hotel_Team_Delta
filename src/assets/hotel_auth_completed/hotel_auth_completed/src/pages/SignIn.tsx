import React from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import GoogleButton from '../components/GoogleButton'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { updateField, setError, setLoading } from '../store/authSlice'
import { isEmail } from '../utils/validation'
import { Link } from 'react-router-dom'

const SignIn: React.FC = () => {
  const auth = useSelector((s: RootState) => s.auth)
  const dispatch = useDispatch<AppDispatch>()

  const validate = () => {
    let ok = true
    if (!isEmail(auth.email)) { dispatch(setError({ field: 'email', message: 'Invalid email' })); ok=false }
    if (!auth.password) { dispatch(setError({ field: 'password', message: 'Password required' })); ok=false }
    return ok
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    dispatch(setLoading(true))
    setTimeout(()=>{
      dispatch(setLoading(false))
      alert('Mock sign-in successful — integrate backend to authenticate.')
    },600)
  }

  return (
    <div className='min-h-screen grid grid-cols-1 md:grid-cols-2'>
      <div className='hidden md:block left-bg'>
        <div className='left-overlay h-full flex items-center'>
          <div className='max-w-lg text-white p-12 pl-20'>
            <h1 className='text-4xl font-semibold mb-4'>Welcome Back</h1>
            <p className='opacity-90'>Sign in to continue your booking and manage reservations.</p>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center bg-white py-12 px-6'>
        <div className='w-full max-w-md card-bg p-8'>
          <h2 className='text-2xl font-semibold mb-6 text-center'>Sign In</h2>
          <form onSubmit={submit}>
            <Input label='E-mail' placeholder='example32@gmail.com' value={auth.email} onChange={(v)=>dispatch(updateField({ field:'email', value:v }))} error={auth.errors.email} name='email' />
            <Input label='Password' type='password' placeholder='••••••••' value={auth.password} onChange={(v)=>dispatch(updateField({ field:'password', value:v }))} error={auth.errors.password} name='password' />
            <div className='mt-6'>
              <Button text={auth.loading ? 'Signing in...' : 'Sign In'} type='submit' disabled={auth.loading} />
            </div>
          </form>

          <div className='mt-4 text-center text-gray-500'>Don't have an account? <Link to='/signup' className='text-rose-500 font-medium'>Sign up</Link></div>

          <div className='my-4 text-center text-gray-400'>Or</div>
          <GoogleButton onClick={()=>alert('Mock Google Sign-in')} />
        </div>
      </div>
    </div>
  )
}

export default SignIn
