const db = require("../db/connection");

const tableName = "reviews";

async function destroy(reviewId) {
  // TODO: Write your code here
  return db(tableName).where({ "review_id": reviewId }).del();
}

async function list(movie_id) {
  // TODO: Write your code here
  
}

async function read(reviewId) {
  // TODO: Write your code here
  return db(tableName)
    .select("*")
    .where({ review_id: reviewId }).first();
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

async function create(review) {
  //your solution here
  return db(tableName)
    .insert(review)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function readReviews(movieId) {
	return db(tableName)
		.select("*")
		.where({ movie_id: movieId });
}

module.exports = {
  destroy,
  list,
  read,
  update,
  create,
  readReviews,
  readCritic,
};