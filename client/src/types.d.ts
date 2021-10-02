export type User = {
  _id: string
  email: string
  name?: string
  isAdmin: boolean
  __v: number
}

export type ValidationError = {
  field: string
  error: string
}
