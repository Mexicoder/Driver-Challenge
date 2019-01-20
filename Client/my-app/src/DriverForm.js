import React from 'react';


class DriverForm extends React.Component {
   
    render() {

        let legs = [];
        for (const leg of this.props.legs) {
            let isSelected = '';
            if (this.props.driver.activeLegID === leg.legID) {
                isSelected = 'selected';
            }
            legs.push((
                <option
                    key={leg.legID}
                    selected={isSelected}>
                    {leg.legID}
                </option>
            ));
        }

        return (
            <div>
                <div>
                    <select>
                        {legs}
                    </select>
                </div>
                <div>
                    <input readonly value={this.props.driver.legProgress + '%'}></input>
                </div>
            </div>
        );
    }
}

export default DriverForm;