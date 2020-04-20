module.exports = (req, res, next) => {
  try {
    const { host, port } = req.body;
    agents.register({ host, port });
    res.code(200);
  } catch (e) {
    next(e);
  }
};
