
const https = require('https');
const LOL_DEV_KEY = require('./api_key.js');
var Promise = require("bluebird");



let options = {
  headers:{
    "X-Riot-Token": LOL_DEV_KEY,
  }
}

const getSummonerID = (username, region, cb) => {
  console.log('getting summonerID')
  https.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}`, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      //console.log('returning data')
      data += chunk;
    });

    res.on('end', () => {
      //console.log('returning data')
      let result = JSON.parse(data);
      cb(null, result);
    });

  }).on("error", (err) => {
    //console.log("Error: " + err.message);
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
  }, 1500);
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
    if(arr.length > 90){
      console.log(arr.length, '% left')
      recursiveGetMatchInfo(arr, location, package, cb);
    } else {
      console.log('returning package')
      cb(null, package)
    }
  })
  .catch(err => cb(err, null))
}

const promisedRecursiveGetMatchInfo = Promise.promisify(recursiveGetMatchInfo);

const getMatchHistory = (matchHist, location, cb) => {
  promisedRecursiveGetMatchInfo(matchHist, location, [], cb)
  .then(results => {
    console.log('results are in!!!!!')
    cb(null, results)
  })
  .catch(err => {
    console.log('you messed up somewhere');
    cb(err, null);
  })
}




module.exports = {
  getSummonerID,
  getSummonerMatchHistory,
  getMatchInfo,
  getMatchHistory
}
