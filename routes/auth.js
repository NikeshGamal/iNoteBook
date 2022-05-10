const express  = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');


//create a user using: POST "/api/auth/createuser" . no need to log in 
router.post('/createuser',[
       body('email','Enter valid email').isEmail(),
       body('name','Enter valid name').isLength({ min: 5 }),
       body('password','Enter valid Password').isLength({ min: 5 })
     ], async (req,res)=>{

       try{
                 //if there are errors then returns the bad errors
             // Finds the validation errors in this request and wraps them in an object with handy functions
             const errors = validationResult(req);
             if (!errors.isEmpty()) {
               return res.status(400).json({ errors: errors.array() });
             }
     
             //check whether the user with same email exists or not
             let user=await User.findOne({email:req.body.email});
             if(user){
                return res.status(404).json({error:"Sorry! email has been already taken"})
             }
                user= await User.create({
                 name: req.body.name,
                 password: req.body.password,
                 email: req.body.email
                })
               res.json(user);
       }catch(error){
               console.error(error.messsage);
               res.status(500).send("Some error occurred");
       }
      
})

module.exports = router