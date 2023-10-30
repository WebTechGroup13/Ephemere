// To connect with the mongoDB database
const mongoose = require('mongoose');
require('dotenv').config()

mongoose
    .connect(process.env.MONGO_KEY, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(e => {
        console.error('Connection error', e.message)
})

const db = mongoose.connection

module.exports = db