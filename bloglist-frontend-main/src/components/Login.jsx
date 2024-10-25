import {useState} from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'

const Login = ({ userState }) => {
    const [username, setUsername] = useState([])
    const [password, setPassword] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)

    const handleLogin = async event => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password
            })

            window.localStorage.setItem(
                'loggedBlogUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            userState(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }
    
    return (
        <div>
            <h2>log in to application</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label for="username">username: </label>
                    <input id="username" type="text" onChange={({ target }) => setUsername(target.value)} />
                </div>
                <div>
                    <label for="password">password: </label>
                    <input id="password" type="password" onChange={({ target }) => setPassword(target.value)} />
                </div>
                <button type="submit">login</button>
                {errorMessage === null ? null : <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p> }
            </form>
        </div>
    )
}

export default Login