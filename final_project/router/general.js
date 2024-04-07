const express = require('express');
const axios = require('axios');
const public_users = express.Router();

// Función para obtener la lista de libros disponibles en la tienda utilizando async-await con Axios
async function getBookList() {
  try {
    const response = await axios.get('https://davidtorresi-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
    return response.data.books;
  } catch (error) {
    throw error;
  }
}

// Función para obtener los detalles del libro basados en el ISBN utilizando async-await con Axios
async function getBookDetailsByISBN(isbn) {
  try {
    const response = await axios.get(`https://davidtorresi-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`);
    return response.data.book;
  } catch (error) {
    throw error;
  }
}

// Función para obtener los detalles del libro basados en el Autor utilizando async-await con Axios
async function getBookDetailsByAuthor(author) {
  try {
    const response = await axios.get(`https://davidtorresi-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`);
    return response.data.books;
  } catch (error) {
    throw error;
  }
}

// Función para obtener los detalles del libro basados en el Título utilizando async-await con Axios
async function getBookDetailsByTitle(title) {
  try {
    const response = await axios.get(`https://davidtorresi-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`);
    return response.data.books;
  } catch (error) {
    throw error;
  }
}

// Ruta para registrar un nuevo usuario
public_users.post("/register", (req, res) => {
  // Implementa la lógica de registro de usuario aquí
});

// Ruta para obtener la lista de libros disponibles en la tienda utilizando async-await con Axios
public_users.get('/', async (req, res) => {
  try {
    const bookList = await getBookList();
    return res.status(200).json({ books: bookList });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Ruta para obtener los detalles del libro basados en el ISBN utilizando async-await con Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const bookDetails = await getBookDetailsByISBN(isbn);
    return res.status(200).json({ book: bookDetails });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Book not found." });
    } else {
      return res.status(500).json({ message: "Internal server error." });
    }
  }
});

// Ruta para obtener los detalles del libro basados en el Autor utilizando async-await con Axios
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
    const bookDetails = await getBookDetailsByAuthor(author);
    return res.status(200).json({ books: bookDetails });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Ruta para obtener los detalles del libro basados en el Título utilizando async-await con Axios
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const bookDetails = await getBookDetailsByTitle(title);
    return res.status(200).json({ books: bookDetails });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Ruta para obtener las reseñas de un libro
public_users.get('/review/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`https://davidtorresi-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/review/${isbn}`);
    return res.status(200).json({ reviews: response.data.reviews });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "No reviews found for this book." });
    } else {
      return res.status(500).json({ message: "Internal server error." });
    }
  }
});

module.exports.general = public_users;
