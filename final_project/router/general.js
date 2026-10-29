const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body || {};

  // Validate username and password
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  // Check if username already exists
  if (isValid(username)) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  // Register the new user
  users.push({ username, password });

  return res.status(201).json({
    message: "User successfully registered"
  });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
//   return res.send(JSON.stringify(books,null,4));
try {
    const bookList = await Promise.resolve(books);
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const book = await Promise.resolve(books[isbn]);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving book details"
    });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;

    const filtered_books = await Promise.resolve(
      Object.values(books).filter((book) => book.author === author)
    );

    return res.status(200).json(filtered_books);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books by author"
    });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  try {
    const title = req.params.title;

    const filtered_books = await Promise.resolve(
      Object.values(books).filter((book) => book.title === title)
    );

    return res.status(200).json(filtered_books);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books by title"
    });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(books[isbn]["reviews"])
});

module.exports.general = public_users;
