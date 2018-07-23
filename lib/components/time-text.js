import React, { Component } from 'react';
import {
    Text, StyleSheet, View
} from 'react-native';

// 时间格式化
function formatTime(time) {
    time = Math.round(time);
    const ft = n => n < 10 ? '0' + n : n;
    if (!formatTime.cache) {
        formatTime.cache = {};
    }
    if (formatTime.cache[time]) {
        return formatTime.cache[time];
    }
    else {
        const res = `${ft(time / 60 % 60 | 0)}:${ft(time % 60)}`;
        formatTime.cache[time] = res;
        return res;
    }
}

// 显示时间的文本
export default class TimeText extends Component {

    constructor(props) {
        super(props);
        this.state = {
            start: props.start || 0,
            end: props.end || 0,
        }
    }

    update(start, end = this.state.end) {
        this.setState({ start, end: end });
    }

    render() {
        const { start, end } = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.time}>{formatTime(start)}</Text>
                <Text style={styles.ftime}>/</Text>
                <Text style={styles.ftime}>{formatTime(end)}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    time: {
        color: '#fff',
        fontSize: 12,
        top: -1,
        textShadowColor: 'rgba(1, 1, 1, 0.12)',
        textShadowOffset: {
            width: 1.2,
            height: 1.8,
        },
        textShadowRadius: 1.2
    },
    ftime: {
        color: '#ccc',
        fontSize: 12,
        top: -1,
        textShadowColor: 'rgba(1, 1, 1, 0.12)',
        textShadowOffset: {
            width: 1.2,
            height: 1.8,
        },
        textShadowRadius: 1.2
    }
});