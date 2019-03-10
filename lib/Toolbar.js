import React, { Component } from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import {
    TouchableOpacity as Touch,
    BackHandler, Text
} from 'react-native';
import TimeText from './TimeText';
import Slider from './Slider';
import { Image } from './index';

const PlayIcon = require('./image/play.png');
const PauseIcon = require('./image/pause.png');
const BackIcon = require('./image/left-arrow.png');
const FullscreenIcon = require('./image/fullscreen.png');
const NofullscreenIcon = require('./image/nofullscreen.png');
const MenuIcon = require('./image/menu.png');


export default class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            showActions: false,
            start: 0,
            end: 0,
        };
        this._$slider = false;
    }

    update = (start, end = this.state.end) => {
        this.setState({ start, end });
        if (this._$slider === false) {
            this.timetext && this.timetext.update(start, end);
            this.slider && this.slider.update(start, end);
        }
    }

    show = (flag = true) => {
        this.setState({ show: flag });
        if (flag) {
            this.waitHide();
        }
        if (!flag) {
            this.setState({ showActions: false });
        }
    }

    onPause = e => {
        this.props.onPause();
    }

    onPlay = e => {
        this.props.onPlay();
    }

    waitHide = () => {
        clearTimeout(this._timer1);
        this._timer1 = setTimeout(() => {
            if (this._$slider) return;
            this.show(false);
        }, this.props.toolbarDuration);
    }

    onSlidingComplete = val => {
        this.props.onSlidingComplete(val);
        this.waitHide();
    }

    onBack = e => {
        this.props.onBack();
        if (this.props.isFullscreen) {
            this.props.onCancelFullscreen(e);
        }
    }

    onMenu = e => {
        this.setState({ showActions: !this.state.showActions });
    }

    componentDidMount() {
        this.hardwareBackPress = e => {
            if (this.props.isFullscreen) {
                this.props.onCancelFullscreen(e);
                return true;
            }
            return false;
        }
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    render() {
        const {
            gradientColor,
            status,  // 1 显示播放，2 显示暂停，0 不显示
            toolbarSliderColor,
            showBackIcon,
            isFullscreen,
            onFullscreen,
            onCancelFullscreen,
            title = '',
            showFullscreenIcon,
            actions = [],
        } = this.props;
        const { show, start, end, showActions } = this.state;

        if (!show) return null;

        return (
            <Root colors={gradientColor}>
                <Header style={{ paddingTop: isFullscreen ? 25 : 0 }}>
                    {showBackIcon &&
                        <IconButton activeOpacity={0.7} onPress={this.onBack}>
                            <Image source={BackIcon} style={{ width: 25, height: 25 }} />
                        </IconButton>
                    }
                    <Title>{title}</Title>
                    {actions.length > 0 &&
                        <IconButton activeOpacity={0.7} onPress={this.onMenu}>
                            <Image source={MenuIcon} style={{ width: 25, height: 25 }} />
                        </IconButton>
                    }
                </Header>
                <Panel activeOpacity={1} onPress={e => this.show(false)}>
                    {status === 1 && <Touch activeOpacity={0.7} onPress={this.onPlay}
                        style={{ borderRadius: 100, backgroundColor: 'rgba(1, 1, 1, 0.36)' }}>
                        <IPlay source={PlayIcon} />
                    </Touch>}
                    {status === 2 && <Touch activeOpacity={0.7} onPress={this.onPause}
                        style={{ borderRadius: 100, backgroundColor: 'rgba(1, 1, 1, 0.36)' }}>
                        <IPlay source={PauseIcon} />
                    </Touch>}
                </Panel>
                <Footer>
                    <TimeText start={start} end={end} ref={r => this.timetext = r} />
                    <Slider
                        initValue={start}
                        initMaximumValue={end}
                        color={toolbarSliderColor}
                        onValueChange={val => this.timetext.update(val)}
                        onSlidingComplete={this.onSlidingComplete}
                        onTouchStart={e => this._$slider = true}
                        onTouchEnd={e => this._$slider = false}
                        style={{ flex: 1 }}
                        ref={r => this.slider = r}
                    />
                    {showFullscreenIcon && !isFullscreen &&
                        <IconButton activeOpacity={0.7} onPress={onFullscreen}>
                            <Image source={FullscreenIcon} style={{ width: 18, height: 18 }} />
                        </IconButton>
                    }
                    {showFullscreenIcon && isFullscreen &&
                        <IconButton activeOpacity={0.7} onPress={onCancelFullscreen}>
                            <Image source={NofullscreenIcon} style={{ width: 25, height: 25 }} />
                        </IconButton>
                    }
                </Footer>

                {showActions &&
                    <ActionsPanel>
                        {actions.map((item, index) => (
                            <ActionsItem key={index} activeOpacity={0.7}
                                onPress={e => {
                                    item.onPress(item);
                                    this.setState({ showActions: false });
                                }}>
                                <ActionsText numberOfLines={1}>
                                    {item.text}
                                </ActionsText>
                            </ActionsItem>
                        ))}
                    </ActionsPanel>
                }
            </Root>
        );
    }
}

Toolbar.defaultProps = {
    onBack: e => e,
    onSlidingComplete: e => e,
    onPlay: e => e,
    onPause: e => e,
    onFullscreen: e => e,
    onCancelFullscreen: e => e,
    showBackIcon: false,
    gradientColor: [],
    status: 1,
    title: '',
    toolbarDuration: 1000 * 6,
    toolbarSliderColor: '#39f',
    isFullscreen: false,
    showFullscreenIcon: false,
    actions: [],
};

const Root = styled(LinearGradient)`
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: absolute;
    z-index: 100;
`;

const Panel = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    flex: 1;
`;

const Header = styled.View`
    height: 45px;
    flex-direction: row;
    align-items: center;
`;

const Footer = styled.View`
    height: 45px;
    flex-direction: row;
    align-items: center;
    padding-left: 12px;
`;

const IPlay = styled.Image`
    width: 40px;
    height: 40px;
    border-radius: 40px;
`;

const Title = styled.Text`
    font-size: 16px;
    color: #fff;
    text-shadow: 1px 2px 2px rgba(1, 1, 1, 0.12);
    top: -1px;
    flex: 1;
`;

const IconButton = styled.TouchableOpacity`
    width: 45px;
    height: 45px;
    justify-content: center;
    align-items: center;
`;

const ActionsPanel = styled.View`
    margin: 0 12px;
    background-color: #fff;
    elevation: 8px;
    width: 160px;
    position: absolute;
    z-index: 115;
    top: 45px;
    right: 10px;
`;

const ActionsItem = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding: 10px 12px;
    border-bottom-width: 0.5px;
    border-bottom-color: #eee;
`;

const ActionsText = styled.Text`
    font-size: 15px;
    color: #444;
`;