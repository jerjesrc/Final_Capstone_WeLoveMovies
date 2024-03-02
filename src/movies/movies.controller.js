const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  // TODO: Add your code here.
  if (request.originalUrl === "/theaters" || request.originalUrl === '/reviews') {
    next();
  } else {
  try {
    const { movieId } = request.params;
      const movie = await service.read(movieId);
      if (!movie) {
        response.status(404).json({error: "Movie cannot be found."});
        return next({ status: 404, message: "Movie cannot be found." });
      }
      // Attach the movie object to the res.locals for later use in the route handlers
      response.locals.movie = movie;
      next();
    } catch (error) {
      next(error);
    }
  }
}

async function read(request, response) {
  // TODO: Add your code here
  response.json({ data: response.locals.movie });
}

async function list(request, response) {
  // TODO: Add your code here.
  response.json({ data : await service.list(request.query.is_showing) });
}

async function create(req, res) {
  // your solution here
}

async function update(request, response) {
  // TODO: Write your code here

}

async function criticDataByMovie(request, response) {
  // TODO: Write your code here
  response.status(404).json({data: `${request.method} not allowed for ${request.originalUrl}`});
}

async function destroy(req, res) {
  // your solution here
  await service.delete(res.locals.post.post_id);
  res.sendStatus(204);
}

async function theatersShowingMovie(req, res, next) {
  const { movieId } = req.params; //getting movie id
  const data = await service.theatersShowingMovie(movieId); // getting all theaters that show the specfic movie
  if (Object.keys(data).length === 0) {
    // checking if onbject is empty
    return next({ status: 404, message: `${movieId} is not a valid movie id` }); //return not found
  }
  res.json({ data }); //sending data
}

async function reviewDataByMovie(req, res, next) {
  const { movieId } = req.params; // getting movie id
  const data = await service.reviewDataByMovie(movieId); //geting review data by movie id
  if (Object.keys(data).length === 0) {
    //checking if object is empty
    return next({ status: 404, message: `${movieId} is not a valid movie id` }); //sending not found
  }
  //remaping data to requested specs
  const cleanedData = data.map((item) => ({
    review_id: item.review_id,
    content: item.content,
    score: item.score,
    created_at: item.r_created,
    updated_at: item.r_updated,
    critic_id: item.critic_id,
    movie_id: item.movie_id,
    critic: {
      critic_id: item.critic_id,
      preferred_name: item.preferred_name,
      surname: item.surname,
      organization_name: item.organization_name,
      created_at: item.c_created,
      updated_at: item.c_updated,
    },
  }));
  res.json({ data: cleanedData }); // sending data to client
}

module.exports = {
  movieExists,
  list: [asyncErrorBoundary(list)],
  read: [movieExists, read],
  theatersShowingMovie: asyncErrorBoundary(theatersShowingMovie),
  reviewDataByMovie: asyncErrorBoundary(reviewDataByMovie),
  criticDataByMovie: asyncErrorBoundary(criticDataByMovie),
};