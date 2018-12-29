import React, { Component } from 'react';
import styled from 'styled-components/native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import Toolbar from './Toolbar';
import propTypes from 'prop-types';
import {
    ActivityIndicator,
    StatusBar,
    Image,
    TouchableOpacity as Touch,
    Dimensions,
} from 'react-native';

const window = Dimensions.get('window');

const W = window.width;
const H = window.height;

const AgainIcon = require('./image/again.png');

export default class IVideo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            play: false,
            isEnd: false,
            isFullscreen: this.props.startFullscreen || false,
            loading: false,
            naturalSize: null,
        };
        bufferLoadCount = 0;
    }

    _onBuffer = e => {
        this.bufferLoadCount++;
        if (this.bufferLoadCount % 2 === 1) {
            // 加载开始 - 显示加载 icon
            this.setState({ loading: true });
        }
        else {
            // 加载结束 - 关闭加载 icon
            this.setState({ loading: false });
        }
        this.props.onBuffer(e);
    }

    _onLoadStart = e => {
        // 转跳到指定位置
        this.setState({ loading: true });
        if (this.props.seek > 0) {
            this._video.seek(this.props.seek);
        }
        this.props.onLoadStart(e);
    }

    _onLoad = d => {
        // 更新进度
        console.log(d);
        this.setState({ loading: false, naturalSize: d.naturalSize });
        this.toolbar.update(d.currentTime, d.duration);
        this.props.onLoad(d);
    }

    _onProgress = d => {
        // 更新进度
        this.toolbar.update(d.currentTime, d.duration);
        this.props.onProgress(d);
    }

    _onFullscreen = e => {
        this.setState({ isFullscreen: true });
        this.props.onFullscreen(e);
    }

    _onCancelFullscreen = e => {
        this.setState({ isFullscreen: false });
        this.props.onCancelFullscreen(e);
    }

    _onPlay = e => {
        if (this.state.isEnd) {
            this._video && this._video.seek(0);
            clearTimeout(this._timer1);
            this._timer1 = setTimeout(() => {
                this.setState({ isEnd: false, play: true });
                this.toolbar.update(0);
            }, 360);
        }
        else {
            this.setState({ play: true });
            this.props.onPlay(e);
        }
    }

    _onPause = e => {
        this.setState({ play: false });
        this.props.onPause(e);
    }

    _onEnd = e => {
        this.setState({ play: false, isEnd: true });
        this.props.onEnd(e);
    }

    _onError = e => {
        this.props.onError(e);
    }

    _onBack = e => {
        this.props.onBack(e);
    }

    _onTouchEnd = e => {
        this.toolbar.show();
    }

    render() {
        const { isFullscreen, play, isEnd, loading, naturalSize } = this.state;
        const {
            source,
            width, height,
            progressUpdateInterval,
            toolbarSliderColor,
            toolbarDuration,
            playInBackground,
            muted, rate, repeat,
            resizeMode,
            useTextureView,
            volume, actions,
            showBackIcon,
            gradientColor,
            showFullscreenIcon, title,
        } = this.props;
        let w = width, h = height;

        if (isFullscreen) {
            StatusBar.setHidden(true);
            // 横屏视频
            if (naturalSize && naturalSize.orientation === 'landscape') {
                h = W;
                w = H;
                Orientation.lockToLandscape();
            }
            // 竖屏视频
            else {
                h = H;
                w = W;
                Orientation.lockToPortrait();
            }
        }
        else {
            Orientation.unlockAllOrientations();
            Orientation.lockToPortrait();
            StatusBar.setHidden(false);
        }

        return (
            <Root isFullscreen={isFullscreen} style={{ width: w, height: h }}>
                <Video
                    source={source}
                    ref={r => this._video = r}
                    paused={!play}
                    progressUpdateInterval={progressUpdateInterval}
                    playInBackground={playInBackground}
                    muted={muted}
                    rate={rate}
                    repeat={repeat}
                    resizeMode={resizeMode}
                    useTextureView={useTextureView}
                    volume={volume}
                    style={{ width: '100%', height: '100%' }}
                    onProgress={this._onProgress}
                    onLoadStart={this._onLoadStart}
                    onLoad={this._onLoad}
                    onBuffer={this._onBuffer}
                    onEnd={this._onEnd}
                    onError={this._onError}
                    onTouchEnd={this._onTouchEnd}
                />

                <Toolbar
                    ref={r => this.toolbar = r}
                    title={title}
                    showFullscreenIcon={showFullscreenIcon}
                    gradientColor={gradientColor}
                    toolbarSliderColor={toolbarSliderColor}
                    status={isEnd ? -1 : loading ? 0 : play ? 2 : 1}
                    showBackIcon={true}
                    actions={actions}
                    toolbarDuration={toolbarDuration}
                    showBackIcon={showBackIcon}
                    isFullscreen={isFullscreen}
                    onPlay={this._onPlay}
                    onPause={this._onPause}
                    onSlidingComplete={val => this._video.seek(val)}
                    onFullscreen={this._onFullscreen}
                    onCancelFullscreen={this._onCancelFullscreen}
                />

                {loading &&
                    <FloatView activeOpacity={1} onPress={this._onTouchEnd}>
                        <ActivityIndicator color='#fff' size='large' />
                    </FloatView>
                }
                {isEnd &&
                    <FloatView activeOpacity={1} onPress={this._onTouchEnd}>
                        <Touch activeOpacity={0.7} onPress={this._onPlay} style={{
                            backgroundColor: 'rgba(1, 1, 1, 0.24)',
                            borderRadius: 100,
                        }}>
                            <Image source={AgainIcon} style={{ width: 40, height: 40 }} />
                        </Touch>
                    </FloatView>
                }
            </Root>
        );
    }
}

IVideo.defaultProps = {
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
    gradientColor: [
        'rgba(1, 1, 1, 0.45)',
        'rgba(1, 1, 1, 0.24)',
        'rgba(1, 1, 1, 0.45)'
    ],

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

IVideo.propTypes = {
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
};

const Root = styled.View`
    position: relative;
    overflow: hidden;
    background-color: #222;
    z-index: 0;
    ${p => p.isFullscreen && `
        position: absolute;
        top: 0; left: 0;
        right: 0; bottom: 0;
        elevation: 24px;
        z-index: 1000;
    `}
`;

const FloatView = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 110;
`;