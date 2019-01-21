import React from 'react';
import LegsDropDown from './LegsDropDown';
import LegProgess from './LegProgess';


class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        if (this.state.driver.activeLegID !== undefined) {
            fetch("http://localhost:8000/driver", {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state.driver),
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
    }

    legChange(leg) {
        this.setState({ driver: { activeLegID: leg.legID, legProgress: 0 } });
        this.props.socket.send(JSON.stringify({ activeLegID: leg.legID }));

        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")

        const stops = this.props.stops.slice();

        const startStop = stops.find(stop => stop.name === leg.startStop);
        const endStop = stops.find(stop => stop.name === leg.endStop);

        const start = {
            x: startStop.x * this.state.scale,
            y: startStop.y * this.state.scale,
        }
        const end = {
            x: endStop.x * this.state.scale,
            y: endStop.y * this.state.scale,
        }

        this.animateLegProgress(ctx, start.x, start.y, end.x, end.y);
    }

    drawStops() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        const radius = 2.5;
        const stops = this.props.stops.slice();

        for (const stop of stops) {
            const stopX = stop.x * this.state.scale;
            const stopY = stop.y * this.state.scale;

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
                x: startStop.x * this.state.scale,
                y: startStop.y * this.state.scale,
            }
            const end = {
                x: endStop.x * this.state.scale,
                y: endStop.y * this.state.scale,
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

        for (var x = 0; x < this.state.canvasWidth; x += this.state.cellWidth) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, width);
        }
        for (var y = 0; y < this.state.canvasHeight; y += this.state.cellWidth) {
            ctx.moveTo(0, y);
            ctx.lineTo(height, y);
        }
        ctx.strokeStyle = 'grey';
        ctx.stroke();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.driver === nextState.driver) {
            return true;
        }
        return false;
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


