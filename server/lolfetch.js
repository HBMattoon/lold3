
const https = require('https');
const LOL_DEV_KEY = require('./api_key.js');



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

const getSummonerMatchHistory = (summonerID, region = 'na1') => {

  let url = `https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerID}`;

  https.get(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      return JSON.parse(data);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

module.exports = {
  getSummonerID,
  getSummonerMatchHistory,
}
