const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const firebase = require("firebase-admin");
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'firebaseAuth.json');
let humedity = 0, temperature = 0;

fs.readFile(filePath, (err, realData) => {
    const data = JSON.parse(realData.toString());
    if (!err) {
      console.log(data)
      firebase.initializeApp({
        credential: firebase.credential.cert(data),
        databaseURL: "https://not-gamp-machine.firebaseio.com"
      });
  } else {
      console.log(err);
  }
});

setInterval(() => writeSensorData(temperature, humedity), 900*1000);// (900*1000)=15 min

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
  /*  let filteredList = Object.keys(snapshot.val()).filter(timestamp => from <= timestamp && timestamp <= to);
    for(let date of filteredList) {
     chartData.push(snapshot.val()[String(date)]);
    }
    return chartData;*/
    console.log('snapshot',snapshot);
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

//SONIDOS DE SKATEE PARA AUDIO JORUNEry