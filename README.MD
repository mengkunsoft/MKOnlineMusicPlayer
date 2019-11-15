MKOnlineMusicPlayer
========
MKOnlineMusicPlayer 是一款开源的基于 `Meting` 的在线音乐播放器。具有音乐搜索、播放、下载、歌词同步显示、个人网易云音乐播放列表同步等功能。

前端界面参照 QQ 音乐网页版进行布局，同时采用了流行的响应式设计，无论是在PC端还是在手机端，均能给您带来原生 app 般的使用体验。

> 本项目仅为学习前端的练手之作，请勿用作商业用途，请勿利用本项目下载盗版歌曲资源，否则后果自负！

### 界面欣赏
-----
![主界面(电脑端)](https://user-images.githubusercontent.com/16880885/30487091-f7b45980-9a64-11e7-9588-8b6b87ac6763.jpg)

![播放列表界面(电脑端)](https://user-images.githubusercontent.com/16880885/30487141-1f8ad416-9a65-11e7-960c-a102c47a3d0e.jpg)

![歌曲搜索与播放](https://user-images.githubusercontent.com/16880885/30487344-c93a0306-9a65-11e7-92f3-552072b1dbce.jpg)

### 相关链接
-----
**在线演示** [http://lab.mkblog.cn/music/](http://lab.mkblog.cn/music/)

**详细介绍** [http://mkblog.cn/1060/](http://mkblog.cn/1060/)

**GitHub** [https://github.com/mengkunsoft/MKOnlineMusicPlayer](https://github.com/mengkunsoft/MKOnlineMusicPlayer)

### 常见问题
-----
[请前往 wiki 查阅](https://github.com/mengkunsoft/MKOnlineMusicPlayer/wiki)

**遇到问题请详细阅读以上 wiki！**

### 更新日志
-----
#### v2.41 `2018/3/13`
- 修复 IE 下播放键错位的 BUG
- 修改默认背景为黑色
- 其它一些细节优化

#### v2.4 `2018/3/11`
- 修复网易云音乐无法播放
- 增加标题栏滚动效果(感谢@lzcykevin)
- 增加歌曲循环播放控制(感谢@yuxizhe)
- 修复百度音乐无法播放
- 优化连续播放失败的歌曲过多时，自动终止播放。防止卡死
- 压缩图片素材，限制封面图片尺寸，优化页面加载速度

#### v2.32 `2017/9/15`
- 修复播放历史记录歌曲时播放失败的 BUG
- 新增播放歌曲时浏览器标题栏显示相关信息
- 一些细节的完善

#### v2.31 `2017/9/13`
- 优化下载功能，支持直接弹出下载
- 下载或分享无版权音乐时给出提示
- 再次降低移动端背景特效内存占用
- 修复某些手机浏览器列表页右侧菜单按钮下移 BUG
- 升级 Meting 至最新版本

#### v2.3 `2017/9/9`
- 全面支持网易云、QQ、虾米、酷狗、百度音乐源切换
- 移动端歌曲列表支持直接分享、下载歌曲
- 降低内存占用，解决移动端背景特效卡顿问题
- 新增对 https 的支持(酷狗、百度音乐源除外)
- 新增运行环境自检功能
- 优化中等屏幕下显示效果
- 修复长歌词定位错乱的 BUG
- 修复无法获取自定义专辑封面的 BUG
- 修复移动端无法自动播放下一曲的 BUG
- 修复切换播放列表后滚动条未归位的 BUG
- 修复某些情况下歌词与歌曲不对应的 BUG
- 修复中小屏幕下顶部 tab 激活错乱的 BUG
- 修复搜索分页的 BUG
- 去除超时检测

#### v2.21 `2017/5/19`
- 临时修复 API 失效问题
- 新增歌曲超时检测，播放超时则自动播放下一首
- 新增设置数据传输方式(GET/POST)
- (这是一个临时版本，虽然解决了一部分API失效的问题，但是还是存在一些问题。剩下的问题将在之后的 v2.3 正式版中解决)

#### v2.2 `2017/3/26`
- 用户歌单获取时新增加载中动画及遮罩，防止重复加载
- 修复中等屏幕下鼠标滑过tab边框消失的 BUG
- 修复某些情况下第一句歌词无法渲染的 BUG
- 修复在IE9下音乐无法播放的 BUG
- 更换背景展现方式，整体界面更美观
- 正在播放和播放历史列表支持一键清空
- 新增图片加载失败时替换处理
- 新增小屏幕下为当前显示的tab添加下划线
- 新增favicon小图标
- 新增歌曲播放时进度条小点闪烁效果
- 优化后台数据获取失败时弹出提示
- 其它的一些细节优化

#### v2.1 `2017/3/20`
- 紧急修复部分浏览器下切换歌曲造成无限播放失败循环的 BUG
- 新增点击未加载完的播放列表弹出提示
- 新增搜索时弹出加载中动画
- 切换歌曲后进度条自动复位
- 优化歌曲外链显示方式，方便复制
- 优化封面图像加载大小
- 新增无歌词、歌词加载中提示
- 优化歌词展现方式

#### v2.0 Beta `2017/3/18`
- 所有代码均推翻重写，前端界面全新改版
- 完善对手机端的适配，新支持 IE9~IE11 浏览器
- 修复 IE11 下点击下载歌曲名字乱码的 BUG
- 新增“正在播放”、“播放历史”列表功能
- 新增后台自定义播放列表功能，支持多种列表定义模式
- 新增本地记录用户设置及播放列表功能
- 进度条支持响应点击事件

#### v1.3 `未发布`
- 新增同步用户歌单功能
- 修复一些已知 BUG
(因逻辑过于混乱，代码过于庞杂，此版本废弃)

#### v1.2 `未发布`
- 这个版本的存档神秘失踪，我也不记得有哪些改变。。

#### v1.1 `2016/10/27`
- 修复宽屏下背景覆盖缺失的 BUG
- 修复打开页面后直接点击播放无效的 BUG
- 修复EDGE浏览器点击下载时文件名为乱码的 BUG
- 优化播放已下架的音乐，会给出无法播放的提示
- 修复歌词获取失败时无法清除原有歌词的 BUG
- 暂停播放时停止歌词滚动，方便复制歌词
- 优化搜索内容为空时弹出提示

#### v1.0 `2016/10/25`
- 完成搜索并播放音乐功能
- 完成一键提取音乐外链功能
- 完成音乐下载功能
- 完成显示歌曲封面、歌词功能


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
