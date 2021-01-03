require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const userRouter = require('./routes/user-router')
const loginClient=  require('./routes/login')
const registerClient=  require('./routes/register')
const verifyToken= require('./routes/token-router')

const app = express()
const apiPort = 8080

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())


db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// enable CORS express.js middleware function 
// app.use((req, res, next) => {
//     res.append('Access-Control-Allow-Origin', '*');
//     next();
//   });

app.get('/', (req, res) => {
    res.append('Access-Control-Allow-Origin', '*');
    res.send('Hello World!')
})

app.use('/api', userRouter)
app.use('/api',loginClient)
app.use('/api',registerClient)
app.use('/api',verifyToken)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
