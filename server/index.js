const express = require('express');
const path = require('path');
var Promise = require("bluebird");
const {getSummonerMatchHistoryList} = require('./lolfetch.js');

const userHistory = Promise.promisify(getSummonerMatchHistoryList);


const app = express();
const port =  3400;

const location = 'na1';

app.use('/',express.static(path.join(__dirname, '../client/dist')))

app.get('/api/userhist',(req, res) => {

  let username = req.query.name;

  userHistory(username, location)
  .then(finalResults => {
    let data = JSON.stringify(finalResults);
    res.status(200).send(data);
  })
  .catch(err => {
    console.log('err in summonerID: ', err)
    res.status(500).end();
  })

});

app.listen(port,()=> console.log('listening to port: ', port))
