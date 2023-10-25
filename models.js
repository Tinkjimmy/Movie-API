const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: String,
    Death: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  // Birth: Date,

  // delete if  not working
  Birth: {
    type: Date,
    get: (date) => {
      // Customize the date format when it is retrieved from the database
      return formatDateToDesiredString(date);
    },
    set: (date) => {
      // Customize the date format before it is stored in the database
      return parseDateFromDesiredString(date);
    },
    required: true,
  },
  //
  Favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

//////////

function formatDateToDesiredString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1 and pad with '0'
  const day = String(date.getDate()).padStart(2, "0");

  // Format the date as "yyyy/mm/dd"
  return `${year}/${month}/${day}`;
}
// Define a function to parse the date format before storing in the database
function parseDateFromDesiredString(dateString) {
  // Split the date string into parts using "/"
  const dateParts = dateString.split("/");

  // Ensure there are three parts (year, month, day)
  if (dateParts.length === 3) {
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Subtract 1 to get the correct month (zero-based)
    const day = parseInt(dateParts[2], 10);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      // Create a new Date object with the parsed year, month, and day
      return new Date(year, month, day);
    }
  }

  // If parsing fails, return null or an appropriate fallback value
  return null;
}

//////////////////////////

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
