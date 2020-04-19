module.exports = (req, res, next) => {
  try {
    const { host, port, status } = req.body;
    agents.register({ host, port, status });
    res.code(200);
  } catch (e) {
    next(e);
  }
};
