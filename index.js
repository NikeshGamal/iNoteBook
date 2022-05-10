const connectToMongo = require('./db');
const express = require('express')

connectToMongo();
const app = express()
const port = 5000

//use of middleware
app.use(express.json());

//we can have routes by using "app.use()" 
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));


//Available route
// app.get('/', (req, res) => {
//   res.send('Hello Nikesh!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})