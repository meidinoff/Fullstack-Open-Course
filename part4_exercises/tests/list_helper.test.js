const { test, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const listHelper = require('../utils/list_helper.js')
const blogRouter = require('../controllers/blog_posts.js')
const app = require('../app.js')

const api = supertest(app)

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    const listWithMoreBlogs  = [
        {
          _id: "5a422a851b54a676234d17f7",
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7,
          __v: 0
        },
        {
          _id: "5a422aa71b54a676234d17f8",
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 5,
          __v: 0
        },
        {
          _id: "5a422b3a1b54a676234d17f9",
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: 12,
          __v: 0
        },
        {
          _id: "5a422b891b54a676234d17fa",
          title: "First class tests",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
          likes: 10,
          __v: 0
        },
        {
          _id: "5a422ba71b54a676234d17fb",
          title: "TDD harms architecture",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
          likes: 0,
          __v: 0
        },
        {
          _id: "5a422bc61b54a676234d17fc",
          title: "Type wars",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
          likes: 2,
          __v: 0
        }  
      ]

    test('when list has only one blog, equal the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('when list has multiple blogs, equal the total', () => {
        const result = listHelper.totalLikes(listWithMoreBlogs)
        assert.strictEqual(result, 36)
    })

    test('returns the first blog with the most likes', () => {
        const result = listHelper.favoriteBlog(listWithMoreBlogs)
        console.log(result)
        assert.deepStrictEqual(result, listWithMoreBlogs[2])
    })

    test('returns the author with the most blogs', () => {
        const result = listHelper.mostBlogs(listWithMoreBlogs)
        console.log(result)
        const answer = {
            "author": "Robert C. Martin",
            "blogs": 3
        }
        assert.deepStrictEqual(result, answer)
    })

    test('returns the author with the most likes', () => {
        const result = listHelper.mostLikes(listWithMoreBlogs)
        console.log(result)
        const answer = {
            "author": "Edsger W. Dijkstra",
            "likes": 17
        }
        assert.deepStrictEqual(result, answer)
    })
})

test('get correct number of blog posts', async () => {
    const getRequest = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(getRequest.body.length, 5)
})

test('id is named id', async () => {
    const getRequest = await api.get('/api/blogs')

    const hasId = getRequest.body.every(post => Boolean(post.id))

    assert.strictEqual(hasId, true)
})

test('HTTP POST request successful', async () => {
    const newNote = {
        title: "This is a POST request test",
        author: "Max Eidinoff",
        url: "random",
        likes: 14
    }

    const initialGet = await api.get('/api/blogs')

    await api.post('/api/blogs').send(newNote)

    const updatedGet = await api.get('/api/blogs')

    assert.strictEqual(updatedGet.body.length, initialGet.body.length + 1)
    assert.strictEqual(updatedGet.body[updatedGet.body.length - 1].title, newNote.title)
})

test('likes default to 0 if missing', async () => {
    const newNote = {
        title: "This blog post has no likes property",
        author: "Max Eidinoff",
        url: "idk"
    }

    await api.post('/api/blogs').send(newNote)
    const getRequest = await api.get('/api/blogs')

    assert.strictEqual(getRequest.body[getRequest.body.length - 1].likes, 0)
})

test.only('status code 400 Bad Request if missing title or url', async () => {
    const initialGetRequest = await api.get('/api/blogs')
    
    const newNote = {
        author: "Max Eidinoff"
    }

    await api
        .post('/api/blogs')
        .send(newNote)
        .expect(400)
    
    const newGetRequest = await api.get('/api/blogs')

    assert.strictEqual(initialGetRequest.body.length, newGetRequest.body.length)
})

after(async () => {
    await mongoose.connection.close()
})