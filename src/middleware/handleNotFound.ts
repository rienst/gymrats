const handleNotFound = (request, response, next) => {
  response.status(404)
  return response.json({ error: 'That route does not exist' })
}

export default handleNotFound
