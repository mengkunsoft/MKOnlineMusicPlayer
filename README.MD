MKOnlineMusicPlayer
========
MKOnlineMusicPlayer 是一款全屏的音乐播放器 UI 框架（为避免侵权，已移除所有后端功能）。

前端界面参照 QQ 音乐网页版进行布局，同时采用了流行的响应式设计，无论是在PC端还是在手机端，均能给您带来原生 app 般的使用体验。

> 本项目仅为学习前端的练手之作，请勿用作商业用途，请勿利用本项目搭建盗版音乐网站，否则后果自负！

### 界面欣赏
-----
![主界面(电脑端)](https://user-images.githubusercontent.com/16880885/30487091-f7b45980-9a64-11e7-9588-8b6b87ac6763.jpg)

![播放列表界面(电脑端)](https://user-images.githubusercontent.com/16880885/30487141-1f8ad416-9a65-11e7-960c-a102c47a3d0e.jpg)

![歌曲搜索与播放](https://user-images.githubusercontent.com/16880885/30487344-c93a0306-9a65-11e7-92f3-552072b1dbce.jpg)

### 相关链接
-----
**GitHub** [https://github.com/mengkunsoft/MKOnlineMusicPlayer](https://github.com/mengkunsoft/MKOnlineMusicPlayer)

### 常见问题
-----
[请前往 wiki 查阅](https://github.com/mengkunsoft/MKOnlineMusicPlayer/wiki)

**遇到问题请详细阅读以上 wiki！**


### 开发文档[待完善]
-----
#### 播放列表DIY教程
本播放器支持后台自定义播放列表。打开 `js/musicList.js`，按照里面的说明对应修改即可。

#### 播放器DIY教程
除了自定义播放列表，本播放器还支持一些 DIY 设定，比如修改 api.php 文件的默认路径、修改搜索框的默认搜索内容等。具体请打开 `js/player.js` 查看

#### rem 变量表
程序中的rem数组用于存储全局变量，具体的成员(部分)及作用见下表：

| 变量名    | 用途   |
| ----------- | ----------- |
| rem.audio | audio dom |
| rem.playlist | 当前正在播放的播放列表编号 |
| rem.playid | 正在播放的这首歌在播放列表中的编号 |
| rem.dislist | 当前显示的列表的列表编号 |
| rem.loadPage | 搜索功能已加载的页码 |
| rem.wd | 当前的搜索词 |
| rem.source | 当前选定的音乐源 |
| rem.uid | 当前已同步的用户的网易云 ID |
| rem.uname | 已登录用户的用户名 |
| rem.sheetList | 歌单容器操作对象 |
| rem.mainList | 歌曲列表容器操作对象 |
| rem.isMobile | 是否是手机浏览 |

### 致谢
-----
#### 特别感谢 `@metowolf`、`网易云音乐`、`QQ音乐`、`虾米`、`酷狗`、`百度音乐`

#### 采用的开源模块
- **Jquery**：js主流开发框架 [http://jquery.com/](http://jquery.com/)
- **Meting**：一个高效的多平台音乐 API 框架 [https://github.com/metowolf/Meting](https://github.com/metowolf/Meting)
- **layer**：一款强大的web弹层组件 [http://layer.layui.com/](http://layer.layui.com/)
- **mCustomScrollbar**：jQuery自定义滚动条样式插件 [http://manos.malihu.gr/jquery-custom-content-scroller/](http://manos.malihu.gr/jquery-custom-content-scroller/)
- **background-blur**：跨浏览器磨砂效果背景图片模糊特效插件 [https://msurguy.github.io/background-blur/](https://msurguy.github.io/background-blur/)
- **Let's Kill IE6**：消灭IE [http://overtrue.me](http://overtrue.me)

##### 在开发过程中，还参照了很多开源 html 播放器的相关代码，在此一并向他们表示感谢！

### 耻辱柱
-----
恭喜下列个人或单位永久入驻耻辱柱！

#### 素材火 [http://www.sucaihuo.com/]
原因：以积分的形式变相售卖本作品(http://www.sucaihuo.com/php/3378.html ) 截图：https://t.cn/RFsgAAw

#### 绿岛资源站 [http://www.ldzy.cc/]
原因：未经允许，发布到淘宝售卖(https://item.taobao.com/item.htm?id=560064138441 ) 截图：https://t.cn/RlNRmi5

#### 68喜论坛 [http://www.68xi.com/]
原因：未经允许，删改版权信息(http://music.68xi.com/ )，并发布到淘宝售卖(https://item.taobao.com/item.htm?id=547226809330 )

`奉劝某些“人”保留住做人的最基本底线，遵守开源协议，并引以为戒`