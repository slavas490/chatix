import express from 'express'
import user from '../controllers/user'

const router = express.Router()

router.use('/user', user)

module.exports = router
