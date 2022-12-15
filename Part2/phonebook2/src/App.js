import { useState, useEffect, useSyncExternalStore} from 'react'
import axios from 'axios'

const PhonebookEntry = ({person}) => {
  return(
    <>
      <tr>
        <td>{person.name}</td>
        <td>{person.number}</td>
      </tr>
    </>
  )
}

const Filter = ({filterstring, filterChangefunc}) => {
  return (
    <>
      <h2>Filter contacts by name</h2>
        <div>
          filter: <input value={filterstring} onChange={filterChangefunc}/>
        </div>
    </>
  )
}

const PersonForm = ({addContact, newName, handleNameChange, newNum, handleNumChange}) => {
  return(
    <div>
      <h2>Add a new contact</h2>
      <form onSubmit={addContact} >
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNum} onChange={handleNumChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNum, setNum] = useState('')
  const [filterString, setFilter] = useState('')

  const filteredPersons = filterString === '' ? persons : persons.filter(p => p.name.toLowerCase().includes(filterString.toLowerCase()))

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/db')
      .then(response => {
        console.log(response.data)
        setPersons(response.data.persons)
      })
  }, [])

  console.log('book has', persons.length, 'entries')

  const addContact = (event) => {
    event.preventDefault()

    if (newName === ""){
      window.alert("Name must not be empty!")
      return
    }
    let abort = false
    persons.forEach((p => {
      if (p.name === newName)
        abort = true
      }))
    if (abort) {
      window.alert(`${newName} is already added to phonebook`)
      return
    }
    const new_val = {name: newName, number: newNum, id: persons.length+1}
    setPersons(persons.concat(new_val))
    console.log("contact added")
    setNewName('') 
    setNum('')
  }
  
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumChange = (event) => {
    console.log(event.target.value)
    setNum(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filterstring={filterString} filterChangefunc={handleFilterChange} />
      <PersonForm addContact={addContact} newName={newName} handleNameChange={handleNameChange} newNum={newNum} handleNumChange={handleNumChange} />
      <h2>Contact List</h2>
      <table>
        <tbody>
        {filteredPersons.map(p => <PhonebookEntry person={p} key={p.id}/>)}
        </tbody>
      </table>
    </div>
  )
}

export default App