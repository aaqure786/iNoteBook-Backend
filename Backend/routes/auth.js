const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require("../middleware/fetchUser");


const JWT_SECRET = "abrarMERNAPP";


// Route 1: Create a User using POST "/api/auth/registeruser". no login required
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
      const data = {
        user:{
          id: user.id
        }
      }
      const authToken = jwt.sign(data,JWT_SECRET);
      
      // res.json(user);
      res.json({authToken});
    } 
    catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
    // .then(user => res.json(user))
    // .catch(err =>{
    //   res.json({error: "Email already exist!"})
    // });
  }
);





// Route 2: Authenticate a User using POST "/api/auth/login". no login required
router.post('/login',
[
 
  body("email", "Enter valid Email").isEmail(),
  body("password", "Password cannot be blank").exists(),
],
async (req, res) => {
  //Checking validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

const {email, password} = req.body;
try {
  let user = await User.findOne({email});
  if(!user){
    return res.status(400).json("Please Enter valid cretentials");
  }
  const passwordCompare = await bcrypt.compare(password,user.password);

  if(!passwordCompare){
    return res.status(400).json("Please Enter valid cretentials");
  }

  const data = {
    user: {
      id: user.id
    }
  }
  const authToken = jwt.sign(data,JWT_SECRET);
      res.json({authToken});
} catch (error) {
  console.error(error.message);
      res.status(500).send("Internal Server Error");
}

});


// Route 3: Get Logedin user data  using POST "/api/auth/getData". login required
router.post('/getData', fetchUser,
async (req, res) => {
  
try {
  userid = req.user.id;
  const user = await User.findById(userid).select("-password");
  res.send(user);

} catch (error) {
  console.error(error.message);
      res.status(500).send("Internal Server Error");
}

});

module.exports = router;
