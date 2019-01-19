import React from 'react';

function Leg(props) {
    return (
        <button
            className="coord"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

export default Leg;
