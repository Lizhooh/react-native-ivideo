import * as React from 'react';
import * as ReactNative from 'react-native';
import { LoadError, OnLoadData } from 'react-native-video';

interface IVideoProps {
    toolbarDuration?: number,
    width: number | string,
    height: number | string,
    showFullscreenIcon?: boolean,
    showBackIcon?: boolean,
    title?: string,
    startFullscreen?: boolean,
    autoPlay?: boolean,
    actions?: [{
        text: string,
        onPress?(): any,
    }],

    source: { uri: string },
    progressUpdateInterval?: number,
    playInBackground?: boolean,
    muted?: boolean,
    resizeMode?: 'none' | 'contain' | 'cover' | 'stretch',
    rate?: number,
    repeat?: boolean,
    useTextureView?: boolean,
    volume?: number,
    seek?: number,

    onProgress?(d: {
        currentTime: number,
        playableDuration: number,
        seekableDuration: number,
    }): any,
    onBuffer?(e: Event): any,
    onLoad?(d: OnLoadData): any,
    onFullscreen?(e: Event): any,
    onCancelFullscreen?(e: Event): any,
    onPlay?(e: Event): any,
    onPause?(e: Event): any,
    onEnd?(e: Event): any,
    onLoadStart?(e: Event): any,
    onError?(e: LoadError): any,
    onBack?(e: Event): any,
}

export default class IVideo extends React.Component<IVideoProps> {
    play(): void;
    pause(): void;
    seek(time: number): void;
    replay(): void;
}