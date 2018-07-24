import React, { Component } from 'react';
import {
    View, Text,
    StyleSheet,
    TouchableNativeFeedback as Touch,
    Animated,
} from 'react-native';

export default class DropDown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dropdown: new Animated.Value(0),
        };
        this.show = false;
    }

    open = () => {
        Animated.timing(this.state.dropdown, {
            toValue: 1,
            duration: 240,
        }).start();
        this.show = true;
    }

    close = () => {
        Animated.timing(this.state.dropdown, {
            toValue: 0,
            duration: 240,
        }).start();
        this.show = false;
    }

    togger = () => {
        this.show ? this.close() : this.open();
    }

    render() {
        const { data = [] } = this.props;
        const { dropdown } = this.state;

        return (
            <Animated.View style={[styles.container, {
                transform: [{
                    translateX: dropdown.interpolate({
                        inputRange: [0, 1],
                        outputRange: [220, 0],
                    })
                }]
            }]}>
                {data.map((item, index) => (
                    <Touch
                        key={index}
                        onPress={e => {
                            typeof item.onPress === 'function' && item.onPress();
                        }}
                        onPressOut={this.close}>
                        <View style={[styles.item, index > 0 && styles.line]}>
                            <Text style={styles.text}>dadas</Text>
                        </View>
                    </Touch>
                ))}
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute', right: 20, top: 40, width: 150,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderColor: 'rgba(1, 1, 1, 0.12)',
        borderWidth: 1,
        borderRadius: 2,
    },
    item: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    text: {
        color: '#333',
    },
    line: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
    }
});