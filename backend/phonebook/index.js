const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1>Phonebook app</h1>')
})

app.get('/info', (request, response, next) => {
    Person.find({})
        .then(persons => {
            const number_of_persons = persons.length
            response.send(`<p>Phonebook has info for ${number_of_persons} people</p><p>${new Date()}</p>`)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person)
                response.json(person)
            else
                response.status(404).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body || !Object.keys(body).length)
        return response.status(400).json({ error: 'body missing' })

    if (!body.name)
        return response.status(400).json({ error: 'name missing' })

    if (!body.number)
        return response.status(400).json({ error: 'number missing' })

    Person.find({ name: body.name })
        .then(persons => {
            if (persons.length) {
                return response.status(400).json({ error: 'name must be unique' })
            }

            const newPerson = new Person({
                name: body.name,
                number: body.number,
            })

            newPerson.save()
                .then(person => {
                    response.json(person)
                })
                .catch(error => next(error))
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    const person = { name, number }

    Person.findByIdAndUpdate(
        request.params.id,
        person,
        { new: true, runValidators: true }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError')
        return response.status(400).send({ error: 'malformatted id' })

    if (error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})