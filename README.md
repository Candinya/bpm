# BPM

> Blog Play Music - 自用的博客音乐播放器

## 为什么有这个项目

起因是 `APlayer` 和博客主题有冲突，不知道为什么它在加载的时候会破坏主题的导航滚动功能（怀疑是和 DOM 事件监听相关），懒得深究了。

以前用过 `明月浩空` 播放器，但它是商业软件（虽然后来变免费了，但依然是中心化服务），再后来没有在线解析的需要了（好久没有听音乐了）就没有再使用。

所以就干脆花两天时间随手搓了一个播放器，悬浮窗样式有参考 `明月浩空` ，交互样式有参考 `APlayer` ，懒得写得太复杂所以用了熟悉的 React 语法（用的是 Preact 框架），图标直接用的 FontAwesome 和 Nucleo 。

功能上也就只有一个顺序播放而没有做随机啦单曲循环啦之类的东西，没加音量调节功能（讲道理这个可以在设备上调的对吧），没加歌词（因为我没下载），然后记忆了一下播放到的曲目顺序号，其他没了。反正能响就行，只是给博客随便添点东西，没有人会专门跑这里来为了听音乐的对吧。

## 使用方法

需要引用样式文件，像这样

```html
<link rel="stylesheet" href="https://unpkg.com/@candymade/bpm/dist/player.css" />
```

需要准备一个挂载点，像这样

```html
<div id="player"></div>
```

播放器加载脚本则推荐使用 module 封装，可以这样加载

```html
<script defer type="module" src="/widgets/player.js"></script>
```

然后这个 `/widgets/player.js` 里这样写

```ts
import { NewPlayer } from "https://unpkg.com/@candymade/bpm/dist/player.js";

(() => {
  fetch("<你的音乐API地址>")
    .then((res) => res.json())
    .then((data) => {
      NewPlayer({
        el: document.getElementById("player"),
        audio: data,
      });
    });
})();
```

音乐列表数据格式长这样（注意是一个数组）

```ts
{
  url: string; // 音乐文件链接
  name: string; // 歌曲名
  artist: string; // 艺术家
  album: string; // 专辑
  cover: string; // 封面图片
}[];
```

理论上也能通过加载 https://unpkg.com/@candymade/bpm/dist/player.umd.cjs 运行，或是通过 npm 安装作为依赖项，但我没有试过，如果有成功的欢迎开 PR 更新这个文档。

如果出现样式冲突，可以自己追加覆盖样式，使用挂载点的 ID定位（假如上文提供的挂载点 id 是 player 的话，就是 `#player`）

有想到其他内容（比如追加功能或是修复 bug ）欢迎直接开 PR 。
