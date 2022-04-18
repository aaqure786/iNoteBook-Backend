const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");


// Route 1: fetching all notes of user using GET "/api/route/fetchallnotes".  login required

router.get('/fetchallnotes', fetchUser, async (req, res) => {
   try {
      const notes = await Notes.find({ user: req.user.id });
      res.json(notes)

   } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
   }
});

// Route 2: Inserting notes of user using POST "/api/route/addnotes".  login required

router.post('/addnotes', fetchUser, [


   body("title", "Please enter a title of notes").isLength({ min: 5 }),
   body("description", "Plese enter description more than 10 characters").isLength({ min: 10, }),


], async (req, res) => {
   //Checking validation
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }

   // creating a user
   try {
      const notes = await Notes.create({
         user: req.user.id,
         title: req.body.title,
         description: req.body.description,
         tag: req.body.tag,

      });

      res.json(notes);
   } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
   }

});


// Route 3: Updating notes of user using PUT "/api/route/updatenote".  login required

router.put('/updatenote/:id', fetchUser, [


   body("title", "Please enter a title of notes").isLength({ min: 5 }),
   body("description", "Plese enter description more than 10 characters").isLength({ min: 10, }),


], async (req, res) => {

   try {
      
      //Checking validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
   
      const {title,description,tag} = req.body;
   
      // creating a user
      const newnotes = {};
      if(title) { newnotes.title = title }
      if(description) { newnotes.description = description}
      if(tag) { newnotes.tag = tag }
      //find the note to update and update it
      let note = await Notes.findById(req.params.id);
      if (!note) { return res.status(404).send("Not Found")} 
   
      //find the either user is authenticated or not
      if (note.user.toString() !== req.user.id) {
         return res.status(404).send("Not Allowed");
      }
   
      // updating the note
      note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnotes }, { new: true })
      res.json(note);
   } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
   }
});

// Route 4: Deleting notes of user using DELETE "/api/route/deletnotes".  login required

router.delete('/deletnotes/:id', fetchUser , async (req, res) => {
  
   try {
      // finding the note to be delete
      let note = await Notes.findById(req.params.id);
      if (!note) { return res.status(404).send("Not Found")} 
   
      //find the either user is authenticated or not
      if (note.user.toString() !== req.user.id) {
         return res.status(404).send("Not Allowed");
      }
   
      // updating the note
      note = await Notes.findByIdAndDelete(req.params.id)
      res.json({"Success":"Note deleted successfuly"});
      
   } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
   }
});

module.exports = router