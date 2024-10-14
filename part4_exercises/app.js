const { PORT, MONGODB_URI } = require('./utils/config.js')
const express = require('express')
const app = express()

const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blog_posts.js')
const logger = require('./utils/logger.js')

mongoose.set('strictQuery', false)

logger.info('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use('/api/blogs', blogRouter)

module.exports = app