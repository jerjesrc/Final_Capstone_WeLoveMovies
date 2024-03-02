if (process.env.USER) require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();
const notFound = require("./errors/notFound");
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");

// TODO: Add your code here
app.use(cors());
app.use(express.json());

app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);

// not found
app.use(notFound);

module.exports = app;
