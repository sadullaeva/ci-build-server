module.exports = (req, res, next) => {
  try {
    const { host, port } = req.body;
    agents.register({ host, port });
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};
