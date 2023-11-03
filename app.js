//creating an express server for the AI model
//Debashish Buragohain
const express = require('express');
const app = express();

//configure the server for serving static files
app.use("/static", express.static(__dirname));

app.get('/', function (req, res) {
    res.redirect('/static/index.html');
});

app.listen(5000, console.log('server listening to port 5000'))