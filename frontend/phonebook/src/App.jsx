import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const handleSearchChange = (event) => setNewSearch(event.target.value)
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const notifyMessage = (message, type='success') => {
    setNotification({message, type})
    setTimeout(() => setNotification(null), 5000)
  }

  const checkPersonExist = (newPerson) => {
    const matchedPersons = persons.filter(person => person.name === newPerson.name)
    return matchedPersons.length != 0
  }

  const addNewPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber,
    }
    
    if (checkPersonExist(newPerson))
      return updatePerson(newPerson)
    
    personsService.create(newPerson).then(createdPerson => {
      setPersons([...persons, createdPerson])
      notifyMessage(`Added ${createdPerson.name}`)
    })
    .catch(error => {
      notifyMessage(`${error.message} - ${error.response?.data.error}`, 'error')
    })

    setNewName('')
    setNewNumber('')
  }

  const updatePerson = (newPerson) => {
    if (!confirm(`${newPerson.name} is alerady added to phonebook, replace the old number with a new one?`))
      return

    const existingPerson = persons.filter(person => person.name === newPerson.name)[0]

    personsService.update(existingPerson.id, newPerson)
    .then(updatedPerson => {
      setPersons(prevPersons => prevPersons.map(person => person.id === updatedPerson.id? updatedPerson : person))
      notifyMessage(`Updated number for ${updatedPerson.name}`)
    })
    .catch(error => {
      if (error.response?.status === 404){        
        setPersons(prevPersons => prevPersons.filter(person => person.id !== existingPerson.id))
        notifyMessage(`Information of ${existingPerson.name} has already been removed from server`, 'error')
      }
      else {
        notifyMessage(`${error.message} - ${error.response?.data.error}`, 'error')
      }
    })

    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (personToDelete) => {
    if (!window.confirm(`Delete ${personToDelete.name} ?`)) return

    personsService.remove(personToDelete.id)
    .then(() => {
      setPersons(persons.filter(person => person.id !== personToDelete.id))
      notifyMessage(`Deleted ${personToDelete.name}`)
    })
    .catch(error => {
      notifyMessage(`${error.message} - ${error.response?.data}`, 'error')
    })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <h3>add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addNewPerson={addNewPerson} />
      <h3>Numbers</h3>
      <Persons persons={persons} newSearch={newSearch} deletePerson={deletePerson} />
    </div>
  )
}

export default App