import React from 'react';


function LegProgess(props) {
    return (
        <input
            ref={props.inputRef}
            readOnly
            value={props.legProgress || 0 + '%'}
        ></input>
    ); 
}

export default LegProgess;