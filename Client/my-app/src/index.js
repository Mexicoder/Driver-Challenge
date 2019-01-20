import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CanvasGrid from './CanvasGrid.js';


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStopsLoaded: false,
      Stops: [],
      isLegsLoaded: false,
      Legs: [],
    }
  }

  componentDidMount() {
    fetch("http://localhost:8000/legs")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLegsLoaded: true,
            Legs: result,
          });
        },
        // Note: it's important to handle errors here instead of a catch() block so that we don't swallow exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )

    fetch("http://localhost:8000/stops")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isStopsLoaded: true,
            Stops: result,
          });
        },
        // Note: it's important to handle errors here instead of a catch() block so that we don't swallow exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLegsLoaded, Legs, isStopsLoaded, Stops } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLegsLoaded) {
      return <div>Loading Legs...</div>;
    } else if (!isStopsLoaded) {
      return <div>Loading Stops...</div>;
    }
    return (
      <div className="game">
        <div className="game-board">
          <CanvasGrid
            Legs={Legs}
            Stops={Stops}
          />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);