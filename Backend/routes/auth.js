const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

// Create a User using POST "/api/auth/registeruser".
router.post(
  "/registeruser",
  [
    body("name", "Enter vlaid Name").isLength({ min: 3 }),
    body("email", "Enter valid Email").isEmail(),
    body("password", "Password must be greater than 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //Checking validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // checking weather user with the email is already exists or not

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User with this email already exist" });
      }
      // securing password from attacker
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password,salt);
      // creating a user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });

      res.json(user);
    } 
    catch (error) {
      console.error(error.message);
      res.status(500).send("Somethind happening wrong");
    }
    // .then(user => res.json(user))
    // .catch(err =>{
    //   res.json({error: "Email already exist!"})
    // });
  }
);

module.exports = router;
