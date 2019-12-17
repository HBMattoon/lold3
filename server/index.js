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
        ////TODO put in own function
      console.log('matchHist :',matchHist);
      let package = {data:[]}

      let slowMatchInfo = (data, cb) => {
        setTimeout(()=>{
          console.log('getting match info')
          matchInfo(data, location)
          .then(matchData => {
            //console.log('matchdata: ',matchData)
            package.data.push(matchData)
            cb(null, matchData)
          })
          .catch(err => {
            console.log('err getting match data: ', err);
            cb(err, null)
          })
        }, 1500);
      }
      slowMatchInfo = Promise.promisify(slowMatchInfo)

      let recursiveGetMatchInfo = (arr) => {
        let arrData = arr.shift()
        console.log('game id is: ',arrData.gameId)
        slowMatchInfo(arrData.gameId)
        .then(()=> {
          if(arr.length > 0){
            console.log(arr.length, ' entries left!');
            recursiveGetMatchInfo(arr);
          } else {
            console.log('done!')
            console.log(package);
          }
        })
        .catch(()=>console.log('err in slowMatchInfo: ', err))
      }

      recursiveGetMatchInfo(matchHist.matches)
      ///put above in own function


    })
    .catch(err => console.log('err in summonerMatchHist: ', err))
  })
  .catch(err => console.log('err in summonerID: ', err))
  res.end();
});

app.listen(port,()=> console.log('listening to port: ', port))
