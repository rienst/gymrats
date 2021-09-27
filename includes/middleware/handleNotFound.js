const handleNotFound = (request, response, next) => {
  response.status(404)
  return response.send('That route does not exist')
}

module.exports = handleNotFound
