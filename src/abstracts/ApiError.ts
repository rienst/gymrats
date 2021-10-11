export default class ApiError extends Error {
  statusCode: number
  sendToClient: boolean

  constructor(
    message: string,
    statusCode: number,
    sendToClient: boolean = true
  ) {
    super(message)

    this.statusCode = statusCode
    this.sendToClient = sendToClient
  }
}
