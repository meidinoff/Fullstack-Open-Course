const Blog = require('../models/blog_post.js')
const blogRouter = require('express').Router()

blogRouter.get('/', async (request, response) => {
    const allBlogs = await Blog.find({})

    return response.json(allBlogs)
})
  
blogRouter.post('/', async (request, response) => {
    const body = request.body

    const blogPost = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    })
  
    const savedNote = await blogPost.save()

    response.status(201).json(savedNote)
})

module.exports = blogRouter