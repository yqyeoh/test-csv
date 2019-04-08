module.exports = app => {
  app.get('/csv', (req, res) => {
    res.render('index.html');
  });
};
