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
        }
    }

    drawLeg(x1,y1,x2,y2){
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")

        const start = {
            x:x1*this.state.cellWidth+this.state.offset,
            y:y1*this.state.cellWidth+this.state.offset,
        }
        const end = {
            x:x2*this.state.cellWidth+this.state.offset,
            y:y2*this.state.cellWidth+this.state.offset,
        }

        ctx.beginPath();
        ctx.moveTo(start.x,start.y);
        ctx.lineTo(end.x,end.y);
        ctx.strokeStyle='red';
        ctx.stroke();
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
                <button onClick={() => this.drawLeg(20, 10, 10, 10)}>draw leg</button>
                <canvas
                    ref='canvas'
                    width='1000'
                    height='1000'>
                </canvas>
            </div>
        );
        // onClick={showCoords(event)}
    }

}

export default CanvasGrid;
