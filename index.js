const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blogpost')

const app = express();

const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb+srv://admin:admin1234@kentdb.4oxbo78.mongodb.net/Blog-App?retryWrites=true&w=majority&appName=kentDB');

let db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error'));

db.once('open', () => console.log(`We're connected to MongoDB Atlas`));

app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);


if(require.main === module) {
    app.listen(process.env.PORT || port, () => console.log(`API is now online on port ${process.env.PORT || port}`))

}

module.exports = { app, mongoose };