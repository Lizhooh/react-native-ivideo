import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import Toolbar from './components/toolbar';
import store from './store';
import propTypes from 'prop-types';

export default class IVideo extends Component {

    static defaultProps = {
        toolbarDuration: 1000 * 6,
        toolbarSliderColor: '#f90',
        width: '100%',
        height: 240,
        title: '',
        showFullscreenIcon: false,
        showBackIcon: true,
        startFullscreen: false,
        autoPlay: false,
        actions: [],
        gradientColor: ['rgba(1, 1, 1, 0.45)', 'rgba(1, 1, 1, 0.24)', 'rgba(1, 1, 1, 0.45)'],

        // video props
        source: {},
        progressUpdateInterval: 500,
        playInBackground: false,
        muted: false,
        rate: 1.0,
        repeat: false,
        resizeMode: 'cover',
        useTextureView: false,
        volume: 1.0,
        seek: 0,

        onProgress: d => d,
        onBuffer: d => d,
        onLoad: d => d,
        onFullscreen: e => e,
        onCancelFullscreen: e => e,
        onPlay: e => e,
        onPause: e => e,
        onEnd: e => e,
        onLoadStart: d => d,
        onError: e => e,
        onBack: e => e,
    };

    static propTypes = {
        toolbarDuration: propTypes.number,
        width: propTypes.oneOfType([propTypes.number, propTypes.string]).isRequired,
        height: propTypes.oneOfType([propTypes.number, propTypes.string]).isRequired,
        showFullscreenIcon: propTypes.bool,
        showBackIcon: propTypes.bool,
        title: propTypes.string,
        startFullscreen: propTypes.bool,
        autoPlay: propTypes.bool,
        actions: propTypes.arrayOf(propTypes.object),
        gradientColor: propTypes.arrayOf(propTypes.string),

        source: propTypes.object.isRequired,
        progressUpdateInterval: propTypes.number,
        playInBackground: propTypes.bool,
        muted: propTypes.bool,
        resizeMode: propTypes.oneOf(['none', 'contain', 'cover', 'stretch']),
        rate: propTypes.number,
        repeat: propTypes.bool,
        useTextureView: propTypes.bool,
        volume: propTypes.number,
        seek: propTypes.number,

        onProgress: propTypes.func,
        onBuffer: propTypes.func,
        onLoad: propTypes.func,
        onFullscreen: propTypes.func,
        onCancelFullscreen: propTypes.func,
        onPlay: propTypes.func,
        onPause: propTypes.func,
        onEnd: propTypes.func,
        onLoadStart: propTypes.func,
        onError: propTypes.func,
        onBack: propTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            fullscreen: props.startFullscreen,
            play: props.autoPlay,
        };
        this.bufferLoadCount = 0;
        this.data = {
            currentTime: 0,
            playableDuration: 0,
            seekableDuration: 0,
        };
        this.id = Math.random().toString().slice(2);
    }

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.source === 'object' &&
            typeof this.props.source === 'object') {
            // uri 改变时重置播放进度
            if (nextProps.source.uri !== this.props.source.uri) {
                this._toolbar.updateProgress(0, 0);
                this.bufferLoadCount = 0;
                this.data = {
                    currentTime: 0,
                    playableDuration: 0,
                    seekableDuration: 0,
                };
            }
        }

        this.setState({
            play: nextProps.autoPlay,
            startFullscreen: nextProps.startFullscreen
        });
    }

    _showToolbar = e => {
        // 点击出现工具栏。
        if (store.get(this.id) !== true) {
            clearTimeout(this._timer);
            this._timer = null;
            store.set(this.id, true);
            this._toolbar && this._toolbar.show();
            this._timer = setTimeout(() => {
                this._timer = null;
                if (this._toolbar && this._toolbar.isShow()) {
                    if (store.get(this.id)) {
                        this._toolbar.hide(() => {
                            store.set(this.id, false);
                        });
                    }
                }
            }, this.props.toolbarDuration);
        }
    }

    _onBuffer = e => {
        this.bufferLoadCount++;
        if (this.bufferLoadCount % 2 === 1) {
            // 加载开始
            this._toolbar && this._toolbar.showLoadIcon(true);
        }
        else {
            // 加载结束
            this._toolbar && this._toolbar.showLoadIcon(false, () => {
                store.set(this.id, false);
            });
        }
        this.props.onBuffer(e);
    }

    _onProgress = d => {
        this.data = d;
        if (this._toolbar) {
            this._toolbar.updateProgress(d.currentTime, d.seekableDuration);
        }
        this.props.onProgress(d);
    }

    _onLoadStart = e => {
        if (this.props.seek > 0) {
            this._video.seek(this.props.seek);
        }
        this.props.onLoadStart(e);
    }

    _onLoad = d => {
        if (this._toolbar) {
            this._toolbar.updateProgress(d.currentTime, d.duration);
            if (this._toolbar.isShow()) {
                this._toolbar.showLoadIcon(false, () => {
                    store.set(this.id, false);
                });
            }
        }
        this.props.onLoad(d);
    }

    _onFullscreen = e => {
        this.setState({ fullscreen: true });
        this.props.onFullscreen(e);
    }

    _onCancelFullscreen = e => {
        this.setState({ fullscreen: false });
        this.props.onCancelFullscreen(e);
    }

    _onPlay = e => {
        this.setState({ play: true });
        this.props.onPlay(e);
    }

    _onPause = e => {
        this.setState({ play: false });
        this.props.onPause(e);
    }

    _onEnd = e => {
        this.setState({ play: false });
        this.props.onEnd(e);
    }

    _onError = e => {
        this.props.onError(e);
    }

    _onBack = e => {
        this.props.onBack(e);
    }

    play() {
        this.setState({ play: true });
    }

    pause() {
        this.setState({ play: false });
    }

    seek(val) {
        if (this._video) {
            this._video.seek(val);
        }
    }

    replay() {
        if (this._video) {
            this._video.seek(0);
            this.play();
        }
    }

    render() {
        const { fullscreen, play } = this.state;
        const {
            source, height,
            width, progressUpdateInterval,
            showFullscreenIcon, title,
            toolbarSliderColor,
            playInBackground,
            muted, rate, repeat,
            resizeMode,
            useTextureView,
            volume, actions,
            showBackIcon,
            gradientColor,
        } = this.props;

        if (fullscreen) { // 横屏转向
            Orientation.lockToLandscape();
        }
        else {
            Orientation.unlockAllOrientations();
            Orientation.lockToPortrait();
        }

        return (
            <View style={fullscreen ? styles.fullscreen : { height, width, backgroundColor: '#333' }}>
                {fullscreen &&
                    <StatusBar
                        animated={true}
                        translucent={fullscreen}
                        backgroundColor='rgba(1, 1, 1, 0)'
                        StatusBarAnimation='fade'
                        hidden={fullscreen}
                    />
                }

                <Video
                    source={source}
                    style={fullscreen ? styles.fullscreen : [styles.video, { height, width }]}
                    ref={r => this._video = r}
                    paused={!play}
                    progressUpdateInterval={progressUpdateInterval}
                    onProgress={this._onProgress}
                    onLoadStart={this._onLoadStart}
                    onLoad={this._onLoad}
                    onBuffer={this._onBuffer}
                    onTouchStart={this._showToolbar}
                    onEnd={this._onEnd}
                    playInBackground={playInBackground}
                    muted={muted}
                    rate={rate}
                    repeat={repeat}
                    resizeMode={resizeMode}
                    useTextureView={useTextureView}
                    volume={volume}
                    onError={this._onError}
                />

                <Toolbar
                    key='toolbar'
                    ref={r => this._toolbar = r}
                    showFullscreenIcon={showFullscreenIcon}
                    isFullscreen={fullscreen}
                    onFullscreen={this._onFullscreen}
                    onCancelFullscreen={this._onCancelFullscreen}
                    bindHeight={fullscreen ? '100%' : height}
                    isPlay={play}
                    title={title}
                    onSliderChange={val => this._video.seek(val)}
                    onPlay={this._onPlay}
                    onPause={this._onPause}
                    toolbarSliderColor={toolbarSliderColor}
                    onBack={this._onBack}
                    bindId={this.id}
                    actions={actions}
                    showBackIcon={showBackIcon}
                    gradientColor={gradientColor}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fullscreen: {
        width: '100%',
        height: '100%',
        backgroundColor: '#333',
    },
    video: {
        width: '100%',
        backgroundColor: '#111',
    },
    textShoadow: {
        textShadowColor: 'rgba(1, 1, 1, 0.2)',
        textShadowOffset: {
            width: 1.2,
            height: 1.8,
        },
        textShadowRadius: 1.2,
        color: '#fff',
    },
});