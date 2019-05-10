const express = require('express');
const app = express();
const port = 3000;
let humedity = 0, temperature = 0;

app.listen(port, '0.0.0.0',() => console.log(`This is real weed API is now working at ${port}!`));

app.get('/set', (req, res) => {
    humedity = req.query.h;
    temperature = req.query.t;
});

app.get('/data', res => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ humedity, temperature });
});