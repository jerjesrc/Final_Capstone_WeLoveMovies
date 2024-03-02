/**
 * Express API "Not found" handler.
 */
function notFound(request, response, next) {
  response.status(404).json({error: `Path not found: ${request.originalUrl}`});
}

module.exports = notFound;