// backend/index.js
// For backend and express
const express = require('express');
const cors = require("cors");
const cron = require('node-cron');
const app = express();
const port = process.env.SERVER_PORT || 5000;

//Connect to db
const db = require('./db');

const { deleteOldMessages} = require('./controllers/message-ctrl');
const cleanUpInterval = '* * * * *'; // Runs every minute (* - minute(0-59) * - Hour(0-23) * - Day(1-31) * - Month(1-12) * -Day of the week 0-7 (sunday = 0) * - Year (optional))

app.use(express.json()); // Parse JSON payloads

const userRouter = require('./routes/user-router');
const messageRouter = require('./routes/message-router');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, // If your requests need credentials (cookies, authorization headers, etc.)
  }));

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.use('/users', userRouter);
app.use('/', messageRouter);

app.get("/", (req, resp) => {
 
    resp.send("App is Working");
    // You can check backend is working or not by
    // entering http://localhost:5000
     
    // If you see App is working means
    // backend working properly
});
 
// Use cors middleware for a specific route
app.post('http://localhost:5000', cors(), (req, res) => {
    // Your route logic
});

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