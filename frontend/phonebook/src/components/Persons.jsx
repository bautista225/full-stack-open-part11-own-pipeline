const Person = ({ person, handleDeletePerson }) => 
    <li>{person.name} {person.number} <button onClick={() => handleDeletePerson(person)}>delete</button></li>

const Persons = ({ persons, newSearch, deletePerson }) => {

    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))

    return (
        <ul>
            {filteredPersons.map(person => (<Person key={person.id} person={person} handleDeletePerson={deletePerson}/>))}
        </ul>
    )
}

export default Persons