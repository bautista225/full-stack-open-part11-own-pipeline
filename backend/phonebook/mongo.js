require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 2) {
    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    newPerson.save().then(person => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}
else {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => console.log(`${person.name} ${person.number}`))
        mongoose.connection.close()
    })
}
