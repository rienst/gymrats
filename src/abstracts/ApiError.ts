export default class ApiError extends Error {
  name: string = 'ApiError'
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)

    this.statusCode = statusCode
  }
}
