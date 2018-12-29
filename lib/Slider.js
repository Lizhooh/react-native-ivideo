import React, { Component } from 'react';
import {
    Slider,
} from 'react-native';

export default class MySlider extends Component {

    static defaultProps = {
        onTouchStart: e => e,
        onTouchEnd: e => e,
    }

    constructor(props) {
        super(props);
        this.state = {
            value: props.initValue || 0,
            maximumValue: props.initMaximumValue || 0,
        }
    }

    update(value, maximumValue = this.state.maximumValue) {
        this.setState({ value, maximumValue });
    }

    render() {
        const { color } = this.props;
        const { value, maximumValue } = this.state;

        return (
            <Slider
                minimumTrackTintColor={color}
                thumbTintColor={color}
                maximumTrackTintColor='rgba(255, 255, 255, 0.55)'
                value={value}
                maximumValue={maximumValue}
                {...this.props}
            />
        );
    }
}
