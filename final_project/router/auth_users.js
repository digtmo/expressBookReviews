const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "david", password: "123momiaes"}];

console.log(users)

const isValid = (username) => {
    // Verificar si el nombre de usuario está presente en la lista de usuarios
    return users.includes(username);
  }
  
  const authenticatedUser = (username, password) => {
    // Verificar si el nombre de usuario y la contraseña coinciden con los registros
    return users.some(user => user.username === username && user.password === password);
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
  const token = jwt.sign({ username: username }, 'fingerprint_customer'); // Puedes cambiar 'secret_key' con tu clave secreta real
  return res.status(200).json({ token: token });
});

// Agregar o modificar una reseña de libro
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'fingerprint_customer'); // Cambia 'secret_key' con tu clave secreta real
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
    const decoded = jwt.verify(token, 'fingerprint_customer'); // Cambia 'secret_key' con tu clave secreta real
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
