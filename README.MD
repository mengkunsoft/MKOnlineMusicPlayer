MKOnlineMusicPlayer V2.21
========
MKOnlineMusicPlayer 是一款开源的基于网易云音乐api的在线音乐播放器。具有音乐搜索、播放、下载、歌词同步显示、个人音乐播放列表同步等功能。

前端界面参照 QQ 音乐网页版进行布局，同时采用了流行的响应式设计，无论是在PC端还是在手机端，均能给您带来原生 app 般的使用体验。

### 界面欣赏
-----
![主界面(电脑端)](https://ws2.sinaimg.cn/large/006srDtYly1ffqxu72p2zj311y0hlqcl.jpg)

![播放列表界面(电脑端)](https://ws2.sinaimg.cn/large/006srDtYly1ffqxyzownkj311x0hiamq.jpg)

![歌曲搜索与播放](https://ws2.sinaimg.cn/large/006srDtYly1ffqxzlc2kkj311y0hjwqa.jpg)


### 相关链接
-----
**在线演示** [http://lab.mkblog.cn/music/](http://lab.mkblog.cn/music/)

**详细介绍** [http://mkblog.cn/757/](http://mkblog.cn/757/)

**GitHub** [https://github.com/mengkunsoft/MKOnlineMusicPlayer](https://github.com/mengkunsoft/MKOnlineMusicPlayer)

### 注意事项
-----
#### 关于API文件
由于网易云音乐官方封锁了国外的访问，因此本播放器的 api.php 在海外的空间上可能无法运行，具体表现为无法搜索歌曲，因此建议在国内空间使用本播放器(其实有个“你懂的”的功能，请 `在 api.php 中` 自行挖掘)。

#### 关于兼容性
本播放器设计支持 IE9及以上的现代浏览器。并且已在 Chrome、firefox、IE11 等浏览器测试使用正常。

#### 关于版权
本播放器由 [mengkun(http://mkblog.cn)](http://mkblog.cn) 开发，您可以随意修改、使用、转载。使用或转载时`请务必保留出处`，抱拳了各位老铁们！

#### 关于歌曲
播放器中采用了 [网易云音乐(http://music.163.com/)](http://music.163.com/) 的 api，因此相对应的歌曲版权归网易云音乐所有。支持正版音乐，请使用官方版网易云。

#### 其它
作者很忙，非诚勿扰。欢迎提交 BUG 及好的建议，不欢迎一上来就问一些基础的东西及唠东唠西。

### 待解决的问题
-----
- 降低模糊背景内存占用，解决移动设备下卡顿问题；
- 对其它音乐源(虾米、QQ)的支持
- IOS 设备播放失败问题
- 高音质音乐下载功能
- 超长歌词显示定位错乱问题
- 歌曲播放模式切换(单曲循环、随机播放、列表循环)功能
- 移动端歌曲列表直接下载歌曲功能

### 打赏
-----
- 解决上面这些问题，需要花费很多时间与精力。支持项目继续完善下去，你也可以贡献一份力量！
- 有了打赏，也就会有更新的动力！ :blush:

   ![](https://ws3.sinaimg.cn/large/006srDtYly1ffqy973ijwj30hk05atam.jpg)

### 更新日志
-----
#### v2.21 `2017/5/19`
- 临时修复 API 失效问题
- 新增歌曲超时检测，播放超时则自动播放下一首
- 新增设置数据传输方式(GET/POST)
- (这是一个临时版本，虽然解决了一部分API失效的问题，但是还是存在一些问题。剩下的问题将在之后的 v2.3 正式版中解决)

#### v2.2 `2017/3/26`
- 用户歌单获取时新增加载中动画及遮罩，防止重复加载
- 修复中等屏幕下鼠标滑过tab边框消失的bug
- 修复某些情况下第一句歌词无法渲染的bug
- 修复在IE9下音乐无法播放的bug
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
- 修复 IE11 下点击下载歌曲名字乱码的BUG
- 新增“正在播放”、“播放历史”列表功能
- 新增后台自定义播放列表功能，支持多种列表定义模式
- 新增本地记录用户设置及播放列表功能
- 进度条支持响应点击事件

#### v1.3 `未发布`
- 新增同步用户歌单功能
- 修复一些已知BUG
(因逻辑过于混乱，代码过于庞杂，此版本废弃)

#### v1.2 `未发布`
- 这个版本的存档神秘失踪，我也不记得有哪些改变。。

#### v1.1 `2016/10/27`
- 修复宽屏下背景覆盖缺失的BUG
- 修复打开页面后直接点击播放无效的BUG
- 修复EDGE浏览器点击下载时文件名为乱码的BUG
- 优化播放已下架的音乐，会给出无法播放的提示
- 修复歌词获取失败时无法清除原有歌词的BUG
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
| rem.uid | 当前已同步的用户的网易云 ID |
| rem.uname | 已登录用户的用户名 |
| rem.sheetList | 歌单容器操作对象 |
| rem.mainList | 歌曲列表容器操作对象 |

### 致谢
-----
#### 特别感谢 `网易云音乐`、`QQ音乐网页版`

#### 采用的开源模块
- **Jquery**：js主流开发框架 [http://jquery.com/](http://jquery.com/)
- **Meting**：强大的音乐API框架[https://github.com/metowolf/Meting](https://github.com/metowolf/Meting)
- **layer**：一款强大的web弹层组件 [http://layer.layui.com/](http://layer.layui.com/)
- **mCustomScrollbar**：jQuery自定义滚动条样式插件 [http://manos.malihu.gr/jquery-custom-content-scroller/](http://manos.malihu.gr/jquery-custom-content-scroller/)
- **background-blur**：跨浏览器磨砂效果背景图片模糊特效插件 [https://msurguy.github.io/background-blur/](https://msurguy.github.io/background-blur/)
- **Let's Kill IE6**：消灭IE [http://overtrue.me](http://overtrue.me)

##### 在开发过程中，还参照了很多开源 html 播放器的相关代码，在此一并向他们表示感谢！
