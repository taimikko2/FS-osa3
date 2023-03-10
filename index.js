require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

var morgan = require('morgan')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('reqx', function (req) {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :reqx')
)

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((p) => {
      console.log('P', JSON.stringify(p))
      res.json(p)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  const id = req.params.id
  console.log(
    'PUT /api/persons/id ',
    JSON.stringify(req.params),
    JSON.stringify(req.body)
  )

  Person.findByIdAndUpdate(
    id,
    { number, name },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((person) => {
      console.log('put then', JSON.stringify(person))
      res.json(person)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  console.log('POST ',body)
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((res) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.get('/info', (req, res, next) => {
  const time = new Date()
  Person.find({})
    .then((p) => {
      res.send(`<div>phonebook has info for ${p.length} people</div>
    <div>${time}</div>`)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint) // lopussa, mutta ennen errorHandler:ia (kakki loput osuu t??h??n)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler) // unknownEndpointin j??lkeen
const PORT = process.env.PORT // process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// https://fs-osa3.onrender.com
