import React, { Component } from 'react';
import styled from 'styled-components/native';

const cache = [];
const ft = n => n < 10 ? '0' + n : n;

for (let i = 0; i < 3600; i++) {
    cache[i] = `${ft(i / 60 % 60 | 0)}:${ft(i % 60)}`;
}

// 时间格式化
function formatTime(time) {
    time = Math.round(time);
    if (cache[time]) {
        return cache[time];
    }
    else {
        let res = '00:00';
        if (time >= 3600) {
            res = `${ft(time / 3600 % 60 | 0)}:${ft(time / 60 % 60 | 0)}:${ft(time % 60)}`;
        }
        else {
            res = `${ft(time / 60 % 60 | 0)}:${ft(time % 60)}`;
        }
        cache[time] = res;
        return res;
    }
}

// 显示时间的文本
export default class TimeText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: this.props.start || 0,
            end: this.props.end || 0,
        };
    }

    update(start, end = this.state.end) {
        this.setState({ start, end: end });
    }

    render() {
        const { start, end } = this.state;
        return (
            <Root>
                <Time>{formatTime(start)}</Time>
                <FTime>/{formatTime(end)}</FTime>
            </Root>
        );
    }
}

const Root = styled.View`
    flex-direction: row;
    align-items: center;
`;

const Time = styled.Text`
    color: #fff;
    font-size: 12px;
    top: -1px;
    text-shadow: 1.2px 1.8px 1.2px rgba(1, 1, 1, 0.12);
`;

const FTime = styled.Text`
    color: #ccc;
    font-size: 12px;
    top: -1px;
    text-shadow: 1.2px 1.8px 1.2px rgba(1, 1, 1, 0.12);
`;
