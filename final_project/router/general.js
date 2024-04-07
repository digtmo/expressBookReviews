const express = require('express');
const axios = require('axios');
const public_users = express.Router();

// Registro de usuario
public_users.post("/register", (req, res) => {
  console.log(req.body)
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required." });
  }
  if (users.hasOwnProperty(username)) {
    return res.status(400).json({ message: "Username already exists." });
  }
  users[username] = password;
  return res.status(200).json({ message: "User registered successfully." });
});

// Obtener la lista de libros disponibles en la tienda
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:3000');
    return res.status(200).json({ books: response.data });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book list." });
  }
});

// Obtener detalles del libro basado en ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`http://localhost:3000/isbn/${isbn}`);
    return res.status(200).json({ book: response.data });
  } catch (error) {
    return res.status(404).json({ message: "Book not found." });
  }
});

// Obtener detalles del libro basado en el autor
public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params;
  try {
    const response = await axios.get(`http://localhost:3000/author/${author}`);
    return res.status(200).json({ books: response.data });
  } catch (error) {
    return res.status(404).json({ message: `Books by ${author} not found.` });
  }
});

// Obtener todos los libros basados en el título
public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params;
  try {
    const response = await axios.get(`http://localhost:3000/title/${title}`);
    return res.status(200).json({ books: response.data });
  } catch (error) {
    return res.status(404).json({ message: `Books with title ${title} not found.` });
  }
});

// Obtener reseña del libro
public_users.get('/review/:isbn', async function (req, res) {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`http://localhost:3000/review/${isbn}`);
    return res.status(200).json({ reviews: response.data });
  } catch (error) {
    return res.status(404).json({ message: "No reviews found for this book." });
  }
});

module.exports.general = public_users;
