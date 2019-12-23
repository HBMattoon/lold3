import React from 'react';
import * as d3 from 'd3'
//import node from './d3test.jsx'
//import * as rd3 from 'react-d3-library';
//const RD3Component = rd3.Component;
let width = 400;
let height = 500;
let i = 0;
let margin = {left: 20, right: 20, top: 20, right:20}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data:[1,2,3,4,5,6,7,8,9],
      bars:[]
    }
  }

  getData(){
    let data = this.state.data
    const xScale = d3.scaleLinear().range([0, width - 100])
    const yScale = d3.scaleLinear().range([height, 0])
    //const colorScale = d3.scaleSequential(d3.interpolateSpectral)

    const domain = d3.extent(data, (d, i) => i); //[1,8]
    console.log(domain)
    const val = d3.max(data, d => d); //8
    //const [minAvg, maxAvg] = d3.extent(data, d => d.avg);
    xScale.domain(domain);
    yScale.domain([0, val]);
    //colorScale.domain([maxAvg, minAvg]);

    // calculate x and y for each rectangle
    return data.map((d, i)=> {

      const y1 = yScale(d);
      return {
        x: xScale(i),
        y: y1,
        width: width / data.length,
        height: height - y1,
        fill: 'black',//colorScale(d.avg),
        stroke: 'white',
      }
    });

  }

  componentDidMount(){
    let bars = this.getData();
    //console.log(bars)
    this.setState({bars: bars})
    this.getUserData('thegnardogg')
  }

  getUserData(userName){
    fetch(`/api/playername?name=${userName}`)
    .then(data => data.json())
    .then(data => {
      let userStats = data.map(match => this.getParticipantData(userName, match))
      console.log(userStats);
    })
  }

  getParticipantData(userName, match){
    let participantNumber = NaN;
    let pIds = match.participantIdentities;
    for(let i = 0; i < pIds.length; i++){
      if(userName.toLowerCase() === pIds[i].player.summonerName.toLowerCase()){
        participantNumber = pIds[i].participantId
      }
    }

    if(participantNumber > 0 && participantNumber <= 10){
      let result = {};
      for(let i = 0; i < match.participants.length; i++){
        if(match.participants[i].participantId === participantNumber){
          result = match.participants[i];
          result.fullTeamStats = (result.teamId === 200 ? match.teams[1] : match.teams[0]);
          return result;
        }
      }
    } else {
      console.log('player not found in match');
    }
  }


  render(){
    return (
      <svg width={width} height={height}>
        {this.state.bars.map(d => (
          <rect x={d.x} y={d.y} width={d.width} height={d.height} fill={d.fill} stroke={d.stroke} key={i++}/>
        ))}

      </svg>
    )
  }
}

export default App;
