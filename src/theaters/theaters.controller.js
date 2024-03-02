const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function theaterExists(req, res, next) {
  const { theaterId } = req.params;
  const theater = await service.read(theatertId);
  if (theater) {
    res.locals.theater = theater;
    return next();
  }
  return next({ status: 404, message: `Theater cannot be found.` });
}

async function create(req, res) {
  // your solution here
  const newTheater = ({
    post_id,
    post_title,
    post_body,
    created_at,
    updated_at
  } = req.body.data);
  const createdPost = await service.create(newPost);
  res.status(201).json({ data: createdPost });
}

async function update(request, response) {
  // TODO: Write your code here

}

async function list(request, response) {
  // TODO: Add your code here
  response.json({ data : await service.list()});
}

async function destroy(req, res) {
  // your solution here
  await service.delete(res.locals.post.post_id);
  res.sendStatus(204);
}

module.exports = {
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
  delete: [asyncErrorBoundary(theaterExists), asyncErrorBoundary(destroy)],
  update: [
    asyncErrorBoundary(theaterExists),
    asyncErrorBoundary(update),
  ],
};