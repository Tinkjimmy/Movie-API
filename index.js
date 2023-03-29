const express = require('express'),
      morgan = require('morgan');
 


const app = express();

const Top10movies = [
  { title: "The Shawshank Redemption", director: "Frank Darabont" },
  { title: "The Godfather", director: "Francis Ford Coppola" },
  { title: "The Godfather: Part II", director: "Francis Ford Coppola" },
  { title: "The Dark Knight", director: "Christopher Nolan" },
  { title: "12 Angry Men", director: "Sidney Lumet" },
  { title: "Schindler's List", director: "Steven Spielberg" },
  { title: "The Lord of the Rings: The Return of the King", director: "Peter Jackson" },
  { title: "Pulp Fiction", director: "Quentin Tarantino" },
  { title: "The Good, the Bad and the Ugly", director: "Sergio Leone" },
  { title: "Forrest Gump", director: "Robert Zemeckis" }
];


app.use(morgan('common'));
app.use(express.static("public"));

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