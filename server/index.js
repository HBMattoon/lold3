const express = require('express');
const path = require('path');
var Promise = require("bluebird");
const {getSummonerID, getSummonerMatchHistory, getMatchInfo} = require('./lolfetch.js');

const summonerID = Promise.promisify(getSummonerID);
const summonerMatchHistory = Promise.promisify(getSummonerMatchHistory);
const matchInfo = Promise.promisify(getMatchInfo);

const app = express();
const port =  3400;

const location = 'na1';

app.use('/',express.static(path.join(__dirname, '../client/dist')))

app.get('/api/playername',(req, res) => {
  console.log('testmade');
  let username = req.query.name;
  summonerID(username, location)
  .then(output => {
    summonerMatchHistory(output.accountId, location)
    .then(matchHist => {
      //console.log(matchHist)
      matchInfo(matchHist.matches[0].gameId, location)
      .then(matchData => console.log(matchData.participantIdentities))
      .catch(err => console.log('err gettting match data: ', err))


    })
    .catch(err => console.log('err in summonerMatchHist: ', err))
  })
  .catch(err => console.log('err in summonerID: ', err))
  res.end();
});

app.listen(port,()=> console.log('listening to port: ', port))
