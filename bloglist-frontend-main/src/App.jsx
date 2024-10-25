import { useState, useEffect } from 'react'
import Login from './components/Login'
import CreateBlog from './components/CreateBlog'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  return (
    <div>
      {user === null ? 
        <Login userState={setUser} /> : 
        <div>
          <div>
            <p>{user.name} logged-in</p>
            <button onClick={() => setUser(null)}>logout</button>
          </div>
          <CreateBlog updateBlogs={setBlogs} />
        </div>
      }
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App