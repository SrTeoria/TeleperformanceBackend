const router = require('express').Router()
const { auth } = require('../utils/auth')
const { createUser, login, update, list, deleteUser, getUser } = require('../controllers/user.controller')

router.route('/').get(list)
router.route('/getuser/:userId').get(auth, getUser)
router.route('/createUser').post(auth, createUser)
router.route('/editUser').put(auth, update)
router.route('/createUser').get(auth, list)
router.route('/delete').put(auth, deleteUser)
router.route('/login').post(login)

module.exports = router