const Pool = require('pg').Pool
const dotenv = require('dotenv').config()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432
})

const getProducts = (request, response) => {
  pool.query('SELECT * FROM PRODUCTS ORDER BY id ASC', (error, results) => {
    if (error) {
      console.log(error,results)
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createProduct = (request, response) => {
  const { id, name, desc, size, price, date } = request.body
  pool.query('INSERT INTO products VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [id, name, desc, size, price, date], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Product added with ID: ${results.rows[0].id}`)
  })
}

module.exports = {
  getProducts,
  createProduct
}