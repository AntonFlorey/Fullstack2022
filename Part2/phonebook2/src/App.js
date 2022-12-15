import { useState, useEffect, useSyncExternalStore} from 'react'
import axios from 'axios'
import {GetServerData, UpdateServerData, DeleteServerData, PutServerData} from "./components/BackendCommunication"
import "./index.css"

const Notification = ({ message, className}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const PhonebookEntry = ({person, delFun}) => {
  const onButton = () => {
    delFun(person.id, person.name) 
  }
  return(
    <>
      <tr>
        <td>{person.name}</td>
        <td>{person.number}</td>
        <td><button onClick={onButton}>delete</button></td>
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
  const [message, setMessage] = useState([null, "message"])

  const filteredPersons = filterString === '' ? persons : persons.filter(p => p.name.toLowerCase().includes(filterString.toLowerCase()))

  const showNotification = (msg) => {
    setMessage(msg)
    setTimeout(() => {
      setMessage([null, "message"])
    }, 5000)
  }

  useEffect(() => {
    console.log('effect')
    GetServerData('http://localhost:3001/persons', r => {setPersons(r.data)})
  }, [])

  const addContact = (event) => {
    event.preventDefault()
    if (newName === ""){
      window.alert("Name must not be empty!")
      return
    }
    const data = {name: newName, number: newNum}
    let abort = false
    persons.forEach((p => {
      if (p.name === newName){
        console.log("name already existing")
        if (window.confirm("Replace existing number?")){
          PutServerData("http://localhost:3001/persons/" + String(p.id), data, rsp => {
          showNotification([`Successfully changed ${data.name}'s number to ${data.number}`, "message"])
          setNewName('') 
          setNum('')
          GetServerData('http://localhost:3001/persons', r => {setPersons(r.data)})
        }, error => {
          showNotification([`Could not change ${data.name}'s number!`, "error"])
        })
        }
        abort = true
      }
    }))
    if (abort) {return}
    UpdateServerData("http://localhost:3001/persons", data, r => {
      setPersons(persons.concat(r.data))
      showNotification([`Successfully added ${data.name}`, "message"])
      setNewName('') 
      setNum('')
    }, error => {
      showNotification([`Could not add ${data.name}'s number!`, "error"])
    })
  }
  
  const deleteContact = (id, name) => {
    DeleteServerData("http://localhost:3001/persons/", id, 
    r => {
      setPersons(persons.filter(p => {return (p.id !== id)}))
      showNotification([name + " is no more", "message"])
    }, `Make ${name} no more?`,
    error => {
      showNotification(["An error occured while deleting " + name, "error"])
    })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumChange = (event) => {
    setNum(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message[0]} className={message[1]} />
      <Filter filterstring={filterString} filterChangefunc={handleFilterChange} />
      <PersonForm addContact={addContact} newName={newName} handleNameChange={handleNameChange} newNum={newNum} handleNumChange={handleNumChange} />
      <h2>Contact List</h2>
      <table>
        <tbody>
        {filteredPersons.map(p => <PhonebookEntry person={p} key={p.id} delFun={deleteContact} />)}
        </tbody>
      </table>
    </div>
  )
}

export default App