/**************************************************
 * MKOnlinePlayer v2.32
 * 播放列表配置模块
 * 编写：mengkun(http://mkblog.cn)
 * 时间：2017-9-15
 *************************************************/
// 建议修改前先备份一下
// 获取 歌曲的网易云音乐ID 或 网易云歌单ID 的方法：
// 先在 js/player.js 中开启调试模式，然后按 F12 打开浏览器的控制台。播放歌曲或点开歌单即可看到相应信息

var musicList = [
    // 以下三个系统预留列表请勿更改，否则可能导致程序无法正常运行！
    // 预留列表：搜索结果
    {
        name: "搜索结果",   // 播放列表名字
        cover: "",          // 播放列表封面
        creatorName: "",        // 列表创建者名字
        creatorAvatar: "",      // 列表创建者头像
        item: []
    },
    // 预留列表：正在播放
    {
        name: "正在播放",   // 播放列表名字
        cover: "",          // 播放列表封面
        creatorName: "",        // 列表创建者名字
        creatorAvatar: "",      // 列表创建者头像
        item: []
    },
    // 预留列表：播放历史
    {
        name: "播放历史",   // 播放列表名字
        cover: "images/history.png",          // 播放列表封面
        creatorName: "",        // 列表创建者名字
        creatorAvatar: "",      // 列表创建者头像
        item: []
    },  
    // 以上三个系统预留列表请勿更改，否则可能导致程序无法正常运行！
    //*********************************************
    // 自定义列表开始，您可以自由添加您的自定义列表
    {
        id: 3778678     // 云音乐热歌榜
    },
    {
        id: 3779629     // 云音乐新歌榜
    },
    {
        id: 4395559     // 华语金曲榜
    },
    {
        id: 64016     // 中国TOP排行榜（内地榜）
    },
    {
        id: 112504     // 中国TOP排行榜（港台榜）
    },
    {
        id: 19723756     // 云音乐飙升榜
    },
    {
        id: 2884035     // "网易原创歌曲榜"
    },
    // 自定义列表教程开始！
    // 方式一：手动创建列表并添加歌曲信息
    // 温馨提示：各大音乐平台获取到的外链有效期均较短，因此 url 值应该设置为空，以让程序临时抓取
    {
        name: "自定义列表",   // 播放列表名字
        cover: "https://p3.music.126.net/34YW1QtKxJ_3YnX9ZzKhzw==/2946691234868155.jpg", // 播放列表封面图像
        creatorName: "",        // 列表创建者名字(暂时没用到，可空)
        creatorAvatar: "",      // 列表创建者头像(暂时没用到，可空)
        item: [                 // 这里面放歌曲
            {
                id: "436514312",  // 音乐ID
                name: "成都",  // 音乐名字
                artist: "赵雷", // 艺术家名字
                album: "成都",    // 专辑名字
                source: "netease",     // 音乐来源
                url_id: "436514312",  // 链接ID
                pic_id: "2946691234868155",  // 封面ID
                lyric_id: "436514312",  // 歌词ID
                pic: "https://p3.music.126.net/34YW1QtKxJ_3YnX9ZzKhzw==/2946691234868155.jpg",    // 专辑图片
                url: ""   // mp3链接（此项建议不填，除非你有该歌曲的比较稳定的外链）
            },
            // 下面演示插入各个平台的音乐。。。
            {
                id: "65528",
                name: "淘汰",
                artist: "陈奕迅",
                album: "认了吧",
                source: "netease",      // 网易云
                url_id: "65528",
                pic_id: "18782957139233959",
                lyric_id: "65528",
                pic: "https://p3.music.126.net/BFuOepLmD63tY75UJs1c0Q==/18872017579169120.jpg",
                url: ""
            },
            {
                id: "001JD1SR29d1hS",
                name: "特别的爱给特别的你",
                artist: "伍思凯",
                album: "特别的爱给特别的你",
                source: "tencent",      // 腾讯
                url_id: "001JD1SR29d1hS",
                pic_id: "004DYsvN2QCYcj",
                lyric_id: "001JD1SR29d1hS",
                pic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000004DYsvN2QCYcj.jpg?max_age=2592000",
                url: ""     // 腾讯的外链有效期较短，插入时 url [必须]设置空值，播放时再临时抓取
            },
            {
                id: "81175",
                name: "让我欢喜让我忧",
                artist: "周华健",
                album: "让我欢喜让我忧",
                source: "xiami",    // 虾米
                url_id: "81175",
                pic_id: "81175",
                lyric_id: "81175",
                pic: "https://pic.xiami.net/images/album/img58/1258/66271400572139.jpg@300h_300w_100q_1c.jpg",
                url: ""     // 虾米的外链有效期较短，插入时 url [必须]设置空值，播放时再临时抓取
            },
            {
                id: "2a24dea6c74884195fe5b9732fd95ca8",
                name: "小幸运",
                artist: "金玟岐",
                album: "金玟岐翻唱作品集",
                source: "kugou",        // 酷狗
                url_id: "2a24dea6c74884195fe5b9732fd95ca8",
                pic_id: "2a24dea6c74884195fe5b9732fd95ca8",
                lyric_id: "2a24dea6c74884195fe5b9732fd95ca8",
                pic: "http://singerimg.kugou.com/uploadpic/softhead/400/20161226/20161226105135733.jpg",
                url: ""     // 酷狗的外链有效期较短，插入时 url [必须]设置空值，播放时再临时抓取
            },
            {
                id: "121004737",
                name: "难忘今宵",
                artist: "李谷一",
                album: "难忘今宵",
                source: "baidu",        // 百度
                url_id: "121004737",
                pic_id: "121004737",
                lyric_id: "121004737",
                pic: "http://musicdata.baidu.com/data2/pic/2733cd9816b8618afd3038d5d9444940/266105319/266105319.jpg@s_0,w_150",
                url: ""         // 百度的外链有效期较短，插入时 url [必须]设置空值，播放时再临时抓取
            }  // 列表中最后一首歌大括号后面不要加逗号
        ]
    },
    // 方式二：直接提供网易云歌单ID
    {
        id: 440103454   // 网易云歌单ID
    }   // 播放列表的最后一项大括号后面不要加逗号
];