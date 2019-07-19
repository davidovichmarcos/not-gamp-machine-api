const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const firebase = require("firebase-admin");
const firebaseCredentials = require('./firebaseAuth.json');
let humedity = 0, temperature = 0;

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseCredentials),
  databaseURL: "https://not-gamp-machine.firebaseio.com"
});

setInterval(() => writeSensorData(temperature, humedity), 900*1000);// (900*1000) = 15 min

function writeSensorData(temperature, humedity) {
  const timestamp = Date.now();
  firebase.database().ref('sensordata/data').push({
    temperature,
    humedity,
    timestamp
  });
  console.log(`Data sent to FireBase correctly at ${timestamp}`);
}
function readSensorRange(from, to){
  let chartData = [];
  return firebase.database().ref('sensordata/data').once('value').then(function(snapshot) {
    const responseArray = Object.keys(snapshot.val());
    let filteredData = [];
    for(let index of responseArray) {
      filteredData.push(snapshot.val()[String(index)]);
    }
    chartData = filteredData.filter( entry => from <= entry.timestamp &&  entry.timestamp <= to);
    return chartData;
  });
}

app.listen(port, '0.0.0.0',() => console.log(`This is real weed API is now working at ${port}!`));

app.get('/set', (req, res) => {
    humedity = req.query.h;
    temperature = req.query.t;
    res.end();
});

app.get('/getRange', (req,res) => {
    const { from, to } = req.query;
    readSensorRange(from, to).then( data => {
      if(data.length === 0) {
        console.log('wrong entry criteria');
      } else {
        console.log('Data filtered correctly');
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ data });
    });
  });

app.get('/data', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ humedity, temperature });
  });

app.get('/', (req, res) => {
   res.status(200).send('Welcome to a real triangulation system working with js and arduino');
});
