import React, { Component } from 'react';
import {
    View, StyleSheet,
    Animated, Easing,
    Text, Image,
    TouchableNativeFeedback as Touch,
    Dimensions,
    ActivityIndicator,
    BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from './slider';
import TimeText from './time-text';
import store from '../store';
import Dropdown from './dropdown';

const leftArrowImage = require('../image/left-arrow.png');
const fullscreenImage = require('../image/fullscreen.png');
const nofullscreenImage = require('../image/nofullscreen.png');
const playImage = require('../image/play.png');
const pauseImage = require('../image/pause.png');
const menuImage = require('../image/menu.png');


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
        actions: [],
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
        this.data = [0, 0];
    }

    componentDidMount() {
        this.hardwareBackPress = e => {
            if (this.props.isFullscreen) {
                this.onCancelFullscreen(e);
                return true;
            }
            return false;
        }
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
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
        if (this.props.isFullscreen) {
            this._timeText1.update(...this.data);
            this._slider1.update(...this.data);
        }
        else {
            this._timeText2.update(...this.data);
            this._slider2.update(...this.data);
        }
        this.setState({ show: true });
        this.moveUp();
    }

    // 隐藏工具栏
    hide = (cb) => {
        if (this.props.actions.length > 0) {
            this._dropdown.close();
        }
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
        // 全屏后更新进度信息
        setTimeout(() => {
            this._timeText1 && this._timeText1.update(...this.data);
            this._slider1 && this._slider1.update(...this.data);
        }, 120);
    }

    onCancelFullscreen = e => {
        this.props.onCancelFullscreen(e);
        // 取消全屏后更新进度信息
        setTimeout(() => {
            this._timeText2 && this._timeText2.update(...this.data);
            this._slider2 && this._slider2.update(...this.data);
        }, 120);
    }

    updateProgress = (start, end) => {
        this.data = [start, end];
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
        this.data[0] = val;
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
            store.set(this.props.bindId, false);
        }
        else this.hide(cb);
    }

    render() {
        const { show, showLoadIcon, move } = this.state;
        const {
            showFullscreenIcon, isFullscreen,
            bindHeight, isPlay, onSlidingComplete,
            title, onPlay, onPause, toolbarSliderColor,
            actions, showBackIcon,
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
                            translateY: move.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-BAR_HEIGHT, -0],
                            }),
                        }]
                    }]}>
                    {showBackIcon &&
                        <Touch onPress={e => isFullscreen ? this.onCancelFullscreen(e) : this.onBack(e)}>
                            <View style={styles.touch}>
                                <Image source={leftArrowImage} style={styles.leftArrow} />
                            </View>
                        </Touch>
                    }
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>

                    {actions.length > 0 &&
                        <Touch onPress={e => this._dropdown.togger()}>
                            <View style={styles.dropdown}>
                                <Image
                                    source={menuImage}
                                    style={{ width: 30, height: 30 }}
                                    resizeMode='cover'
                                />
                            </View>
                        </Touch>
                    }
                </Animated.View>

                {/* 中间逻辑 */}
                <View style={styles.playWarp}>
                    <Animated.View
                        style={{
                            borderRadius: 200, overflow: 'hidden',
                            opacity: move.interpolate({
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
                                    store.set(this.props.bindId, false);  // 解锁
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

                {/* Dropdown */}
                {actions.length > 0 &&
                    <Dropdown
                        ref={r => this._dropdown = r}
                        data={actions}
                    />
                }
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
                    store.set(this.props.bindId, false);
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
        flex: 1,
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
    },
    dropdown: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
});