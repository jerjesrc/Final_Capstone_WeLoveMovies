const express = require("express");
const router = express.Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const notFound = require("../errors/notFound");

const reviewsRouter = require("../reviews/reviews.router");
const theatersRouter = require("../theaters/theaters.router");

// TODO: Add your routes here
router.route("/").get(controller.list).all(methodNotAllowed);

// Delegate handling of /theaters routes to theatersRouter
router.use('/:movieId/theaters', theatersRouter);
router.use('/:movieId/reviews', reviewsRouter);

router.route('/:movieId/critics').all(notFound);

router
  .route("/:movieId")
  .get(controller.read)
  .all(methodNotAllowed);

module.exports = router;