
## react-native-ivideo
react-native-ivideo is a react-native-video based video player component. React Native > 0.40.0 is required.

<a href="https://www.npmjs.com/package/react-native-ivideo"><img src="https://img.shields.io/npm/v/react-native-ivideo.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/react-native-ivideo"><img src="https://img.shields.io/npm/dm/react-native-ivideo.svg?style=flat-square"></a>


[中文说明 -> 点这里](./CH_README.md)

> Currently, the performance is not tested on IOS.

__Features:__
- Basic playback features, friendly interface, progress control, evolving animation, and simple style.
- Fine-grained optimization, the UI thread can maintain 60 FPS during playback, and the JS thread can maintain 60 ~ 55 FPS.
- Provides full-screen playback.
- Supports formats such as MP4, M4A, FMP4, WebM, MKV, MP3, Ogg, WAV, MPEG-TS, MPEG-PS, FLV and ADTS (AAC).
- Support DASH, HlS and SmoothStreaming adaptive streaming.


<br />

#### Basic playback function, schedule control.

![](./image/index.png)

#### Full screen playback.

![](./image/full.gif)

#### Fade out animation.

![](./image/demo.gif)

### Installation

React-native-ivideo uses react-native-video, react-native-orientation, and react-native-linear-gradient. You need to install these dependencies yourself.

installation:

```bash
yarn add react-native-ivideo
```

link:

```bash
react-native link react-native-video
react-native link react-native-orientation
react-native link react-native-linear-gradient
```

modify the code in `android/build.gradle`:

```js
allprojects {
    repositories {
        mavenLocal()
        jcenter()
        maven {
            url 'https://maven.google.com'
        }
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
    }
}
```

### Usage

```js
import IVideo from 'react-native-ivideo';

<IVideo
    source={{ uri: url }}
    title='title'
    showFullscreenIcon={true}
    width='100%'
    height={240}
    actions={[{
        text: 'select 1',
        onPress: () => { },
    }, {
        text: 'select 2',
        onPress: () => { },
    }]}
/>
```

### Example
Please check [example code](./example/index.js).



### Props

| name               | type          | default | description                              |
| :----------------- | :------------ | :------ | :--------------------------------------- |
| width              | number、string | 100%    | video width, __@required__.              |
| height             | number、string | 240     | video height, __@required__.             |
| source             | object        | null    | video data source, __@required__.        |
| toolbarDuration    | number        | 6000    | the toolbar displays the duration (ms).  |
| toolbarSliderColor | string        | #f90    | the color of the toolbar slider.         |
| title              | string        | ''      | the title displayed by the toolbar.      |
| showFullscreenIcon | bool          | false   | whether to display the full screen button. |
| showBackIcon       | bool          | true    | whether to display the back icon .  |
| autoPlay           | bool          | false   | whether to automatically start playback after the video initialization is completed. |
| actions            | array         | [{ text, onPress }]      | Functional group. |
| gradientColor      | array         | ['rgba(1, 1, 1, 0.45)', 'rgba(1, 1, 1, 0.24)', 'rgba(1, 1, 1, 0.45)'] | Gradient color of the occlusion layer. |

<br />


__Map to the properties of react-native-video:__

| name                   | type   | default | description                              |
| :--------------------- | :----- | :------ | :--------------------------------------- |
| progressUpdateInterval | number | 500     | The call time difference of onProgress (ms).  |
| playInBackground       | bool   | false   | whether the video is playing in the background. |
| muted                  | bool   | false   | whether it is muted.                     |
| rate                   | number | 1.0     | the rate at which the video plays.       |
| repeat                 | bool   | false   | whether to repeat the loop playback.     |
| resizeMode             | string | 'cover' | how the video fills the container.       |
| useTextureView         | bool   | false   | whether to use useTextureView.           |
| volume                 | number | 1.0     | The sound size of the video.             |
| seek                   | number | 0       | The location where the playback starts.  |

<br />

__event:__

| name               | type     | default | description                              |
| :----------------- | :------- | :------ | :--------------------------------------- |
| onProgress         | function | d => d  | video playback progress event.           |
| onBuffer           | function | d => d  | fires when the video is cached.          |
| onLoadStart        | function | e => e  | fires when the video is loadedstart.     |
| onLoad             | function | d => d  | fires when the video is loaded.          |
| onFullscreen       | function | e => e  | fires when the video enters full screen. |
| onCancelFullscreen | function | e => e  | fires when the video exits full screen.  |
| onPlay             | function | e => e  | fires when the video plays.              |
| onPause            | function | e => e  | fires when the video is paused.          |
| onEnd              | function | e => e  | fires when the video ends.               |
| onError            | function | e => e  | fires when an error occurs in video playback/loading. |
| onBack             | function | e => e  | Triggered when clicked back. |


### Method

| name               | type     |  description                              |
| :----------------- | :------- |  :--------------------------------------- |
| play        | function |   Play video       |
| pause       | function |  Pause video          |
| seek        | function |  Change the video playback position  |
| replay     | function |  Replay video      |

### Change log
-  v2.0.0: Rewrite code, fix some bugs, add full-screen adaptive video orientation.
-  v1.6: add public method
-  v1.5: add actions props.