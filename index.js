const express = require("express");
const app = express()
const port = 3000
const path = require('path');
// const DB = require('./DB');
const mongoose = require('mongoose');
var session = require('express-session')
const flash = require('connect-flash');

const conn = async () => {
    try {
        await mongoose.connect("mongodb+srv://ahmetsayan:135790@codeonly.pealna7.mongodb.net/?retryWrites=true&w=majority&appName=codeonly")
        console.log('ok mongo');

    } catch (error) {
        console.log(error);
    }

}
conn();

// * Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// * Middlewares 
const { locals } = require('./middlewares/locals');
const { uploadSingle, uploadMultiple } = require('./middlewares/fileUpload');



app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use(session({
    secret: "hello",
    resave: false,
    saveUninitialized: false,
}))

app.use(locals)
app.use(flash());

app.use('/libs', express.static(path.join(__dirname, 'node_modules')));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use("/admin-panel", adminRoutes);
app.use("/", userRoutes);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
