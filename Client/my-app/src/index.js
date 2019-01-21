import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Canvas from './Canvas';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStopsLoaded: false,
      stops: [],
      isLegsLoaded: false,
      legs: [],
      isDriverLoaded: false,
      driver: {},
      socket: new WebSocket('ws://localhost:8000'),
    }
  }

  componentDidMount() {
    fetch("http://localhost:8000/legs")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLegsLoaded: true,
            legs: result,
          });
        },
        // Note: it's important to handle errors here instead of a catch() block so that we don't swallow exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLegsLoaded: true,
            error
          });
        }
      );

    fetch("http://localhost:8000/stops")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isStopsLoaded: true,
            stops: result,
          });
        },
        // Note: it's important to handle errors here instead of a catch() block so that we don't swallow exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isStopsLoaded: true,
            error
          });
        }
      );

    fetch("http://localhost:8000/driver")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isDriverLoaded: true,
            driver: result,
          });
        },
        // Note: it's important to handle errors here instead of a catch() block so that we don't swallow exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isDriverLoaded: true,
            error
          });
        }
      );

    const socket = this.state.socket;

    socket.onopen = function () {
      socket.send('something client ');
    };
    socket.onmessage = function (event) {
      this.setState = { Message: event.data };
      console.log(event.data);
    };
  }

  render() {
    const { error, isLegsLoaded, legs, isStopsLoaded, stops, driver, socket } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLegsLoaded) {
      return <div>Loading legs...</div>;
    } else if (!isStopsLoaded) {
      return <div>Loading stops...</div>;
    }
    return (
      <div >
        <Canvas
          legs={legs}
          stops={stops}
          driver={driver}
          socket={socket}
        />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
          callback(currTime + timeToCall);
      },
      timeToCall);
      lastTime = currTime + timeToCall;
      return id;
  };

  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
  };
}());