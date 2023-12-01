// backend/index.js
// For backend and express
const express = require('express');
const cors = require("cors");
const cron = require('node-cron');
const app = express();
const multer = require("multer");
const bcrypt = require('bcryptjs');
const port = process.env.SERVER_PORT || 5000;

//Connect to db
const db = require('./db/mongo.js');
const { setupAdmin } = require('./controllers/setup-admin');

const { User } = require('./models/user-model');
const { deleteOldMessages} = require('./controllers/message-ctrl');

const cleanUpInterval = '* * 1 * *'; // Runs every minute (* - minute(0-59) * - Hour(0-23) * - Day(1-31) * - Month(1-12) * -Day of the week 0-7 (sunday = 0) * - Year (optional))

app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, // If your requests need credentials (cookies, authorization headers, etc.)
  }));

const userRouter = require('./routes/user-router');
const messageRouter = require('./routes/message-router');

const storageEngine = multer.diskStorage({
    destination: "../public/images",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}--${file.originalname}`);
    },
  });

  const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 1000000 },
  });

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

app.post("/single", upload.single("file"), (req, res) => {
    if (req.file) {
      const fileDirectory = `images/${req.file.filename}`;
      res.json({ fileDirectory, message: "Single file uploaded successfully" });
    } else {
      res.status(400).send("Please upload a valid image");
    }
  });

  app.post("/password", async (req, res) => {
  const { email, password} = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      user.password = password;

      await user.save();

      return res.json("success");
    } else {
      return res.json("notexist");
    }
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }

  });

app.post("/login", async ( req, res) =>{
    const{ email, password } = req.body
    // Validate if all necessary fields are present
    if (!email || !password) {
      return res.json({ status: "missingEorP" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        // User not found
        return res.json({ status: "notexist" });
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (isPasswordMatch) {
        // Passwords match
        console.log("User logged in:", user);
        res.json({
          status: "exist",
          role: user.role
        });
      } else {
        // Passwords don't match
        res.json({ status: "incorrectPass" });
      }
    } catch(e){
        console.error('Error in login:', e);
        return res.status(500).json({ message: 'Internal server error on Login' });
    }
});

app.post("/signup",async(req,res)=>{
    const{email,password}=req.body
    // Validate if all necessary fields are present
    if (!email || !password) {
        return res.json("missingEorP"); //return missing Email or Password
    }
    try{
        const user = await User.findOne({ email });
        if (user) {
          // User already exists
          res.json("exist")
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

// Assuming this is your backend route setup

// Endpoint to get user details by email
app.get('/userByEmail/:email', async (req, res) => {
  const userEmail = req.params.email;

  try {
      const user = await User.findOne({ email: userEmail });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
  } catch (error) {
      console.error('Error fetching user by email:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


app.delete("/deleteUser/:id", async (req, res) => {
  const id = req.params.id;
  // const email = req.body;
  console.log("id:", id);
  // console.log("email:", email);

  try {
    // Find the user by ID
    const user = await User.findById(id);
    console.log("User to be deleted:", user);
    if (!user) {
      return res.json({ status: "notexist" });
    }

    // If the conditions are met, proceed to delete the user
    await User.findByIdAndDelete(user._id);
    // await user.remove();
    return res.json({ status: "success" });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.json({ status: "ErrorDeletingUser" });
  }
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