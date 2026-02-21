const exposeFlash = (req, res, next) => {
  const messages = req.session.messages || [];
  res.locals.messages = messages;
  if (messages.length) {
    req.session.messages = [];
  }
  res.locals.currentUser = req.session.user || null;
  res.locals.currentAdmin = req.session.admin || null;
  next();
};

const addFlash = (req, type, text) => {
  req.session.messages = req.session.messages || [];
  req.session.messages.push({ type, text });
};

module.exports = {
  exposeFlash,
  addFlash
};
