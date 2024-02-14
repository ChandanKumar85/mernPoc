const express = require('express')
const router = express.Router()

const EmployeeController = require('../controllers/EmployeeControllers')
const upload = require('../middleware/upload')
const authenticate = require('../middleware/authenticate')

router.post('/store', authenticate, upload.single('picture'), EmployeeController.store)
router.put('/update', authenticate, upload.single('picture'), EmployeeController.update)
router.delete('/delete/:id', authenticate, EmployeeController.destroy)
router.get('/show-employee/:id', authenticate, EmployeeController.showRelatedUser)
router.get('/show/:id', authenticate, EmployeeController.show)
// router.get('/products', EmployeeController.products)

// router.post('/store', authenticate, upload.array('picture[]'), EmployeeController.store)
// router.get('/', EmployeeController.index)

module.exports = router