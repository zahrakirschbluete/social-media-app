const apiRouter = require('express').Router()

apiRouter.post('/login', (req, res) => {
    res.json("Thank you for trying to login from our API.")
})

module.exports = apiRouter
