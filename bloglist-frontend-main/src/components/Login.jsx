import {useState} from 'react'
import loginService from '../services/login'

const Login = ({  }) => {
    const [username, setUsername] = useState([])
    const [password, setPassword] = useState([])
    const [user, setUser] = useState([])

    const handleLogin = async event => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password
            })

            window.localStorage.setItem(
                'loggedBlogUser', JSON.stringify(user)
            )

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
            </form>
        </div>
    )
}

export default Login