const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //devuelve un booleano
  //escribe el código para verificar si el nombre de usuario es válido
}

const authenticatedUser = (username,password)=>{ //devuelve un booleano
  //escribe el código para verificar si el nombre de usuario y la contraseña coinciden con los que tenemos en registros
}

// solo los usuarios registrados pueden iniciar sesión
regd_users.post("/login", (req,res) => {
  //Escribe tu código aquí
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required." });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }
  const token = jwt.sign({ username: username }, 'secret_key'); // Puedes cambiar 'secret_key' con tu clave secreta real
  return res.status(200).json({ token: token });
});

// Agregar o modificar una reseña de libro
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'secret_key'); // Cambia 'secret_key' con tu clave secreta real
    const username = decoded.username;
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
    if (!books[isbn].reviews[username]) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully." });
    } else {
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review modified successfully." });
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized." });
  }
});


// Eliminar una reseña de libro
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'secret_key'); // Cambia 'secret_key' con tu clave secreta real
    const username = decoded.username;
    if (!books[isbn] || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found." });
    }
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized." });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
