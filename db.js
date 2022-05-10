const mongoose=require('mongoose');
const mongoURI="mongodb://localhost:27017/iNoteBook";

const connectToMongoose = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to Mongoose sucessfully");
    });
}

module.exports = connectToMongoose;