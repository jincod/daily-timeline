import express from 'express';
import clientWrapper from './client-wrapper'

let app = express();
let apiRouter = express.Router();

app.set('view engine', 'html');
app.set('layout', 'layout');
app.engine('html', require('hogan-express'));
app.use(express.static("public"));

app.get('/', (req, res) => {
  if (!req.query.token || !req.query.guid) {
    return res.sendStatus(404);
  }
  
  clientWrapper(req.query.token, req.query.guid, (err, notes) => {
    if (err) {
      return res.sendStatus(500);
    }
    res.render('index', {items: notes});
  });
});

app.listen(process.env.PORT || 3000);

module.exports = app