const express = require('express');
const router = express.Router();
const User = require('../models/Users')

// Create a User using POST "/api/auth/". Does not require auth
router.post('/', (req, res)=> {

    console.log(req.body);
    const user = User(req.body);
    user.save(); 
   res.json(req.body);
})

module.exports = router