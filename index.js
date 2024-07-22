const express = require("express");
const mongoose = require("mongoose");

const app = express()
const port = 3000
const path = require('path');


// * Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');


app.use('/libs', express.static(path.join(__dirname, 'node_modules')));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use("/admin-panel", adminRoutes);
app.use("/", userRoutes);

mongoose.connect('mongodb+srv://ahmetsayan:135790@codeonly.pealna7.mongodb.net/?retryWrites=true&w=majority&appName=codeonly')

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
