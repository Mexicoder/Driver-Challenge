import React from 'react';


function LegProgess(props) {
    return (
        <div>
        <span>Leg Progess: </span>
            <span>
                <input
                    ref={props.inputRef}
                    readOnly
                    value={props.legProgress || 0 + '%'}
                ></input>
            </span>
        </div>
    ); 
}

export default LegProgess;