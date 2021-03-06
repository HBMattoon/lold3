
const https = require('https');
const LOL_DEV_KEY = require('./api_key.js');
var Promise = require("bluebird");

const returnCount = 50; //how many out of 100 entries to return


let options = {
  headers:{
    "X-Riot-Token": LOL_DEV_KEY,
  }
}

const getSummonerID = (username, region, cb) => {
  https.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}`, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      let result = JSON.parse(data);
      cb(null, result);
    });

  }).on("error", (err) => {
    cb(err, null);
  });

}

const getSummonerMatchHistory = (summonerID, region, cb) => {

  let url = `https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerID}`;

  https.get(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      let result = JSON.parse(data);
      cb(null, result);
    });

  }).on("error", (err) => {
    cb(err, null);
  });
}

const getMatchInfo = (matchId, region, cb) => {
  let url = `https://${region}.api.riotgames.com/lol/match/v4/matches/${matchId}`;

  https.get(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      let result = JSON.parse(data);
      cb(null, result);
    });

  }).on("error", (err) => {
    cb(err, null);
  });
}


const matchInfo = Promise.promisify(getMatchInfo);

const slowMatchInfo = (gameId, location ,cb) => {
  setTimeout(()=>{
    matchInfo(gameId, location)
    .then(matchData => cb(null, matchData))
    .catch(err => cb(err, null))
  }, 1250);
}


const promisedSlowMatchInfo = Promise.promisify(slowMatchInfo)

let recursiveGetMatchInfo = (arr, location, package, cb) => {
  if (arr.length === 0) {
    cb(null, package)
  }
  let arrData = arr.shift();
  promisedSlowMatchInfo(arrData.gameId, location)
  .then(matchData => {
    package.push(matchData)
    if(arr.length > (100 - returnCount)){
      console.log(arr.length, '% left')
      recursiveGetMatchInfo(arr, location, package, cb);
    } else {
      cb(null, package)
    }
  })
  .catch(err => cb(err, null))
}

const promisedRecursiveGetMatchInfo = Promise.promisify(recursiveGetMatchInfo);

const getMatchHistory = (matchHist, location, cb) => {
  promisedRecursiveGetMatchInfo(matchHist, location, [], cb)
  .then(results =>  cb(null, results))
  .catch(err => cb(err, null));
}

const summonerID = Promise.promisify(getSummonerID);
const summonerMatchHistory = Promise.promisify(getSummonerMatchHistory);
const matchHistory = Promise.promisify(getMatchHistory);

const getSummonerMatchHistoryList = (username, location, cb) => {
  summonerID(username, location)
  .then(output => summonerMatchHistory(output.accountId, location))
  .then(matchHist => matchHistory(matchHist.matches, location))
  .then(finalResults => {
    cb(null, finalResults);
  })
  .catch(err => {
    cb(err, null);
  })
}




module.exports = {
  getSummonerMatchHistoryList
}
