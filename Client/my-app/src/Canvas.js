import React from 'react';
import LegsDropDown from './LegsDropDown';
import LegProgess from './LegProgess';


class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            scale: 3,
            // offset: 2.5,
            // scale: 2,
            cellWidth: 10,
            canvasWidth: 500,
            canvasHeight: 500,
            stopindex: 0,
            selectedLeg: null,
        }

        this.legChange = this.legChange.bind(this);
    }

    updateDriverLocation(){
        fetch("http://localhost:8000/driver",{
            method: "PUT",
        })
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
    }

    legChange(leg) {
        this.setState({ selectedLeg: leg });

        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")

        const stops = this.props.stops.slice();

        const startStop = stops.find(stop => stop.name === leg.startStop);
        const endStop = stops.find(stop => stop.name === leg.endStop);

        const start = {
            x: startStop.x * this.state.scale + this.state.offset,
            y: startStop.y * this.state.scale + this.state.offset,
        }
        const end = {
            x: endStop.x * this.state.scale + this.state.offset,
            y: endStop.y * this.state.scale + this.state.offset,
        }

        this.animateLine(ctx, start.x, start.y, end.x, end.y);
    }

    sendMessage() {
        this.props.socket.send('something client 2');
    }

    drawStops() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        const radius = 2.5;
        const stops = this.props.stops.slice();

        for (const stop of stops) {
            const stopX = stop.x * this.state.scale + this.state.offset;
            const stopY = stop.y * this.state.scale + this.state.offset;

            ctx.beginPath();
            ctx.arc(stopX, stopY, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'green';
            ctx.fill();

            ctx.font = "10 Verdana";
            ctx.fillStyle = 'blue';
            ctx.fillText(stop.name, stopX + 5, stopY + 5);
        }
        ctx.stroke();
    }

    drawLegs() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")

        const legs = this.props.legs.slice();
        const stops = this.props.stops.slice();

        for (let i = 1; i < legs.length; i++) {

            const startStop = stops.find(stop => stop.name === legs[i - 1].startStop);
            const endStop = stops.find(stop => stop.name === legs[i].endStop);

            const start = {
                x: startStop.x * this.state.scale + this.state.offset,
                y: startStop.y * this.state.scale + this.state.offset,
            }
            const end = {
                x: endStop.x * this.state.scale + this.state.offset,
                y: endStop.y * this.state.scale + this.state.offset,
            }
            this.animateLine(ctx, start.x, start.y, end.x, end.y);
        }
    }

    animateLine(ctx, startX, startY, endX, endY) {
        var points = [];

        var dx = endX - startX;
        var dy = endY - startY;
        for (var j = 0; j < 100; j++) {
            var x = startX + dx * j / 100;
            var y = startY + dy * j / 100;
            points.push({
                x: x,
                y: y
            });
        }

        let t = 1;

        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.lineCap = "round";

        let animate = () => {
            if (t < points.length - 1) {
                requestAnimationFrame(animate);
            }
            this.inputElement.value = Math.floor(t / points.length * 100);
           
            // draw a line segment from the last waypoint
            // to the current waypoint
            ctx.beginPath();
            ctx.moveTo(points[t - 1].x, points[t - 1].y);
            ctx.lineTo(points[t].x, points[t].y);
            ctx.stroke();
            t++;
        }
        animate();
    }

    componentDidMount() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")
        const width = this.state.canvasWidth;
        const height = this.state.canvasHeight;

        ctx.beginPath();

        for (var x = this.state.offset; x < this.state.canvasWidth; x += this.state.cellWidth) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, width);
        }
        for (var y = this.state.offset; y < this.state.canvasHeight; y += this.state.cellWidth) {
            ctx.moveTo(0, y);
            ctx.lineTo(height, y);
        }
        ctx.strokeStyle = 'grey';
        ctx.stroke();
        // drawLeg(20,10,10,10);
    }

    render() {
        return (
            <div>
                <div>
                    <LegsDropDown
                        legs={this.props.legs}
                        driver={this.props.driver}
                        onChange={this.legChange}
                    ></LegsDropDown>
                    <LegProgess
                        inputRef={el => (this.inputElement = el)} 
                    ></LegProgess>
                </div>
                <div>
                    <canvas
                        ref='canvas'
                        width={this.state.canvasWidth}
                        height={this.state.canvasHeight}>
                    </canvas>
                </div>
                <div>
                    <button onClick={() => { this.drawStops() }}>drawStops</button>
                    <button onClick={() => { this.drawLegs() }}>drawLegs</button>
                    <button onClick={() => { this.sendMessage() }}>sendMessage</button>
                </div>
                <div>
                    <ul>
                        {this.props.stops.map(stop => (
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

export default Canvas;


