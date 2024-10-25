import { useState } from 'react'
import blogService from '../services/blogs'

const CreateBlog = ({ updateBlogs }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const [message, setMessage] = useState(null)

    const create = async (event) => {
        event.preventDefault()

        try {
            await blogService.create({
                title,
                author,
                url
            })

            setTitle('')
            setAuthor('')
            setUrl('')

            const blogs = await blogService.getAll()
            updateBlogs(blogs)
            setMessage('You created a new blog post!')
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        } catch (exception) {
            setMessage('failed to create blog post')
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }


    }

    return (
        <div>
            <h2>Create New:</h2>
            <form onSubmit={create}>
                <div>
                    <label for="title">title: </label>
                    <input id="title" type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
                </div>
                <div>
                    <label for="author">author: </label>
                    <input id="author" type="text" value={author} onChange={({ target }) => setAuthor(target.value)} />
                </div>
                <div>
                    <label for="url">url: </label>
                    <input id="url" type="text" value={url} onChange={({ target }) => setUrl(target.value)} />
                </div>
                <button type="submit">create</button>
            </form>
            <p>{message}</p>
        </div>
    )
}

export default CreateBlog