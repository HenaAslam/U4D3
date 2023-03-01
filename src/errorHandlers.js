export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400) {
    res
      .status(400)
      .send({ message: err.message, list: err.errorsList.map((e) => e.msg) });
  } else {
    next(err);
  }
};
export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ message: err.message });
  } else {
    next(err);
  }
};