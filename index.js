const express = require("express");
const app = express()
const port = 3000
const path = require('path');


// * Routes
const userRoutes = require('./routes/userRoutes');

app.use('/libs', express.static(path.join(__dirname, 'node_modules')));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(userRoutes);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})