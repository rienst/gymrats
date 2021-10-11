import { UserDocument } from './models/User'

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument
    }
  }
}

export interface ValidationErrors {
  [field: string]: string
}
