const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(
    (user) =>
      user.username === username &&
      user.password === password
  );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: "Invalid username or password"
    });
  }

  return res.status(200).json({
    message: "Login successful"
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.body.username;

  // Validate input
  if (!username || !review) {
    return res.status(400).json({
      message: "Username and review are required"
    });
  }

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  // Initialize reviews if they do not exist
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    essage: "Review added/updated successfully",
    "reviews":{username:review}
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  // Check if the book has reviews
  if (!books[isbn].reviews ||
      !books[isbn].reviews[username]) {
    return res.status(404).json({
      message: "Review not found"
    });
  }

  // Delete the logged-in customer's review
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully"
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
