const express = require('express');
const app = express();
const port=process.env.PORT || 3000;
let humedity = 0, temperature = 0;

app.listen(port, '0.0.0.0',() => console.log(`This is real weed API is now working at ${port}!`));

app.get('/set', (req, res) => {
    humedity = req.query.h;
    temperature = req.query.t;
    res.end();
});

app.get('/data', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ humedity, temperature });
 });

app.get('/', (req, res) => {
   res.status(200).send('Welcome to a real triangulation system working with js and arduino');
});