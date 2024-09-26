import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = e => {
    setNewName(e.target.value)
    // e.target.value = ''
  }

  const handleNumberChange = e => {
    setNewNumber(e.target.value)
    // e.target.value = ''
  }

  const handleFilterChange = e => {
    setNewFilter(e.target.value)
  }

  const addPerson = e => {
    e.preventDefault()
    const person = {
      name: newName,
      number: newNumber
    }
    const match = persons.filter(person => person.name === newName)

    if (match.length > 0) {
      if (match[0].name === person.name) {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          personService
            .updateNumber(match[0], person)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id !== match[0].id ? person : returnedPerson))
              setNewName('')
              setNewNumber('')
            })
        }
      }
    } else {
      personService
        .create(person)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}`)) {
      personService
      .deletePerson(person)
      .then(deletedPerson => {
        setPersons(persons
          .toSpliced(
            persons.findIndex(person => person.name === deletedPerson.name),
            1
          )
        )
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={newFilter} changeFilter={handleFilterChange} />
      <h2>Add new</h2>
      <PersonForm name={newName} number={newNumber} changeName={handleNameChange} changeNumber={handleNumberChange} addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={newFilter} deleteFunction={deletePerson} />
    </div>
  )
}

export default App