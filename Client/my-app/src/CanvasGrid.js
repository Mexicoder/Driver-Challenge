import React from 'react';
import DriverForm from './DriverForm';
// import LegsDropDown from './LegsDropDown';


class CanvasGrid extends React.Component {
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

    legOptions(){
        let legs = [];
        for (const leg of this.props.legs) {
            legs.push((
                <option
                    key={leg.legID}
                    value={leg.legID}>
                    {leg.legID}
                </option>
            ));
        }
        return legs;
    }

    legChange(leg) {
        console.log(leg);
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

    drawDriverDriving() {
        // const canvas = this.refs.canvas;
        // const ctx = canvas.getContext("2d");
        // const radius = 3;
        // const stops = this.props.stops.slice();
        // const driverLeg = { ...this.props.driver }.activeLegID.split();

        // // const driverX = stops.find(stop => stop.name === driverLeg[0]);
        // // const driverY = stops.find(stop => stop.name === driverLeg[1]);


        // const driverX = stop[0].x + this.state.offset;
        // const driverY = stop[0].y + this.state.offset;

        // ctx.beginPath();
        // ctx.arc(stopX, stopY, radius, 0, 2 * Math.PI, false);
        // ctx.fillStyle = 'pink';
        // ctx.fill();
        // ctx.stroke();
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
        let amount = 0;
        let interval = setInterval(function () {
            let movedX = Math.floor(startX + (endX - startX) * amount);
            let movedY = Math.floor(startY + (endY - startY) * amount);
            // stop drawing
            if(movedY >= endY)
            if(movedX >= endX)
            if(movedY <= endY)
            if(movedX <= endX)
            if (movedX === endX && movedY === endY) {
                clearInterval(interval);
            }
            ctx.beginPath();
            amount += 0.01;
            ctx.strokeStyle = "purple";
            ctx.moveTo(startX, startY);
            ctx.lineTo(movedX, movedY);
            ctx.stroke();
        }, 10);
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
                    {/* <div>
                        <select
                            value={this.selectedLeg}
                            onChange={this.legChange}
                        >
                            {this.legOptions()}
                        </select>
                    </div>
                    <div>
                        <input readOnly value={this.props.driver.legProgress + '%'}></input>
                    </div> */}
                    {/* <LegsDropDown
                    legs={this.props.legs}
                        driver={this.props.driver}
                        onChange={()=>{this.legChange();}}
                        options={() =>{this.legOptions()}}
                    /> */}
                    <DriverForm
                        legs={this.props.legs}
                        driver={this.props.driver}
                        onChange={this.legChange}
                    />
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
                    <button onClick={() => { this.drawDriverDriving() }}>drawDriverDriving</button>
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

export default CanvasGrid;
