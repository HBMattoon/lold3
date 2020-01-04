const express = require('express');
const path = require('path');
const fs = require('fs');
const Promise = require("bluebird");
const {getSummonerMatchHistoryList} = require('./lolfetch.js');


const userHistory = Promise.promisify(getSummonerMatchHistoryList);
const devDataPath = path.join(__dirname, './dev_data/sample_data.txt');
const port =  3400;
const location = 'na1';

const app = express();

app.use('/',express.static(path.join(__dirname, '../client/dist')))

app.get('/api/userhist',(req, res) => {

  let username = req.query.name;

  userHistory(username, location)
  .then(finalResults => {
    let data = JSON.stringify(finalResults);
    fs.writeFile(devDataPath, data, (err) => {
      console.log('error writing file!: ', err);
    })
    res.status(200).send(data);
  })
  .catch(err => {
    console.log('err in summonerID: ', err)
    res.status(500).end();
  })

});


app.get('/api/userhistdev', (req, res)=> {
  fs.readFile(devDataPath, (err, data)=> {
    if(err){
      res.status(500).end()
    } else {
      res.status(200).send(data)
    }
  })
})

app.listen(port,()=> console.log('listening to port: ', port))
