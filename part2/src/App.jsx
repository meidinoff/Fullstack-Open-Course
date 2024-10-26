import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import noteService from './services/notes'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')
  const [loginVisible, setLoginVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(createdNote => {
        setNotes(notes.concat(createdNote))
      })
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(updatedNote => {
        setNotes(notes.map(note => note.id !== id ? note : updatedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const noteForm = () => (
    <Togglable buttonLabel='new note'>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && 
        <div>
          <p>{user.name} logged in</p>
          <div>{noteForm()}</div>
        </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important': 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} 
          />
        )}
      </ul>
      
      <Footer />
    </div>
  )
}

export default App