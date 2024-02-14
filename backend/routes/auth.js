const express = require('express');
const router = express.Router()

const AuthController = require('../controllers/AuthController')
const upload = require('../middleware/userUpload')
const authenticate = require('../middleware/authenticate')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.put('/update-user', authenticate, upload.single('picture'), AuthController.updateUser)
router.put('/update-password', authenticate, AuthController.updatePassword)
router.get('/show/:id', authenticate, AuthController.show)
// router.post('/refresh-token', AuthController.refreshToken)
// router.post('/delete', authenticate, AuthController.destroy)
// router.post('/state', AuthController.show)
module.exports = router