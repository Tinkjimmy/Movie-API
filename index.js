const express = require('express'),
      morgan = require('morgan');
 


const app = express();



app.use(morgan('common'));
app.use('/public', express.static('documentation.html'));

// GET requests
app.get('/movies', (req, res) => {
  res.json(Top10movies);
});

app.get('/', (req, res) => {                  
  res.send('This is my movie api');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});