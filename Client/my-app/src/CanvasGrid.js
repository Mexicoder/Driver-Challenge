import React from 'react';
// import Coord from './Coord.js';

class CanvasGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 2.5,
            cellWidth: 5,
            canvasWidth: 1000,
            canvasHeight: 1000,
            stopindex: 0,
        }
    }

    drawStops() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        var radius = 2.5;
        const stops = this.props.Stops.slice();

        for (const stop of stops) {
            const stopX = stop.x + this.state.offset;
            const stopY = stop.y + this.state.offset;

            ctx.beginPath();
            ctx.arc(stopX, stopY, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'green';
            ctx.fill();
        }
        ctx.stroke();
    }

    drawLegs() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")

        const legs = this.props.Legs.slice();
        const stops = this.props.Stops.slice();

        for (let i = 1; i < legs.length; i++) {

            const startStop = stops.find(stop => stop.name === legs[i - 1].startStop);
            const endStop = stops.find(stop => stop.name === legs[i].endStop);

            const start = {
                x: startStop.x + this.state.offset,
                y: startStop.y + this.state.offset,
            }
            const end = {
                x: endStop.x + this.state.offset,
                y: endStop.y + this.state.offset,
            }
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
    }

    componentDidMount() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")

        ctx.beginPath();

        for (var x = this.state.offset; x < this.state.canvasWidth; x += this.state.cellWidth) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 1000);
        }
        for (var y = this.state.offset; y < this.state.canvasHeight; y += this.state.cellWidth) {
            ctx.moveTo(0, y);
            ctx.lineTo(1000, y);
        }
        ctx.strokeStyle = 'grey';
        ctx.stroke();
        // drawLeg(20,10,10,10);
    }

    render() {

        return (
            <div>
                <canvas
                    ref='canvas'
                    width='1000'
                    height='1000'>
                </canvas>
                <div>
                    <button onClick={() => { this.drawStops() }}>drawStops</button>
                    <button onClick={() => { this.drawLegs() }}>drawLegs</button>
                </div>
                <div>
                    <ul>
                        {this.props.Stops.map(stop => (
                            <li key={stop.name}>
                                name: {stop.name} x: {stop.x} y: {stop.y}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

}

export default CanvasGrid;
