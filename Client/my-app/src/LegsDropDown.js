import React from 'react';


class LegsDropDown extends React.Component {


    // legOptions(){
    //     let legs = [];
    //     for (const leg of this.props.legs) {
    //         legs.push((
    //             <option
    //                 key={leg.legID}
    //                 value={leg.legID}>
    //                 {leg.legID}
    //             </option>
    //         ));
    //     }
    //     return legs;
    // }

    render() {
        return (
            <div>
                <div>
                    <select
                        value={this.props.selectedLeg}
                        onChange={()=>this.props.onChange()}
                    >
                        {this.legOptions()}
                    </select>
                </div>
                <div>
                    <input readOnly value={this.props.driver.legProgress + '%'}></input>
                </div>
            </div>
        );
    }
}

export default LegsDropDown;