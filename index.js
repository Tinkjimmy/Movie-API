//requirements + frameworks
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const app = express()
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const bodyParser = require('body-parser');

//Models

 mongoose.connect('mongodb://localhost:27017/moviesDB', { useNewUrlParser: true, useUnifiedTopology: true });
      
      
app.use(bodyParser.json());





// create user

app.post('/users', (req,res) =>{
                                Users.FindOne({ Username: req.body.Username})
                                .then((user) =>{
                                                  if (user) {
                                                    return res.status(400).send(req.body.Username + "already exist");
                                                  } else {
                                                          Users
                                                            .create({
                                                              Username: req.body.Username,
                                                              Password: req.body.Password,
                                                              Email: req.body.Email,
                                                              Birthday: req.body.Birthday
                                                            })
                                                            .then ((user) =>{res.status(201).json(user) })
                                                            .catch ((error) =>{
                                                              console.error(error);
                                                              res.stastus(500).send("Error: " + error);
                                                            })
                                                           }
                                                })
                                .catch((error) =>{
                                                    console.error(error);
                                                    res.status(500).send("Error: " + error);
                                                });
    
                                });

// Get all users

app.get('/users', (req,res) => {
  Users.find()
            .then((users) =>{
              res.status(201).json(users);

            })
            .catch((err) => {
              console.error(err);
              res.status(500).send('Error: ' + err);
            });
          });


 // Get user by username

 app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
    });
 });

//update  users by username

app.put('/users/:Username', (req,res) => {
  Users.findOneAndUpdate({ Username : req.params.Username},{
    $set:
       {
        Username: req-body.Username,
        Password: req.body.Password,
        Enail: req.body.Email,
        Birthday: req.body.Birthday
       }
  },
  { new: true},
  (err, updatedUser) =>{
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites

app.post('/users/:Username/movies/:MovieID',(req,res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { Favourites: req.params.MovieID}
  
  },
  { new:true},
  (err, updatedUser) => {
    if (err) {
      console.err(err);
      res.status(500).send('Error: ' + err);
    } else{
      res.json(updatedUser);
    }
  });
});


//remove a movie from list of favorites

app.delete('/users/:Username/movies/:MovieID',(req,res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { Favourites: req.params.MovieID}
  
  },
  { new:true},
  (err, updatedUser) => {
    if (err) {
      console.err(err);
      res.status(500).send('Error: ' + err);
    } else{
      res.json(updatedUser);
    }
  });
});


// Delete a user by username

app.delete('/users/:Username', (req,res) => {
  Users.findOneAndRemove({Username: req.params.Username})
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Userna,e + ' was non found');

    } else{
      res.status(200).semd(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: '+ err);
  });
});


 // delete user by id

 app.delete('/users/:id', (req,res) =>{
  Users.findOneAndRemove({_id: req.params.id})
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Userna,e + ' was non found');

    } else{
      res.status(200).semd(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: '+ err);
  });
});



// GET all movies
app.get('/movies', (req, res) => {
  Movies.find()
            .then((movies) =>{
              res.status(201).json(movies);

            })
            .catch((err) => {
              console.error(err);
              res.status(500).send('Error: ' + err);
            });
});


// GET movie by title
app.get('/movies/:movieTitle',(req,res) => {
  Movies.findOne({ Title: req.params.movieTitle })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
    });
});


// get movies by Genre

app.get('/movies/genre/:Genrename', (req,res) =>{
  Movies.findMany({"Genre.Name": req.params.Genrename})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
    });
})



// get genre description by genre name
app.get('/movies/Genre/:GenreName',(req,res) => {
  Movies.findOne({ "Genre.Name": req.params.GenreName })
  .then((movie) => {
    res.json(movie.Genre.Description);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
    });
});



// //Director by name
app.get('/movies/director/:DirectorName',(req,res) => {
  Movies.findOne({ "Director.Name": req.params.DirectorName })
  .then((movie) => {
    res.json(movie.Director.Bio);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
    });
});








app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});