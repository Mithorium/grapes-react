import React, { Component, PropTypes } from 'react';
import logo from './logo.svg';
// Not convinced this is the "best" way of importing images, but this is how they did it and it works
import cdlogo from './cd-logo.svg';
import cdavatar from './cd-avatar.png';
import ship from './ship.svg';
import containerimg from './container.svg';
import humidityimg from './humidity.svg';
import temperatureimg from './temperature.svg';
import './App.css';
// Used `npm install --save react-refetch` as seen on https://github.com/heroku/react-refetch
import { connect, PromiseState } from 'react-refetch'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      sensor: null
    }
    this.setSide = this.setSide.bind(this)
  }
  setSide(_sensor){
    this.setState({sensor: _sensor})
  }
  static propTypes = {
    uiFetch: PropTypes.instanceOf(PromiseState).isRequired
  }
  render() {
    const { uiFetch } = this.props
    if (uiFetch.pending) {
      return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <h1>Loading...</h1>
        </div>
      );
    } else {
      return (
        <div className="App">
          <header className="cd-main-header">
            <a className="cd-logo"><img src={cdlogo} alt="Logo" /></a>

            <nav className="cd-nav">
              <ul className="cd-top-nav">
                <li><a>Support</a></li>
                <li className="has-children account">
                  <a>
                    <img src={cdavatar} alt="avatar" />
                    Account
                  </a>

                  <ul>
                    <li><a href="#0">My Account</a></li>
                    <li><a href="#0">Edit Account</a></li>
                    <li><a href="#0">Logout</a></li>
                  </ul>
                </li>
              </ul>
            </nav>
          </header>
          <div className="cd-main-content">
            <Sidebar sensor={this.state.sensor || uiFetch.value[0]} />

            <div className="content-wrapper">
              <Dashboard count={uiFetch.value.length} />
              <Sensors sensors={uiFetch.value} action={this.setSide} />
            </div>
          </div> 
        </div>
      );
    }
  }
  componentDidMount() {
    // Think I was going to do some onChange flashing animation here but didn't get to it
  }
}

// export default App;

// Technically each component should be in a separate .js file?
// And then imported above with "import Sidebar from ./Sidebar" (but it would be in Sidebar.js?)
// you don't have the trailing .js in the import statement for reasons unknown to me

// This style of declaring a component is equivalent to the one above, just less code if you don't need to do anything except render some html
// see https://camjackson.net/post/9-things-every-reactjs-beginner-should-know
// Also this isn't html, its "JSX", yep
// I'm assuming className is used (whereas every other attribute can be named normally) because class is a reserved word in javascript LOL
const Sidebar = props => (
  <nav className="cd-side-nav">
    <ul>
      <li className="overview">
        <a>Sensor {props.sensor.id}</a>
      </li>
      <li className="cd-label">Temperature</li>
      <li className="sensor"><a>Current: {parseFloat(props.sensor.temperature.current) + "°"}</a></li>
      <li className="sensor"><a>Min: {parseFloat(props.sensor.temperature.min) + "°"}</a></li>
      <li className="sensor"><a>Max: {parseFloat(props.sensor.temperature.max) + "°"}</a></li>
      <li className="sensor"><a>Avg: {parseFloat(props.sensor.temperature.avg) + "°"}</a></li>
      <li className="cd-label">Humidity</li>
      <li className="sensor"><a>Current: {parseFloat(props.sensor.humidity.current)}%</a></li>
      <li className="sensor"><a>Min: {parseFloat(props.sensor.humidity.min)}%</a></li>
      <li className="sensor"><a>Max: {parseFloat(props.sensor.humidity.max)}%</a></li>
      <li className="sensor"><a>Avg: {parseFloat(props.sensor.humidity.avg)}%</a></li>
      <li className="cd-label">Pressure</li>
      <li className="sensor"><a>Current: {parseFloat(props.sensor.pressure.current)} hPa</a></li>
      <li className="sensor"><a>Min: {parseFloat(props.sensor.pressure.min)} hPa</a></li>
      <li className="sensor"><a>Max: {parseFloat(props.sensor.pressure.max)} hPa</a></li>
      <li className="sensor"><a>Avg: {parseFloat(props.sensor.pressure.avg)} hPa</a></li>
      <li className="cd-label">Light</li>
      <li className="sensor"><a>Current: {parseFloat(props.sensor.light)}</a></li>
    </ul>

    <ul>
      <li className="cd-label">Action</li>
      <li className="action-btn"><a>Reset</a></li>
    </ul>
  </nav>
);

const Dashboard = props => (
  <div className="dashboard">
    <div style={{background: "rgba(95, 183, 96, 1)"}}>
      <h2>Container Health</h2>
      <span>98%</span>
    </div>
    <div style={{background: "rgba(54, 123, 181, 1)"}}>
      <img src={containerimg} alt="Containers" />
      <h2>Total Containers</h2>
      <span>{props.count}</span>
    </div>
    <div style={{background: "rgba(238, 172, 87, 1)"}}>
      <img src={humidityimg} alt="Humidity" />
      <h2>Humidity in Range</h2>
      <span>{props.count}</span>
    </div>
    <div style={{background: "rgba(212, 86, 78, 1)"}}>
      <img src={temperatureimg} alt="Temperature" />
      <h2>Temperature in Range</h2>
      <span>{props.count}</span>
    </div>
  </div>
);

const Sensors = props => (
  <div className="ship">
    <img src={ship} className="ship-image" role="presentation" />
    <div className="container">
      { props.sensors.map(sensor => <div key={sensor.id} style={{background: '#' + sensor.color}} onClick={props.action.bind(null, sensor)} title={"ID: " + sensor.id + "\nTemperature: " + parseFloat(sensor.temperature.current) + "°\nHumidity: " + parseFloat(sensor.humidity.current) + "%\nPressure: " + parseFloat(sensor.pressure.current) + " hPa\nLight: " + parseFloat(sensor.light)}></div>) }
    </div>
  </div>
);

// Thing from heroku/react-refresh, no idea what it's doing tbh
export default connect((props) => ({
  uiFetch: { url: '/ui', refreshInterval: 1000 }
  // uiFetch: { url: 'http://198.199.67.210:8000/ui', refreshInterval: 100000 }
}))(App)
