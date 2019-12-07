const express = require('express');
const path = require('path')
const app = express();
const port =  3400;

app.use('/',express.static(path.join(__dirname, '../client')))

app.get('/test',(req, res) => {
  console.log('testmade');
  res.end();
})

app.listen(port,()=> console.log('listening to port: ', port))
