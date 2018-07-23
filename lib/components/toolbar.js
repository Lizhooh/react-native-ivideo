import React, { Component } from 'react';
import {
    View, StyleSheet,
    Animated, Easing,
    Text, Image,
    TouchableNativeFeedback as Touch,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from './slider';
import TimeText from './time-text';
import store from '../store';

const leftArrowImage = require('../image/left-arrow.png');
const fullscreenImage = require('../image/fullscreen.png');
const nofullscreenImage = require('../image/nofullscreen.png');
const playImage = require('../image/play.png');
const pauseImage = require('../image/pause.png');

// 工具栏的高度
const BAR_HEIGHT = 45;

// 渐变颜色
const GRADIENTCOLORS = ['rgba(1, 1, 1, 0.65)', 'rgba(1, 1, 1, 0.24)', 'rgba(1, 1, 1, 0.65)'];

const window = Dimensions.get('window');

export default class Toolbar extends Component {

    static defaultProps = {
        onFullscreen: e => e,
        onCancelFullscreen: e => e,
        showFullscreenIcon: false,
        isFullscreen: false,
        bindHeight: 240,
        title: '',
        onSliderChange: val => val,
        onBack: e => e,
        onPlay: e => e,
        onPause: e => e,
    }

    constructor(props) {
        super(props);
        this.state = {
            move: new Animated.Value(0),
            show: false,
            showLoadIcon: false,
        };
        this.data = { start: 0, end: 0 };
    }

    moveDown = (cb = _ => _) => {
        Animated.timing(this.state.move, {
            toValue: 0,
            duration: 320,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(cb);
    }

    moveUp = (cb = _ => _) => {
        Animated.timing(this.state.move, {
            toValue: 1,
            duration: 320,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(cb)
    }

    // 打开工具栏
    show = (cb) => {
        // 显示的时候更新一些进度与时间的 UI
        const { start, end } = this.data;
        if (this.props.isFullscreen) {
            this._timeText1.update(start, end);
            this._slider1.update(start, end);
        }
        else {
            this._timeText2.update(start, end);
            this._slider2.update(start, end);
        }
        this.setState({ show: true });
        this.moveUp();
    }

    // 隐藏工具栏
    hide = (cb) => {
        this.moveDown(() => {
            this.setState({ show: false });
            typeof cb === 'function' && cb();
        });
    }

    isShow = () => {
        return this.state.show;
    }

    onFullscreen = e => {
        this.props.onFullscreen(e);
        setTimeout(() => {
            const { start, end } = this.data;
            this._timeText1 && this._timeText1.update(start, end);
            this._slider1 && this._slider1.update(start, end);
        }, 120);
    }

    onCancelFullscreen = e => {
        this.props.onCancelFullscreen(e);
        setTimeout(() => {
            const { start, end } = this.data;
            this._timeText2 && this._timeText2.update(start, end);
            this._slider2 && this._slider2.update(start, end);
        }, 120);
    }

    updateProgress = (start, end) => {
        this.data = { start, end };
        if (this.props.isFullscreen) {
            if (!this._$slider1 && this.state.show) {
                this._timeText1.update(start, end);
                this._slider1.update(start, end);
            }
        }
        else {
            if (!this._$slider2) {
                if (this.state.show) {
                    this._timeText2.update(start, end);
                }
                this._slider2.update(start, end);
            }
        }
    }

    onBack = e => {
        this.props.onBack(e);
    }

    onSliderChange = val => {
        if (this.props.isFullscreen) {
            this._slider1.update(val);
            this._timeText1.update(val);
        }
        else {
            this._slider2.update(val);
            this._timeText2.update(val);
        }
        this.props.onSliderChange(val);
    }

    // 显示加载图标
    showLoadIcon = (flag = false, cb) => {
        this.setState({ showLoadIcon: flag, show: flag });
        if (flag) {
            this.show(cb);
            store.set('toolbar-lock', false);
        }
        else this.hide(cb);
    }

    render() {
        const { show, showLoadIcon } = this.state;
        const {
            showFullscreenIcon, isFullscreen,
            bindHeight, isPlay, onSlidingComplete,
            title, onPlay, onPause, toolbarSliderColor,
        } = this.props;

        return [
            <LinearGradient
                key='LinearGradient'
                colors={GRADIENTCOLORS}
                style={[styles.container, {
                    height: bindHeight,
                    transform: [{ translateY: show ? 0 : -1000 }]
                }]}>

                {/* 顶部栏逻辑 */}
                <Animated.View
                    style={[styles.bar, {
                        paddingLeft: 0,
                        transform: [{
                            translateY: this.state.move.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-BAR_HEIGHT, -0],
                            }),
                        }]
                    }]}>
                    <Touch onPress={e => {
                        if (isFullscreen) this.onCancelFullscreen(e);
                        else this.onBack(e);
                    }}>
                        <View style={styles.touch}>
                            <Image source={leftArrowImage} style={styles.leftArrow} />
                        </View>
                    </Touch>
                    <Text style={styles.title}>{title}</Text>
                </Animated.View>

                {/* 中间逻辑 */}
                <View style={styles.playWarp}>
                    <Animated.View
                        style={{
                            borderRadius: 200, overflow: 'hidden',
                            opacity: this.state.move.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                            })
                        }}>
                        {showLoadIcon ? <ActivityIndicator color='#fff' size='large' /> : isPlay ?
                            <Touch onPress={onPause}>
                                <Image
                                    source={pauseImage}
                                    style={isFullscreen ? styles.maxPlay : styles.play}
                                />
                            </Touch> :
                            <Touch onPress={onPlay}>
                                <Image
                                    source={playImage}
                                    style={isFullscreen ? styles.maxPlay : styles.play}
                                />
                            </Touch>
                        }
                    </Animated.View>
                </View>

                {/* 底部栏逻辑 */}
                <Animated.View
                    style={[styles.bar, {
                        transform: [{
                            translateY: this.state.move.interpolate({
                                inputRange: [0, 1],
                                outputRange: [BAR_HEIGHT, 0],
                            }),
                        }]
                    }]}>

                    {isFullscreen ?
                        <View style={styles.slider1Warp}>
                            <TimeText ref={r => this._timeText1 = r} />
                            <Slider
                                style={styles.slider1}
                                showThumb={true}
                                ref={r => this._slider1 = r}
                                onValueChange={val => this._timeText1.update(val)}
                                onTouchStart={e => {
                                    this._$slider1 = true;
                                    store.set('toolbar-lock', false);  // 解锁
                                }}
                                onTouchEnd={e => this._$slider1 = false}
                                onSlidingComplete={this.onSliderChange}
                                color={toolbarSliderColor}
                            />
                        </View> :
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <TimeText ref={r => this._timeText2 = r} />
                        </View>
                    }

                    {showFullscreenIcon && (isFullscreen ?
                        <Touch onPress={this.onCancelFullscreen}>
                            <View style={styles.touch}>
                                <Image source={nofullscreenImage} style={styles.nofullscreen} />
                            </View>
                        </Touch> :
                        <Touch onPress={this.onFullscreen}>
                            <View style={styles.touch}>
                                <Image source={fullscreenImage} style={styles.fullscreen} />
                            </View>
                        </Touch>
                    )}
                </Animated.View>
            </LinearGradient>,
            !isFullscreen &&
            <Slider
                key='Slider2'
                style={styles.slider2}
                showThumb={show}
                onSlidingComplete={onSlidingComplete}
                ref={r => this._slider2 = r}
                onValueChange={val => this._timeText2.update(val)}
                onTouchStart={e => {
                    this._$slider2 = true;
                    store.set('toolbar-lock', false);
                }}
                onTouchEnd={e => this._$slider2 = false}
                onSlidingComplete={this.onSliderChange}
                color={toolbarSliderColor}
            />,
        ];
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0, right: 0, left: 0,
        zIndex: 1,
    },
    bar: {
        height: BAR_HEIGHT,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    leftArrow: {
        width: 22, height: 22,
        marginRight: 6,
        resizeMode: 'cover',
    },
    title: {
        color: '#fff',
        textAlignVertical: 'center',
        top: -1,
        fontSize: 16,
        textShadowColor: 'rgba(1, 1, 1, 0.12)',
        textShadowOffset: {
            width: 1.2,
            height: 0.8,
        },
        textShadowRadius: 1.2
    },
    fullscreen: {
        top: 2,
        width: 17,
        height: 17,
        resizeMode: 'cover',
    },
    nofullscreen: {
        top: 2,
        width: 25,
        height: 25,
        resizeMode: 'cover',
    },
    slider1: {
        width: '85%',
        padding: 0,
        margin: 0,
    },
    slider2: {
        position: 'absolute',
        bottom: -9,
        left: -8,
        padding: 0,
        margin: 0,
        width: window.width + 16,
        zIndex: 1,
    },
    slider1Warp: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 16,
    },
    playWarp: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    play: {
        height: 43,
        width: 43,
        backgroundColor: 'rgba(1, 1, 1, 0.36)',
    },
    maxPlay: {
        height: 55,
        width: 55,
        backgroundColor: 'rgba(1, 1, 1, 0.36)',
    },
    touch: {
        borderRadius: 20,
        padding: 5,
    }
});