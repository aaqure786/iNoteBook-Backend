const express = require('express');
const router = express.Router();
const User = require('../models/Users')
const { body, validationResult } = require('express-validator');

// Create a User using POST "/api/auth/". Does not require auth
router.post('/',[
    body('name',"Enter vlaid Name").isLength({min: 3}),
    body('email',"Enter valid Email").isEmail(),
    body('password',"Password must be greater than 5 character").isLength({min:5})
], 
(req, res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        email: req.body.email,
        password:req.body.password,
      }).then(user => res.json(user));
})

module.exports = router