const express = require('express')
const db = require('./database')
const bodyParser = require('body-parser')
const app = express();
const port = 3000;

/****/
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
  console.log('Visited / home page')})

app.get('/products', db.getProducts)
app.post('/createproduct', db.createProduct)


app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}.`)
})