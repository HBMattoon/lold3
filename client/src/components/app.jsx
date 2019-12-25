import React from 'react';
import * as d3 from 'd3'
//import node from './d3test.jsx'
//import * as rd3 from 'react-d3-library';
//const RD3Component = rd3.Component;
let width = 600;
let height = 500;
let i = 0;
let margin = {left: 20, right: 20, top: 20, right:20}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data:[{stats:{kills:1, deaths:2, assists:3}}],
      killBars:[],
      deathBars:[],
      assistBars:[],
    }
  }

  setBars(data, type){

    // data = this.state.data

    const xScale = d3.scaleLinear().range([0, width - 100])
    const yScale = d3.scaleLinear().range([height, 0])
    const domain = d3.extent(data, (d, i) => i); //[1,8]
    //console.log(domain)
    const val = d3.max(data, d => d.stats.kills + d.stats.deaths + d.stats.assists);

    xScale.domain(domain);
    yScale.domain([0, val]);

    let result = data.map((d, i)=> {
      const y1 = yScale(d.stats[type]);
      let y;
      let filler;

      if(type === 'kills'){
        y = y1;
        filler = 'green';
      }else if(type === 'deaths'){
        y=y1 - (height - yScale(d.stats.kills));
        filler = 'red';
      }else if(type === 'assists'){
        y=y1 - (height - yScale(d.stats.kills)) - (height - yScale(d.stats.deaths));
        filler = 'orange';
      }

      return {
        x: xScale(i),
        y: y,
        width: (width - margin.left - margin.right - 30)  / data.length,
        height: height - y1,
        fill: filler,//colorScale(d.avg),
        stroke: 'white',
      }
    });
    return result;
  }

  setKillBars(){
    let killBars = this.setBars(this.state.data, 'kills')
    this.setState({killBars})
  }

  setDeathBars(){
    let deathBars = this.setBars(this.state.data, 'deaths')
    this.setState({deathBars})
  }

  setAssistBars(){
    let assistBars = this.setBars(this.state.data, 'assists')
    this.setState({assistBars})
  }

  setAllBars(){
    this.setAssistBars();
    this.setDeathBars();
    this.setKillBars();
  }


  componentDidMount(){
    this.setAllBars();
    //console.log(bars)
    this.getUserData('thegnardogg')
  }

  getUserData(userName){
    fetch(`/api/playername?name=${userName}`)
    .then(data => data.json())
    .then(data => {
      let userStats = data.map(match => this.getParticipantData(userName, match))
      this.setState({data:userStats})
      this.setAllBars();
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
        {this.state.killBars.map(d => (
          <rect x={d.x} y={d.y} width={d.width} height={d.height} fill={d.fill} stroke={d.stroke} key={i++}/>
        ))}
        {this.state.deathBars.map(d => (
          <rect x={d.x} y={d.y} width={d.width} height={d.height} fill={d.fill} stroke={d.stroke} key={i++}/>
        ))}
        {this.state.assistBars.map(d => (
          <rect x={d.x} y={d.y} width={d.width} height={d.height} fill={d.fill} stroke={d.stroke} key={i++}/>
        ))}

      </svg>
    )
  }
}

export default App;
