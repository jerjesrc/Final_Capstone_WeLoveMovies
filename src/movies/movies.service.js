const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movieId) {
  // TODO: Add your code here
  try {
    return db("movies")
      .select("*")
      .where({ "movie_id": movieId })
      .first();
  } catch (error) {
    throw error;
  }
}

async function create(movie) {
  //your solution here
  return db("movies")
    .insert(movie)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function theatersShowingMovie(movieId) {
  return db("movies as m") //from movies
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id") //connecting movies-theater
    .join("theaters as t", "mt.theater_id", "t.theater_id") //joining theater table
    .select("t.*", "mt.is_showing", "m.movie_id") //getting specific columns
    .where({ "m.movie_id": movieId }); //filter by movieId
}

function criticDataByMovie(movieId) {
  return db("movies as m") //form movies
    .join("reviews as r", "m.movie_id", "r.movie_id") // join reviews table
    .join("critics as c", "r.critic_id", "c.critic_id") // join critics table
    .select(
      //select all columns
      "c.*",
      "r.*",
      "r.created_at as r_created",
      "c.created_at as c_created",
      "r.updated_at as r_updated",
      "c.updated_at as c_updated"
    )
    .where({ "m.movie_id": movieId }); //filter by movie id
}

module.exports = {
  list,
  read,
  create,
  theatersShowingMovie,
  criticDataByMovie,
};