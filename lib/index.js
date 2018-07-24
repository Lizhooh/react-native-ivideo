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
        startFullscreen: false,
        autoPlay: false,
        actions: [],

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
        title: propTypes.string,
        startFullscreen: propTypes.bool,
        autoPlay: propTypes.bool,
        actions: propTypes.arrayOf(propTypes.object),

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

    showToolbar = e => {
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

    onBuffer = e => {
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

    onProgress = d => {
        this.data = d;
        if (this._toolbar) {
            this._toolbar.updateProgress(d.currentTime, d.seekableDuration);
        }
        this.props.onProgress(d);
    }

    onLoadStart = e => {
        if (this.props.seek > 0) {
            this._video.seek(this.props.seek);
        }
        this.props.onLoadStart(e);
    }

    onLoad = d => {
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

    onFullscreen = e => {
        this.setState({ fullscreen: true });
        this.props.onFullscreen(e);
    }

    onCancelFullscreen = e => {
        this.setState({ fullscreen: false });
        this.props.onCancelFullscreen(e);
    }

    onPlay = e => {
        this.setState({ play: true });
        this.props.onPlay(e);
    }

    onPause = e => {
        this.setState({ play: false });
        this.props.onPause(e);
    }

    onEnd = e => {
        this.setState({ play: false });
        this.props.onEnd(e);
    }

    onError = e => {
        this.props.onError(e);
    }

    onBack = e => {
        this.props.onBack(e);
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
        } = this.props;

        if (fullscreen) { // 横屏转向
            Orientation.lockToLandscape();
        }
        else {
            Orientation.unlockAllOrientations();
            Orientation.lockToPortrait();
        }

        return (
            <View style={fullscreen ? styles.fullscreen : { height, width }}>
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
                    onProgress={this.onProgress}
                    onLoadStart={this.onLoadStart}
                    onLoad={this.onLoad}
                    onBuffer={this.onBuffer}
                    onTouchStart={this.showToolbar}
                    onEnd={this.onEnd}
                    playInBackground={playInBackground}
                    muted={muted}
                    rate={rate}
                    repeat={repeat}
                    resizeMode={resizeMode}
                    useTextureView={useTextureView}
                    volume={volume}
                    onError={this.onError}
                />

                <Toolbar
                    key='toolbar'
                    ref={r => this._toolbar = r}
                    showFullscreenIcon={showFullscreenIcon}
                    isFullscreen={fullscreen}
                    onFullscreen={this.onFullscreen}
                    onCancelFullscreen={this.onCancelFullscreen}
                    bindHeight={fullscreen ? '100%' : height}
                    isPlay={play}
                    title={title}
                    onSliderChange={val => this._video.seek(val)}
                    onPlay={this.onPlay}
                    onPause={this.onPause}
                    toolbarSliderColor={toolbarSliderColor}
                    onBack={this.onBack}
                    bindId={this.id}
                    actions={actions}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fullscreen: {
        width: '100%',
        height: '100%',
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