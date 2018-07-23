
## react-native-ivideo
react-native-ivideo 一个基于 react-native-video 自定义播放栏的组件。需要 React Native > 0.40.0。

> 目前暂未在  IOS 上测试表现效果。

特性：
- 基本的播放功能，友好的界面，进度控制，渐出动画。
- 细粒度优化，播放时 UI 线程能保持 60 FPS，JS 线程能保持 60 ~ 50 FPS。
- 提供全屏播放的功能。
- 支持 MP4，M4A，FMP4，WebM，MKV，MP3，Ogg，WAV，MPEG-TS，MPEG-PS，FLV 和 ADTS（AAC）等格式。
- 支持 DASH，HlS 和 SmoothStreaming 自适应流。


<br />

#### 基本的播放功能

![](./image/index.png)

#### 全屏播放

![](./image/full.png)

#### 渐出动画

![](./image/demo.gif)

### 安装
react-native-ivideo 使用到了 react-native-video、react-native-orientation、react-native-linear-gradient。你需要自己安装好这些依赖。

模块：

```bash
yarn add react-native-ivideo
yarn add react-native-video
yarn add react-native-orientation
yarn add react-native-linear-gradient
```

链接：

```bash
react-native link react-native-video
react-native link react-native-orientation
react-native link react-native-linear-gradient
```

在 `android/build.gradle` 里修改代码：

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

### 使用

```js
import Video from 'react-native-ivideo';

<Video
    source={{ uri: url }}
    title={title}
    showFullscreenIcon={true}
    width='100%'
    height={240}
/>
```

### Example
请查看 [示例代码](./example/index.js)。


