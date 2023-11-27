// backend/index.js
// For backend and express
const express = require('express');
const cors = require("cors");
const cron = require('node-cron');
const app = express();
const port = process.env.SERVER_PORT || 5000;

//Connect to db
const db = require('./db/mongo.js');
const { setupAdmin } = require('./controllers/setup-admin');
const { User } = require('./models/user-model');
const { deleteOldMessages} = require('./controllers/message-ctrl');

const cleanUpInterval = '*/10 * * * *'; // Runs every minute (* - minute(0-59) * - Hour(0-23) * - Day(1-31) * - Month(1-12) * -Day of the week 0-7 (sunday = 0) * - Year (optional))

app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, // If your requests need credentials (cookies, authorization headers, etc.)
  }));

const userRouter = require('./routes/user-router');
const messageRouter = require('./routes/message-router');

app.use('/user', userRouter);
app.use('/', messageRouter);
app.use('/api/messages', messageRouter);

app.get("/", (req, resp) => {
 
    resp.send("App is Working");
    // You can check backend is working or not by
    // entering http://localhost:5000
     
    // If you see App is working means
    // backend working properly
});

app.post("/login", async ( req, res) =>{
    const{ email, password } = req.body
    // Validate if all necessary fields are present
    if (!email || !password) {
        return res.status(400).json({ message: 'email and password are required.' });
    }
    try{
        const loginUser = await User.findOne({ email})
        if(loginUser){
            console.log('User logged in successfully:', loginUser);
            res.json("exist")
        }
        else{
            res.json("notexist")
        }
    }
    catch(e){
        // res.json("fail")
        console.error('Error in login:', e);
        return res.status(500).json({ message: 'Internal server error on Login' });
    }
})

app.post("/signup",async(req,res)=>{
    const{email,password}=req.body

    // Validate if all necessary fields are present
    if (!email || !password) {
        return res.status(400).json({ message: 'email and password are required.' });
    }
    try{
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.json("exist");       
        }
        else{
            const newUser = new User({ email, password, role: 'user' });
            await newUser.save();
            console.log('User registered successfully:', newUser);
            return res.json("notexist");
        }
    }
    catch(e){
        res.json("fail")
        console.error('Error in signup:', e);
        return res.status(500).json({ message: 'Internal server error on Signup' });
    }
})

// Initialize admin setup during server startup
setupAdmin();

// Schedule a task to run deleteOldMessages every minute (for demonstration purposes)
cron.schedule(cleanUpInterval, async () => {
    try {
        // Your code to connect to the database and execute deleteOldMessages
        await deleteOldMessages();
    } catch (error) {
        console.error('Error running deleteOldMessages:', error);
    }
});

app.listen(5000, () => {
    console.log('App listen at port 5000');
});

module.exports = app;