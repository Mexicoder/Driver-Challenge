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
            driver: {},
        }

        this.legChange = this.legChange.bind(this);
    }

    updateServerDriverLocation() {
        fetch("http://localhost:8000/driver", {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.props.driver),
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log('driver put success');
                },
                (error) => {
                    console.log({ msg: 'driver put error', error });
                }
            );
    }

    legChange(leg) {
        this.setState({ driver: {activeLegID:leg.legID,legProgress:0} });
        this.props.socket.send(JSON.stringify({ activeLegID: leg.legID }));

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

        this.animateLegProgress(ctx, start.x, start.y, end.x, end.y);
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
            ctx.strokeStyle = 'green';
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.stroke();
            
            ctx.font = "10 Verdana";
            ctx.strokeStyle = 'green';
            ctx.fillStyle = 'green';
            ctx.fillText(stop.name, stopX + 5, stopY + 5);
            ctx.stroke();
        }
        
    }

    drawLegs() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")

        const legs = this.props.legs.slice();
        const stops = this.props.stops.slice();

        for (const leg of legs) {

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
            this.animateLegProgress(ctx, start.x, start.y, end.x, end.y);
        }
    }

    animateLegProgress(ctx, startX, startY, endX, endY) {
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

        let legIncrement = 1;
        let driverIncrement = 1;

        let animateLegProgress = () => {
            if (legIncrement < points.length - 1) {
                requestAnimationFrame(animateLegProgress);
            } else {
                ctx.beginPath();
                ctx.arc(points[points.length - 1].x, points[points.length - 1].y, 3.5, 0, 2 * Math.PI, false);
                ctx.strokeStyle = 'red';
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.stroke();
                this.updateServerDriverLocation();
            }
            const legProgress = Math.floor(legIncrement / points.length * 100);
            this.inputElement.value = legProgress
            this.props.socket.send(JSON.stringify({ legProgress: legProgress }));

            // draw a line segment from the last waypoint
            // to the current waypoint
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "blue";
            ctx.fillStyle = 'blue';
            ctx.lineCap = "round";
            ctx.moveTo(points[legIncrement - 1].x, points[legIncrement - 1].y);
            ctx.lineTo(points[legIncrement].x, points[legIncrement].y);
            ctx.stroke();
            legIncrement++;
        }
        let animateDriverProgress = () => {
            if (driverIncrement < points.length - 1) {
                requestAnimationFrame(animateDriverProgress);
            }
            //driver
            ctx.beginPath();
            ctx.arc(points[driverIncrement].x, points[driverIncrement].y, 1.5, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.stroke();

            driverIncrement++;
        }
        animateLegProgress();
        //animateDriverProgress();
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

        // My attempt at adding sockets
        //const legs = { ...this.props.legs };
        // this.props.socket.onmessage = function (event) {
        //     const incomingData = JSON.parse(event.data);
        //     console.log(incomingData);
        //     if (incomingData) {
        //         if (incomingData.legProgress) {
        //             this.props.driver.legProgress = incomingData.legProgress;
        //             // this.setState({
        //             //   driver:{...this.props.driver,legProgress: incomingData.legProgress}
        //             // });
        //         } else if (incomingData.activeLegID) {
        //             // this.props.driver.activeLegID = incomingData.activeLegID;
        //             const leg = legs.find(s => s.legID === incomingData.activeLegID);
        //             this.legChange(leg);
        //             //   this.setState({
        //             //     driver:{...this.props.activeLegID,activeLegID: event.data.activeLegID}
        //             //   });
        //         }
        //     }
        // };
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


