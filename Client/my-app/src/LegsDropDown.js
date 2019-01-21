import React from 'react';


class LegsDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLeg: null,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ selectedLeg: event.target.value });
        const leg = this.props.legs.find((l => l.legID === event.target.value));
        this.props.onChange(leg);
    }

    render() {

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

        return (
            <div>
                <select
                    value={this.state.selectedLeg || this.props.driver.activeLegID}
                    onChange={this.handleChange}
                >
                    {legs}
                </select>
            </div>
        );
    }
}

export default LegsDropDown;