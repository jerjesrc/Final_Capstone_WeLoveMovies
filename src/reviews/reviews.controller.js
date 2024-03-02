const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  // TODO: Write your code here
  const { reviewId } = request.params;
  try {
    const review = await service.read(reviewId);
    if (!review) {
        response.status(404).json({error: "Review cannot be found."});
      return next({ status: 404, error: "Review cannot be found." });
    }
    // Attach the movie object to the res.locals for later use in the route handlers
    response.locals.review = review;
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function destroy(request, response) {
  // TODO: Write your code here
  
  await service.destroy(response.locals.review.review_id);
    response.sendStatus(204).end();
}

async function list(request, response) {
  // TODO: Write your code here

  response.json({  });
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  // TODO: Write your code here
  const updatedReview = {
    ...response.locals.review,
    ...request.body.data,
    review_id: response.locals.review.review_id,
  };
  const data = await service.update(updatedReview);
  
	const review = await service.read(response.locals.review.review_id);

	const reviewToReturn = {
		...review,
		critic: await service.readCritic(response.locals.review.critic_id),
	}

	response.json({ data: reviewToReturn });
}

async function create(req, res) {
  // your solution here
}

async function readReviews(req, res) {
  const { movieId } = req.params;
	const reviews = await service.readReviews(movieId);

	for(let review of reviews) {
		const critic = await service.readCritic(review.critic_id);

		review["critic"] = critic;
	}

	res.json({ data: reviews });
}

module.exports = {
  create: asyncErrorBoundary(create),
  destroy: [reviewExists,
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [reviewExists,
    asyncErrorBoundary(update),
  ],
  readReviews,
};