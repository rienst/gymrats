const handleError = (error, request, response, next) => {
  console.error(error)

  response.status(500)
  response.send('Something went wrong')
}

module.exports = handleError
