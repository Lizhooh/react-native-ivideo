
## react-native-ivideo
react-native-ivideo 是一个基于 react-native-video 的视频播放组件。需要 React Native > 0.40.0。

<a href="https://www.npmjs.com/package/react-native-ivideo"><img src="https://img.shields.io/npm/v/react-native-ivideo.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/react-native-ivideo"><img src="https://img.shields.io/npm/dm/react-native-ivideo.svg?style=flat-square"></a>


> 目前暂未在  IOS 上测试表现效果。

__特性：__
- 基本的播放功能，友好的界面，进度控制，渐出动画，简洁的风格。
- 细粒度优化，播放时 UI 线程能保持 60 FPS，JS 线程能保持 60 ~ 55 FPS。
- 提供全屏播放的功能。
- 支持 MP4，M4A，FMP4，WebM，MKV，MP3，Ogg，WAV，MPEG-TS，MPEG-PS，FLV 和 ADTS（AAC）等格式。
- 支持 DASH，HlS 和 SmoothStreaming 自适应流。


<br />

#### 基本的播放功能

![](./image/index.png)

#### 全屏播放

![](./image/full.gif)

#### 渐出动画

![](./image/demo.gif)

### 安装
react-native-ivideo 使用到了 react-native-video、react-native-orientation、react-native-linear-gradient。你需要自己安装好这些依赖。

模块：

```bash
yarn add react-native-ivideo
# or
npm install --save react-native-ivideo
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

### 示例
请查看 [示例代码](./example/index.js)。

### 属性

| name               | type          | default | description         |
| :----------------- | :------------ | :------ | :------------------ |
| width              | number、string | 100%    | 视频的宽度，__必须。__       |
| height             | number、string | 240     | 视频的高度，__必须。__       |
| source             | object        | null    | 视频的数据源，__必须。__      |
| toolbarDuration    | number        | 6000    | 工具栏显示持续时间（ms）。      |
| toolbarSliderColor | string        | #f90    | 工具栏滑块的颜色。           |
| title              | string        | ''      | 工具栏显示的标题。           |
| showFullscreenIcon | bool          | false   | 是否显示全屏按钮。           |
| showBackIcon       | bool          | true    | 是否显示回退按钮。  |
| autoPlay           | bool          | false   | 是否在视频初始化完成后就自动开始播放。 |
| actions            | array         |  [{ text, onPress }]      | 功能组。 |
| gradientColor      | array         | ['rgba(1, 1, 1, 0.45)', 'rgba(1, 1, 1, 0.24)', 'rgba(1, 1, 1, 0.45)'] | 遮挡层的渐变颜色。 |

<br />

__映射到 react-native-video 的属性：__

| name                   | type   | default | description          |
| :--------------------- | :----- | :------ | :------------------- |
| progressUpdateInterval | number | 500     | onProgress 的调用时间差（ms）。  |
| playInBackground       | bool   | false   | 视频是否在后台播放            |
| muted                  | bool   | false   | 是否静音。                |
| rate                   | number | 1.0     | 视频播放的速率。             |
| repeat                 | bool   | false   | 是否重复循环播放。            |
| resizeMode             | string | 'cover' | 视频以怎样的方式填充容器。        |
| useTextureView         | bool   | false   | 是否使用 useTextureView。 |
| volume                 | number | 1.0     | 视频的声音大小。             |
| seek                   | number | 0       | 开始播放的位置。             |

<br />

__事件：__

| name               | type     | default | description      |
| :----------------- | :------- | :------ | :--------------- |
| onProgress         | function | d => d  | 视频播放进度事件。        |
| onBuffer           | function | d => d  | 在视频缓存时触发。        |
| onLoadStart        | function | e => e  | 在视频加载开始时触发。      |
| onLoad             | function | d => d  | 在视频加载完成时触发。      |
| onFullscreen       | function | e => e  | 在视频进入全屏时触发。      |
| onCancelFullscreen | function | e => e  | 在视频退出全屏时触发。      |
| onPlay             | function | e => e  | 在视频播放时触发。        |
| onPause            | function | e => e  | 在视频暂停播放时触发。      |
| onEnd              | function | e => e  | 在视频播放结束时触发。      |
| onError            | function | e => e  | 在视频播放/加载发生错误时触发。 |
| onBack             | function | e => e  | 在点击返回时触发。 |

### Method

| name               | type     |  description                              |
| :----------------- | :------- |  :--------------------------------------- |
| play        | function |  播放视频。      |
| pause       | function |  暂停视频。        |
| seek        | function |  改变视频的进度位置。  |
| replay     | function |  重新播放。      |

### 更新日志
-  v2.0.0: 重写代码，修复部分 BUG，新增全屏自适应视频方向。
-  v1.6: 新增加部分共有方法。
-  v1.5: 新增 actions 参数。

