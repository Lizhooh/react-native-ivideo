import React, { Component } from 'react';
import {
    Slider,
} from 'react-native';

export default class MySlider extends Component {

    static defaultProps = {
        showThumb: true,
        onTouchStart: e => e,
        onTouchEnd: e => e,
    }

    constructor(props) {
        super(props);
        this.state = {
            _showThumb: false,
            value: props.value || 0,
            maximumValue: props.maximumValue || 0,
        }
    }

    update(value, maximumValue = this.state.maximumValue) {
        this.setState({ value, maximumValue });
    }

    onTouchStart = e => {
        !this.props.showThumb && this.setState({ _showThumb: true });
        this.props.onTouchStart();
    }

    onTouchEnd = e => {
        !this.props.showThumb && this.setState({ _showThumb: false });
        this.props.onTouchEnd();
    }

    render() {
        const { showThumb, onTouchStart, onTouchEnd, color, ...rest } = this.props;
        const { _showThumb, value, maximumValue } = this.state;

        return (
            <Slider
                minimumTrackTintColor={color}
                maximumTrackTintColor='rgba(255, 255, 255, 0.55)'
                thumbTintColor={_showThumb ? color : showThumb ? color : 'rgba(1, 1, 1, 0)'}
                value={value}
                maximumValue={maximumValue}
                onTouchStart={this.onTouchStart}
                onTouchEnd={this.onTouchEnd}
                {...rest}
            />
        );
    }
}
