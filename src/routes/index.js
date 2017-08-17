import express from 'express'
import user from '../controllers/user'
import chat from '../controllers/chat'

const router = express.Router()

router.use('/user', user)
router.use('/chat', chat)

module.exports = router
