import * as React from 'react';
import * as ReactNative from 'react-native';
import * as Video from 'react-native-video';

interface IActionsData {
    text: string,
    onPress?(): any,
}

interface IProgressData {
    currentTime: number,
    playableDuration: number,
    seekableDuration: number,
}

interface IVideoProps {
    toolbarDuration?: number,
    width: number | string,
    height: number | string,
    showFullscreenIcon?: boolean,
    showBackIcon?: boolean,
    title?: string,
    startFullscreen?: boolean,
    autoPlay?: boolean,
    actions?: [IActionsData],

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

    onProgress?(d: IProgressData): any,
    onBuffer?(e: Event): any,
    onLoad?(d: Video.OnLoadData): any,
    onFullscreen?(e: Event): any,
    onCancelFullscreen?(e: Event): any,
    onPlay?(e: Event): any,
    onPause?(e: Event): any,
    onEnd?(e: Event): any,
    onLoadStart?(e: Event): any,
    onError?(e: Video.LoadError): any,
    onBack?(e: Event): any,
}

export default class IVideo extends React.Component<IVideoProps> {
    play(): void;
    pause(): void;
    seek(time: number): void;
    replay(): void;
}