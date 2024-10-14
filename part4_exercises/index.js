const app = require('./app.js')
const { PORT, MONGODB_URI } = require('./utils/config.js')
const logger = require('./utils/logger.js')

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})