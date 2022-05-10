const express  = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "nikesh#@goodb0y";

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
             
             //Enabling hasing and salt for a secured password generation
             //salt
             const salt= await bcrypt.genSalt(10);
             //hash with salt integration internally
              const securePass =await bcrypt.hash(req.body.password,salt);

                user= await User.create({
                 name: req.body.name,
                 password:securePass,
                 email: req.body.email
                })

                const data = {
                    id : user.id
                }
                const authtoken = jwt.sign(data,JWT_SECRET);
                res.json({authtoken});
              //  res.json(user);
       }catch(error){
               console.error(error.messsage);
               res.status(500).send("Internal Server Error");
       }
      
})

     //User login using credentials: POST "/api/auth/login" .No need to login
     router.post('/login',[
       body('email','Enter valid email').isEmail(),
       body('password','Password cannot be blank').exists()
     ], async (req,res)=>{
           //if there are errors then returns the bad errors
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }
  
             //request is sent where we have email and password so we need those datas
            const {email,password} = req.body; 

            try{
              //comparing the emails
              //email from req.body is send to User--> to see whether there is any matching email
              let user = await User.findOne({email});
              console.log(user);
              if(!user){
                 return res.status(500).send({error:"Please enter correct  user credentials!!!"});
               }

               //This section compares the hashed password with req.body password
               let comparePassword = await bcrypt.compare(password,user.password);
               if(!comparePassword){
                return res.status(500).send({error:"Please enter correct password credentials!!!"});
               }


               //this is payload which is used to create a jsonwebtoken(i.e authtoken) which is a part of one of the three and is passed in function *********jwt.sign(data,JWT_SECRET)*********
               const data = {
                id : user.id
               }
            
               //this is for creating or sending jsonwebtoken
               //-->is a wway to verify the user by sending a special token that consists of three section
                const authtoken = jwt.sign(data,JWT_SECRET);
                res.json({authtoken});
              
              }catch(error){
                console.error(error.messsage);
                res.status(500).send("Internal Server Error");
              }
     });
module.exports = router