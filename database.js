const Pool = require('pg').Pool
const dotenv = require('dotenv').config()
const sleep = require('./sleep/sleeplog')
const {callback} = require('pg/lib/native/query');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432
})

console.log('DB pool initialised...')

const getProducts = (request, response) => {
  console.log('Attempting to /GET products')
  pool.query('SELECT * FROM PRODUCTS ORDER BY id ASC LIMIT 3', (error, results) => {
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
    console.log('Successfully Added products with ID & NAME ', id, ':', name)
    response.status(201).send('/POST Completed')
  })
}

const logSleep = (request, response) => {
  console.log('Request to log...')
  const { date, bed_time, sleep_time, awake_time, quality, tags} = request.body

  //Awaits until calculation is complete before adding it into the database
  sleep.log(date, awake_time, sleep_time, quality,(duration, grade, tags_array) => {
    pool.query('INSERT INTO myrecords VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [date, bed_time, sleep_time, awake_time, duration, parseInt(quality.slice(0)), grade, tags.split(',')], (error, results) => {
      if (error) {
        console.log('Error:', error.message)
        response.status(400).send('Unable to create a new entry')
        return
      }
      console.log('Successfully logged sleep for the night on the ', date)
      response.status(201).json({duration: duration,grade: grade, tags: tags.split(',')})
    })
  })
}

module.exports = {
  getProducts,
  logSleep,
  createProduct
}