
const https = require('https');
const LOL_DEV_KEY = require('./api_key.js');

const region = 'na1';
let username = 'thegnardogg';

let options = {
  headers:{
    "X-Riot-Token": LOL_DEV_KEY,
  }
}

const getUserSummonerData = (username, region = 'na1') => {
  https.get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}`, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(JSON.parse(data));
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

getUserSummonerData('thegnardogg');
