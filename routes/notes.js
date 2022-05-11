const express  = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require("../models/Notes");
const { body, validationResult } = require('express-validator');

  //ROUTE 1  :Fetch all notes of user: GET "/api/notes/fetchallnotes" .LogIn required
    router.get('/fetchallnotes',fetchuser, async(req,res)=>{
    try {
        const note = await Note.find({user: req.user.id});
        res.send(note);
    } catch (error) {
         res.status(500).send("Internal server error");
    }
})


     //ROUTE 2  :Adding notes: Post "/api/notes/addnote" .LogIn required
    
     router.post('/addnote', fetchuser ,[
         body('title','Enter valid title').isLength({ min: 5 }),
         body('description','Description must be atleast 5 characters').isLength({ min: 5 })
       ], async(req,res)=>{


        const {title,description,tags} = req.body;
      try{
             //if there are errors then returns the bad errors
             // Finds the validation errors in this request and wraps them in an object with handy functions
             const errors = validationResult(req);
             if (!errors.isEmpty()) {
               return res.status(400).json({ errors: errors.array() });
             }
           
             // new note returns promise helps to add the notes to the data based by the user id loggedIn
           const note = new Note({
               title,description,tags,user : req.user.id
           })

            note.save();
            res.send(note);
    } catch (error) {
         res.status(500).send("Internal server error");
    }
 })

   //ROUTE 3 :Update notes: GET "/api/notes/updatenote" .LogIn required
   router.put('/update/:id',fetchuser, async(req,res)=>{
       const {title,description,tags} = req.body;
    try {
       //Create new notes
       const newNote={}
       if(title){newNote.title=title}
       if(description){newNote.description=description}
       if(tags){newNote.tags=tags}

       //Find the updated note and update it
       //we need to check whether the user trying to access the note and update it is its own note
         let note = await Note.findById(req.params.id);
         //whether the note exists
        if(!note){return res.status(404).send("Not Found")}
     
        //validating whether the user owns the note
         if(note.user.toString() !== req.user.id){
             return res.status(401).send("Not allowed");
         }

         note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
         note.save();
         res.send(note);
        } catch (error) {
             res.status(500).send("Internal server error");
        }
   })

module.exports = router