const express = require('express')

const Posts = require('../data/db.js')

const router = express.Router()

//end points

// GET /api/posts
// Get all the posts
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({
            message: 'The posts information could not be retrieved.'
        })
    }
})

// GET /api/posts/:id
// Get the post with the specified ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const post = await Posts.findById(id)
        if(post.length < 1) {
            throw {
                errorCode: 404,
                message: 'The post with the specified ID does not exist.'
            }
        }
        res.status(200).json(post)
    } catch (error) {
        if (!error.errorCode) {
            res.status(500).json({
                errorMessage: "There was an error while saving the comment to the database"
            })
        }
        res.status(error.errorCode).json({
            message: error.message
        })
    }
})

// GET /api/posts/:id/comments
// Get all the comments associated with the specified ID
router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params
        const comments = await Posts.findPostComments(id)
        if(comments.length < 1) {
            throw {
                errorCode: 404,
                message: 'The post with the specified ID does not exist.'
            }
        }
        res.status(200).json(comments)

    } catch (error) {
        if (!error.errorCode) {
            res.status(500).json({
                errorMessage: "There was an error while saving the comment to the database"
            })
        }
        res.status(error.errorCode).json({
            message: error.message
        })
    }
})

// POST api/posts
// Create post using the information in request body
router.post('/', async (req, res) => {
    try {
        const post = req.body
        if(!post.title || !post.contents) {
            throw {
                errorCode: 400,
                message: 'Please provide title and contents for the post'
            }
        }
        const newPost = await Posts.insert(post)
        res.status(201).json(newPost)
    } catch (error) {
        if (!error.errorCode) {
            res.status(500).json({
                errorMessage: "There was an error while saving the comment to the database"
            })
        }
        res.status(error.errorCode).json({
            errorMessage: error.message
        })
    }
})

//POST /api/posts/:id/comments
// Create a comment for the post with the information inside the request body
router.post('/:id/comments', async (req, res) => {
    const { id } = req.params
    const comment = req.body
    try {
        if (!comment.text) {
            throw {
                errorCode: 400,
                message: "Please provide text for the comment."
            }
        }
        
        const postId = await Posts.findById(comment.post_id)
        if (postId.length == 0) {
            throw {
                errorCode: 404,
                message: 'The post with the specified ID does not exist.'
            }
        }
        
        const newComment = await Posts.insertComment(comment)
        res.status(200).json(newComment)

    } catch (error) {
        if (!error.errorCode) {
            res.status(500).json({
                errorMessage: "There was an error while saving the comment to the database"
            })
        }
        res.status(error.errorCode).json({
            errorMessage: error.message
        })
    }
})

// DELETE /api/posts/:id
// Destroys the post with the specified ID and returns the deleted post object
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deletedPost = await Posts.findById(id)
        if(deletedPost.length == 0) {
            throw {
                errorCode: 404,
                message: "The post with the specified ID does not exist."
            }
        }
        await Posts.remove(id)
        res.status(200).json(deletedPost)

    } catch (error) {
        if (!error.errorCode) {
            res.status(500).json({
                errorMessage: "The post could not be removed"
            })
        }
        res.status(error.errorCode).json({
            errorMessage: error.message
        })
    }
})

// PUT /api/posts/:id
// Updates the post with the specified ID using data from the request body. Returns the modified document, not the original
router.put('/:id', async (req, res) => {
    const { title, contents } = req.body
    const { id } = req.params
    try {
        if(!title || !contents) {
            throw {
                errorCode: 400,
                message: "Please provide title and contents for the post."
            }
        }
        const postToUpdate = await Posts.findById(id)
        if(postToUpdate.length == 0) {
            throw {
                errorCode: 404,
                message: "The post with the specified ID does not exist."
            }
        }
        await Posts.update(id, req.body)
        const newUpdatedPost = await Posts.findById(id)

        res.status(201).json(newUpdatedPost)
    } catch (error) {
        if (!error.errorCode) {
            res.status(500).json({
                errorMessage: "The post information could not be modified."
            })
        }
        res.status(error.errorCode).json({
            errorMessage: error.message
        })
    }
})




module.exports = router