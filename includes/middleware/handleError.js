const handleError = (error, request, response, next) => {
  console.error(error)

  // Handle duplicate key error
  if (error.code && error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]

    response.status(409)
    return response.json({ error: `That ${field} is already taken` })
  }

  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map(
      validationError => {
        return {
          field: validationError.path,
          error: validationError.message,
        }
      }
    )

    response.status(400)
    return response.json({
      error: 'There were some issues with your submission',
      validationErrors,
    })
  }

  response.status(500)
  return response.json({ error: 'Something went wrong' })
}

module.exports = handleError
