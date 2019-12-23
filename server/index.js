const express = require('express');
const path = require('path');
var Promise = require("bluebird");
const {getSummonerID, getSummonerMatchHistory, getMatchInfo, getMatchHistory} = require('./lolfetch.js');

const summonerID = Promise.promisify(getSummonerID);
const summonerMatchHistory = Promise.promisify(getSummonerMatchHistory);
const matchInfo = Promise.promisify(getMatchInfo);
const matchHistory = Promise.promisify(getMatchHistory);

const app = express();
const port =  3400;

const location = 'na1';

app.use('/',express.static(path.join(__dirname, '../client/dist')))

app.get('/api/playername',(req, res) => {
  //console.log('testmade');
  let username = req.query.name;
  summonerID(username, location)
  .then(output => summonerMatchHistory(output.accountId, location))
  .then(matchHist => matchHistory(matchHist.matches, location))
  .then(finalResults => {
    console.log('returning data')
    let data = JSON.stringify(finalResults);
    res.status(200).send(data);
  })
  .catch(err => {
    console.log('err in summonerID: ', err)
    res.status(500).end();
  })

});

app.listen(port,()=> console.log('listening to port: ', port))
