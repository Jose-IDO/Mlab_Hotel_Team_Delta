export const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s)
export const isPhone = (s: string) => /^\+?[0-9]{7,15}$/.test(s)
export const isStrongPassword = (s: string) => s.length >= 8 && /[A-Z]/.test(s) && /\d/.test(s)

