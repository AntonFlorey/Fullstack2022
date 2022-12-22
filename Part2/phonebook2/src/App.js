import { useState, useEffect, useSyncExternalStore} from 'react'
import {GetServerData, UpdateServerData, DeleteServerData, PutServerData} from "./components/BackendCommunication"
import "./index.css"

const base_url = '/api/persons' //'https://phonebook-balkonsocke.fly.dev/api/persons'

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
        <td><button type="button" onClick={onButton}>delete</button></td>
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

const PersonForm = ({newName, handleNameChange, newNum, handleNumChange}) => {
  return(
    <>
      <tr className='addPersonRow'>
        <td>
          <input value={newName} onChange={handleNameChange} placeholder={"new contact name"} />
        </td>
        <td>
          <input value={newNum} onChange={handleNumChange} placeholder={"new contact number"}/>
        </td>
        <td>
          <button type="submit">add</button>
        </td>
      </tr>
    </>
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
    GetServerData(base_url, r => {setPersons(r.data)})
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
          PutServerData(base_url, p.id, data,
          rsp => {
            showNotification([`Successfully changed ${data.name}'s number to ${data.number}`, "message"])
            setNewName('') 
            setNum('')
            GetServerData(base_url, r => {setPersons(r.data)})
          }, 
          error => {
            console.log(error)
            showNotification([`Could not change ${data.name}'s number! details: ${error.response.data.error}`, "error"])
          })
        }
        abort = true
      }
    }))
    if (abort) {return}
    UpdateServerData(base_url, data, 
    r => {
      setPersons(persons.concat(r.data))
      showNotification([`Successfully added ${data.name}`, "message"])
      setNewName('') 
      setNum('')
    }, 
    error => {
      console.log(error)
      showNotification([`Could not add ${data.name}'s number! \n details: ${error.response.data.error}`, "error"])
    })
  }
  
  const deleteContact = (id, name) => {
    DeleteServerData(base_url, id, 
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
    <div id='container'>
      <h1><span  id='minttu'>minttu</span><span id='pb'>Phonebook</span></h1>
      <Notification message={message[0]} className={message[1]} />
      <Filter filterstring={filterString} filterChangefunc={handleFilterChange} />
      <h2>Contact List</h2>
      <form onSubmit={addContact}>
        <table>
          <tbody>
          {filteredPersons.map(p => <PhonebookEntry person={p} key={p.id} delFun={deleteContact} />)} 
          <PersonForm newName={newName} handleNameChange={handleNameChange} newNum={newNum} handleNumChange={handleNumChange} />
          </tbody>
        </table>
      </form>
    </div>
  )
}

export default App