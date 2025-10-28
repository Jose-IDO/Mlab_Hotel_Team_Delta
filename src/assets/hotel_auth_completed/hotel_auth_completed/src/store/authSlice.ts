import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  confirm: string;
  errors: Record<string,string>;
  loading: boolean;
}

const initialState: AuthState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  confirm: '',
  errors: {},
  loading: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateField(state, action: PayloadAction<{ field: keyof AuthState; value: string }>) {
      const { field, value } = action.payload
      (state as any)[field] = value
      state.errors[field as string] = ''
    },
    setError(state, action: PayloadAction<{ field: string; message: string }>) {
      state.errors[action.payload.field] = action.payload.message
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    reset(state) {
      state.email = ''
      state.password = ''
      state.firstName = ''
      state.lastName = ''
      state.phone = ''
      state.confirm = ''
      state.errors = {}
      state.loading = false
    }
  }
})

export const { updateField, setError, setLoading, reset } = authSlice.actions
export default authSlice.reducer
