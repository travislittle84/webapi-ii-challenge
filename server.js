const express = require('express')

const PostsRouter = require('./posts/posts-router.js')

const server = express()

server.use(express.json())

server.use('/api/posts', PostsRouter)

server.get('/', (req, res) => {
    res.send(`<h2>Posts API</h2>`)
})

module.exports = server