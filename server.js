const express = require('express')
const app = express()
const cors = require('cors');
const routes = require('./routes/routes.js');
require('dotenv').config();
require('./db/conn.js');

app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.get('*', (req, res) => {
    res.writeHead(404, {
        "content-Type": "text/plain"
    }).end("Not Found");
});



const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})