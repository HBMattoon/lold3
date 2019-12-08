const express = require('express');
const path = require('path');
var Promise = require("bluebird");
const {getSummonerID, getSummonerMatchHistory} = require('./lolfetch.js');



const summonerID = Promise.promisify(getSummonerID);
const summonerMatchHistory = Promise.promisify(getSummonerMatchHistory);

const app = express();
const port =  3400;

app.use('/',express.static(path.join(__dirname, '../client')))

app.get('/test',(req, res) => {
  console.log('testmade');
  res.end();
});

test('thegnardogg', 'na1')
.then(res => {
  console.log(res);
})
.catch(err => {
  console.log(err);
})

app.listen(port,()=> console.log('listening to port: ', port))
