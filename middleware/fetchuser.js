 const jwt = require('jsonwebtoken');
const JWT_SECRET = "nikesh#@goodb0y";

const fetchuser = (req,res,next)=>{
    //get the user from the token and add id to the req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please authenticate using  valid token"});
    }

    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.user= data;
        next();
    } catch (error) {
        res.status(401).send({error:"Please authenticate using  valid token"});
    }
}

module.exports = fetchuser;