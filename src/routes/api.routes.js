const fetch = require('node-fetch')
const router = require('express').Router()
const { auth } = require('../utils/auth')

router.route('/').get(auth, async(req, res) => {
  const data = await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json())
  res.status(200).json(data)
})

module.exports = router