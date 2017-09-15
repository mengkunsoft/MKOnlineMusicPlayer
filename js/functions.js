/**************************************************
 * MKOnlinePlayer v2.32
 * 封装函数及UI交互模块
 * 编写：mengkun(http://mkblog.cn)
 * 时间：2017-9-15
 *************************************************/
// 判断是否是移动设备
var isMobile = {  
    Android: function() {  
        return navigator.userAgent.match(/Android/i) ? true : false;  
    },  
    BlackBerry: function() {  
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;  
    },  
    iOS: function() {  
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;  
    },  
    Windows: function() {  
        return navigator.userAgent.match(/IEMobile/i) ? true : false;  
    },  
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());  
    }
};

$(function(){
    if(mkPlayer.debug) {
        console.warn('播放器调试模式已开启，正常使用时请在 js/player.js 中按说明关闭调试模式');
    }
    
    rem.isMobile = isMobile.any();
    rem.webTitle = document.title;      // 记录页面原本的标题
    
    initProgress();     // 初始化音量条、进度条（进度条初始化要在 Audio 前，别问我为什么……）
    initAudio();    // 初始化 audio 标签，事件绑定
    
    
    if(rem.isMobile) {  // 加了滚动条插件和没加滚动条插件所操作的对象是不一样的
        rem.sheetList = $("#sheet");
        rem.mainList = $("#main-list");
    } else {
        // 滚动条初始化(只在非移动端启用滚动条控件)
        $("#main-list,#sheet").mCustomScrollbar({
            theme:"minimal",
            advanced:{
                updateOnContentResize: true // 数据更新后自动刷新滚动条
            }
        });
        
        rem.sheetList = $("#sheet .mCSB_container");
        rem.mainList = $("#main-list .mCSB_container");  
    }
    
    addListhead();  // 列表头
    addListbar("loading");  // 列表加载中
    
    // 顶部按钮点击处理
    $(".btn").click(function(){
        switch($(this).data("action")) {
            case "player":    // 播放器
                dataBox("player");
            break;
            case "search":  // 搜索
                searchBox();
            break;
            
            case "playing": // 正在播放
                loadList(1); // 显示正在播放列表
            break;
            
            case "sheet":   // 播放列表
                dataBox("sheet");    // 在主界面显示出音乐专辑
            break;
        }
    });
    
    // 列表项双击播放
    $(".music-list").on("dblclick",".list-item", function() {
        var num = parseInt($(this).data("no"));
        if(isNaN(num)) return false;
        listClick(num);
    });
    
    // 移动端列表项单击播放
    $(".music-list").on("click",".list-item", function() {
        if(rem.isMobile) {
            var num = parseInt($(this).data("no"));
            if(isNaN(num)) return false;
            listClick(num);
        }
    });
    
    // 小屏幕点击右侧小点查看歌曲详细信息
    $(".music-list").on("click",".list-mobile-menu", function() {
        var num = parseInt($(this).parent().data("no"));
        musicInfo(rem.dislist, num);
        return false;
    });
    
    // 列表鼠标移过显示对应的操作按钮
    $(".music-list").on("mousemove",".list-item", function() {
        var num = parseInt($(this).data("no"));
        if(isNaN(num)) return false;
        // 还没有追加菜单则加上菜单
        if(!$(this).data("loadmenu")) {
            var target = $(this).find(".music-name");
            var html = '<span class="music-name-cult">' + 
            target.html() + 
            '</span>' +
            '<div class="list-menu" data-no="' + num + '">' +
                '<span class="list-icon icon-play" data-function="play" title="点击播放这首歌"></span>' +
                '<span class="list-icon icon-download" data-function="download" title="点击下载这首歌"></span>' +
                '<span class="list-icon icon-share" data-function="share" title="点击分享这首歌"></span>' +
            '</div>';
            target.html(html);
            $(this).data("loadmenu", true);
        }
    });
    
    // 列表中的菜单点击
    $(".music-list").on("click",".icon-play,.icon-download,.icon-share", function() {
        var num = parseInt($(this).parent().data("no"));
        if(isNaN(num)) return false;
        switch($(this).data("function")) {
            case "play":    // 播放
                listClick(num);     // 调用列表点击处理函数
            break;
            case "download":    // 下载
                ajaxUrl(musicList[rem.dislist].item[num], download);
            break;
            case "share":   // 分享
                // ajax 请求数据
                ajaxUrl(musicList[rem.dislist].item[num], ajaxShare);
            break;
        }
        return true;
    });
    
    // 点击加载更多
    $(".music-list").on("click",".list-loadmore", function() {
        $(".list-loadmore").removeClass('list-loadmore');
        $(".list-loadmore").html('加载中...');
        ajaxSearch();
    });
    
    // 点击专辑显示专辑歌曲
    $("#sheet").on("click",".sheet-cover,.sheet-name", function() {
        var num = parseInt($(this).parent().data("no"));
        // 是用户列表，但是还没有加载数据
        if(musicList[num].item.length === 0 && musicList[num].creatorID) {
            layer.msg('列表读取中...', {icon: 16,shade: 0.01,time: 500}); // 0代表加载的风格，支持0-2
            // ajax加载数据
            ajaxPlayList(musicList[num].id, num, loadList);
            return true;
        }
        loadList(num);
    });
    
    // 点击同步云音乐
    $("#sheet").on("click",".login-in", function() {
        layer.prompt(
        {
            title: '请输入您的网易云 UID',
            // value: '',  // 默认值
            btn: ['确定', '取消', '帮助'],
            btn3: function(index, layero){
                layer.open({
                    title: '如何获取您的网易云UID？'
                    ,shade: 0.6 //遮罩透明度
                    ,anim: 0 //0-6的动画形式，-1不开启
                    ,content: 
                    '1、首先<a href="http://music.163.com/" target="_blank">点我(http://music.163.com/)</a>打开网易云音乐官网<br>' +
                    '2、然后点击页面右上角的“登录”，登录您的账号<br>' + 
                    '3、点击您的头像，进入个人中心<br>' + 
                    '4、此时<span style="color:red">浏览器地址栏</span> <span style="color: green">/user/home?id=</span> 后面的<span style="color:red">数字</span>就是您的网易云 UID'
                });  
            }
        },
        function(val, index){   // 输入后的回调函数
            if(isNaN(val)) {
                layer.msg('uid 只能是数字',{anim: 6});
                return false;
            }
            layer.close(index);     // 关闭输入框
            ajaxUserList(val);
        });
    });
    
    // 刷新用户列表
    $("#sheet").on("click",".login-refresh", function() {
        playerSavedata('ulist', '');
        layer.msg('刷新歌单');
        clearUserlist();
    });
    
    // 退出登录
    $("#sheet").on("click",".login-out", function() {
        playerSavedata('uid', '');
        playerSavedata('ulist', '');
        layer.msg('已退出');
        clearUserlist();
    });
    
    // 播放、暂停按钮的处理
    $("#music-info").click(function(){
        if(rem.playid === undefined) {
            layer.msg('请先播放歌曲');
            return false;
        }
        
        musicInfo(rem.playlist, rem.playid);
    });
    
    // 播放、暂停按钮的处理
    $(".btn-play").click(function(){
        pause();
    });
    
    // 上一首歌
    $(".btn-prev").click(function(){
        prevMusic();
    });
    
    // 下一首
    $(".btn-next").click(function(){
        nextMusic();
    });
    
    // 静音按钮点击事件
    $(".btn-quiet").click(function(){
        var oldVol;     // 之前的音量值
        if($(this).is('.btn-state-quiet')) {
            oldVol = $(this).data("volume");
            oldVol = oldVol? oldVol: (rem.isMobile? 1: mkPlayer.volume);  // 没找到记录的音量，则重置为默认音量
            $(this).removeClass("btn-state-quiet");     // 取消静音
        } else {
            oldVol = volume_bar.percent;
            $(this).addClass("btn-state-quiet");        // 开启静音
            $(this).data("volume", oldVol); // 记录当前音量值
            oldVol = 0;
        }
        playerSavedata('volume', oldVol); // 存储音量信息
        volume_bar.goto(oldVol);    // 刷新音量显示
        if(rem.audio[0] !== undefined) rem.audio[0].volume = oldVol;  // 应用音量
    });
    
    if((mkPlayer.coverbg === true && !rem.isMobile) || (mkPlayer.mcoverbg === true && rem.isMobile)) { // 开启了封面背景
    
        if(rem.isMobile) {  // 移动端采用另一种模糊方案
            $('#blur-img').html('<div class="blured-img" id="mobile-blur"></div><div class="blur-mask mobile-mask"></div>');
        } else {
            // 背景图片初始化
            $('#blur-img').backgroundBlur({
                // imageURL : '', // URL to the image that will be used for blurring
                blurAmount : 50, // 模糊度
                imageClass : 'blured-img', // 背景区应用样式
                overlayClass : 'blur-mask', // 覆盖背景区class，可用于遮罩或额外的效果
                // duration: 0, // 图片淡出时间
                endOpacity : 1 // 图像最终的不透明度
            });
        }
        
        $('.blur-mask').fadeIn(1000);   // 遮罩层淡出
    }
    
    // 图片加载失败处理
    $('img').error(function(){
        $(this).attr('src', 'images/player_cover.png');
    });
    
    // 初始化播放列表
    initList(); 
});

// 展现系统列表中任意首歌的歌曲信息
function musicInfo(list, index) {
    var music = musicList[list].item[index];
    var tempStr = '<span class="info-title">歌名：</span>' + music.name + 
    '<br><span class="info-title">歌手：</span>' + music.artist + 
    '<br><span class="info-title">专辑：</span>' + music.album;
    
    if(list == rem.playlist && index == rem.playid) {   // 当前正在播放这首歌，那么还可以顺便获取一下时长。。
        tempStr += '<br><span class="info-title">时长：</span>' + formatTime(rem.audio[0].duration);
    }
    
    tempStr += '<br><span class="info-title">操作：</span>' + 
    '<span class="info-btn" onclick="thisDownload(this)" data-list="' + list + '" data-index="' + index + '">下载</span>' + 
    '<span style="margin-left: 10px" class="info-btn" onclick="thisShare(this)" data-list="' + list + '" data-index="' + index + '">外链</span>';
    
    layer.open({
        type: 0,
        shade: false,
        title: false, //不显示标题
        btn: false,
        content: tempStr
    });
    
    if(mkPlayer.debug) {
        console.info('id: "' + music.id + '",\n' + 
        'name: "' + music.name + '",\n' +
        'artist: "' + music.artist + '",\n' +
        'album: "' + music.album + '",\n' +
        'source: "' + music.source + '",\n' +
        'url_id: "' + music.url_id + '",\n' + 
        'pic_id: "' + music.pic_id + '",\n' + 
        'lyric_id: "' + music.lyric_id + '",\n' + 
        'pic: "' + music.pic + '",\n' +
        'url: ""');
        // 'url: "' + music.url + '"');
    }
}

// 展现搜索弹窗
function searchBox() {
    var tmpHtml = '<form onSubmit="return searchSubmit()"><div id="search-area">' + 
    '    <div class="search-group">' + 
    '        <input type="text" name="wd" id="search-wd" placeholder="搜索歌手、歌名、专辑" autofocus required>' + 
    '        <button class="search-submit" type="submit">搜 索</button>' + 
    '    </div>' + 
    '    <div class="radio-group" id="music-source">' + 
    '       <label><input type="radio" name="source" value="netease" checked=""> 网易云</label>' + 
    '       <label><input type="radio" name="source" value="tencent"> QQ</label>' + 
    '       <label><input type="radio" name="source" value="xiami"> 虾米</label>' + 
    '       <label><input type="radio" name="source" value="kugou"> 酷狗</label>' + 
    '       <label><input type="radio" name="source" value="baidu"> 百度</label>' + 
    '   </div>' + 
    '</div></form>';
    layer.open({
        type: 1,
        shade: false,
        title: false, // 不显示标题
        shade: 0.5,    // 遮罩颜色深度
        shadeClose: true,
        content: tmpHtml,
        cancel: function(){
        }
    });
    
    // 恢复上一次的输入
    $("#search-wd").focus().val(rem.wd);
    $("#music-source input[name='source'][value='" + rem.source + "']").prop("checked", "checked");
}

// 搜索提交
function searchSubmit() {
    var wd = $("#search-wd").val();
    if(!wd) {
        layer.msg('搜索内容不能为空', {anim:6, offset: 't'});
        $("#search-wd").focus();
        return false;
    }
    rem.source = $("#music-source input[name='source']:checked").val();
    
    layer.closeAll('page');     // 关闭搜索框
    
    rem.loadPage = 1;   // 已加载页数复位
    rem.wd = wd;    // 搜索词
    ajaxSearch();   // 加载搜索结果
    return false;
}

// 下载正在播放的这首歌
function thisDownload(obj) {
    ajaxUrl(musicList[$(obj).data("list")].item[$(obj).data("index")], download);
}

// 分享正在播放的这首歌
function thisShare(obj) {
    ajaxUrl(musicList[$(obj).data("list")].item[$(obj).data("index")], ajaxShare);
}

// 下载歌曲
// 参数：包含歌曲信息的数组
function download(music) {
    if(music.url == 'err' || music.url == "" || music.url == null) {
        layer.msg('这首歌不支持下载');
        return;
    }
    openDownloadDialog(music.url, music.name + ' - ' + music.artist);
}

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 * http://www.cnblogs.com/liuxianan/p/js-download.html
 */
function openDownloadDialog(url, saveName)
{
    if(typeof url == 'object' && url instanceof Blob)
    {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if(window.MouseEvent) event = new MouseEvent('click');
    else
    {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}

// 获取外链的ajax回调函数
// 参数：包含音乐信息的数组
function ajaxShare(music) {
    if(music.url == 'err' || music.url == "" || music.url == null) {
        layer.msg('这首歌不支持外链获取');
        return;
    }
    
    var tmpHtml = '<p>' + music.artist + ' - ' + music.name + ' 的外链地址为：</p>' + 
    '<input class="share-url" onmouseover="this.focus();this.select()" value="' + music.url + '">' + 
    '<p class="share-tips">* 获取到的音乐外链有效期较短，请按需使用。</p>';
    
    layer.open({
        title: '歌曲外链分享'
        ,content: tmpHtml
    });
}

// 改变右侧封面图像
// 新的图像地址
function changeCover(music) {
    var img = music.pic;    // 获取歌曲封面
    var animate = false,imgload = false;
    
    if(!img) {  // 封面为空
        ajaxPic(music, changeCover);    // 获取歌曲封面图
        img == "err";    // 暂时用无图像占个位...
    }
    
    if(img == "err") {
        img = "images/player_cover.png";
    } else {
        if(mkPlayer.mcoverbg === true && rem.isMobile)      // 移动端封面
        {    
            $("#music-cover").load(function(){
                $("#mobile-blur").css('background-image', 'url("' + img + '")');
            });
        } 
        else if(mkPlayer.coverbg === true && !rem.isMobile)     // PC端封面
        { 
            $("#music-cover").load(function(){
                if(animate) {   // 渐变动画也已完成
                    $("#blur-img").backgroundBlur(img);    // 替换图像并淡出
                    $("#blur-img").animate({opacity:"1"}, 2000); // 背景更换特效
                } else {
                    imgload = true;     // 告诉下面的函数，图片已准备好
                }
                
            });
            
            // 渐变动画
            $("#blur-img").animate({opacity: "0.2"}, 1000, function(){
                if(imgload) {   // 如果图片已经加载好了
                    $("#blur-img").backgroundBlur(img);    // 替换图像并淡出
                    $("#blur-img").animate({opacity:"1"}, 2000); // 背景更换特效
                } else {
                    animate = true;     // 等待图像加载完
                }
            });
        }
    }
    
    $("#music-cover").attr("src", img);     // 改变右侧封面
    $(".sheet-item[data-no='1'] .sheet-cover").attr('src', img);    // 改变正在播放列表的图像
}


// 向列表中载入某个播放列表
function loadList(list) {
    if(musicList[list].isloading === true) {
        layer.msg('列表读取中...', {icon: 16,shade: 0.01,time: 500});
        return true;
    }
    
    rem.dislist = list;     // 记录当前显示的列表
    
    dataBox("list");    // 在主界面显示出播放列表
    
    // 调试信息输出
    if(mkPlayer.debug) {
        if(musicList[list].id) {
            console.log('加载播放列表 ' + list + ' - ' + musicList[list].name + '\n' +
            'id: ' + musicList[list].id + ',\n' +
            'name: "' + musicList[list].name + '",\n' +
            'cover: "' + musicList[list].cover + '",\n' +
            'item: []');
        } else {
            console.log('加载播放列表 ' + list + ' - ' + musicList[list].name);
        }
    }
    
    rem.mainList.html('');   // 清空列表中原有的元素
    addListhead();      // 向列表中加入列表头
    
    if(musicList[list].item.length == 0) {
        addListbar("nodata");   // 列表中没有数据
    } else {
        
        // 逐项添加数据
        for(var i=0; i<musicList[list].item.length; i++) {
            var tmpMusic = musicList[list].item[i];
            
            addItem(i + 1, tmpMusic.name, tmpMusic.artist, tmpMusic.album);
            
            // 音乐链接均有有效期限制,重新显示列表时清空处理
            if(list == 1 || list == 2) tmpMusic.url = "";
        }
        
        // 列表加载完成后的处理
        if(list == 1 || list == 2) {    // 历史记录和正在播放列表允许清空
            addListbar("clear");    // 清空列表
        }
        
        if(rem.playlist === undefined) {    // 未曾播放过
            if(mkPlayer.autoplay == true) pause();  // 设置了自动播放，则自动播放
        } else {
            refreshList();  // 刷新列表，添加正在播放样式
        }
        
        listToTop();    // 播放列表滚动到顶部
    }
}

// 播放列表滚动到顶部
function listToTop() {
    if(rem.isMobile) {
        $("#main-list").animate({scrollTop: 0}, 200);
    } else {
        $("#main-list").mCustomScrollbar("scrollTo", 0, "top");
    }
}

// 向列表中加入列表头
function addListhead() {
    var html = '<div class="list-item list-head">' +
    '    <span class="music-album">' +
    '        专辑' +
    '    </span>' +
    '    <span class="auth-name">' +
    '        歌手' +
    '    </span>' +
    '    <span class="music-name">' +
    '        歌曲' +
    '    </span>' +
    '</div>';
    rem.mainList.append(html);
}

// 列表中新增一项
// 参数：编号、名字、歌手、专辑
function addItem(no, name, auth, album) {
    var html = '<div class="list-item" data-no="' + (no - 1) + '">' +
    '    <span class="list-num">' + no + '</span>' +
    '    <span class="list-mobile-menu"></span>' +
    '    <span class="music-album">' + album + '</span>' +
    '    <span class="auth-name">' + auth + '</span>' +
    '    <span class="music-name">' + name + '</span>' +
    '</div>'; 
    rem.mainList.append(html);
}

// 加载列表中的提示条
// 参数：类型（more、nomore、loading、nodata、clear）
function addListbar(types) {
    var html
    switch(types) {
        case "more":    // 还可以加载更多
            html = '<div class="list-item text-center list-loadmore list-clickable" title="点击加载更多数据" id="list-foot">点击加载更多...</div>';
        break;
        
        case "nomore":  // 数据加载完了
            html = '<div class="list-item text-center" id="list-foot">全都加载完了</div>';
        break;
        
        case "loading": // 加载中
            html = '<div class="list-item text-center" id="list-foot">播放列表加载中...</div>';
        break;
        
        case "nodata":  // 列表中没有内容
            html = '<div class="list-item text-center" id="list-foot">可能是个假列表，什么也没有</div>';
        break;
        
        case "clear":   // 清空列表
            html = '<div class="list-item text-center list-clickable" id="list-foot" onclick="clearDislist();">清空列表</div>';
        break;
    }
    rem.mainList.append(html);
}

// 将时间格式化为 00:00 的格式
// 参数：原始时间
function formatTime(time){    
	var hour,minute,second;
	hour = String(parseInt(time/3600,10));
	if(hour.length == 1) hour='0' + hour;
	
	minute=String(parseInt((time%3600)/60,10));
	if(minute.length == 1) minute='0'+minute;
	
	second=String(parseInt(time%60,10));
	if(second.length == 1) second='0'+second;
	
	if(hour > 0) {
	    return hour + ":" + minute + ":" + second;
	} else {
	    return minute + ":" + second;
	}
}

// url编码
// 输入参数：待编码的字符串
function urlEncode(String) {
    return encodeURIComponent(String).replace(/'/g,"%27").replace(/"/g,"%22");	
}

// 在 ajax 获取了音乐的信息后再进行更新
// 参数：要进行更新的音乐
function updateMinfo(music) {
    // 不含有 id 的歌曲无法更新
    if(!music.id) return false;
    
    // 循环查找播放列表并更新信息
    for(var i=0; i<musicList.length; i++) {
        for(var j=0; j<musicList[i].item.length; j++) {
            // ID 对上了，那就更新信息
            if(musicList[i].item[j].id == music.id && musicList[i].item[j].source == music.source) {
                musicList[i].item[j] == music;  // 更新音乐信息
                j = musicList[i].item.length;   // 一个列表中只找一首，找到了就跳出
            }
        }
    }
}

// 刷新当前显示的列表，如果有正在播放则添加样式
function refreshList() {
    // 还没播放过，不用对比了
    if(rem.playlist === undefined) return true;
    
    $(".list-playing").removeClass("list-playing");        // 移除其它的正在播放
    
    if(rem.paused !== true) {   // 没有暂停
        for(var i=0; i<musicList[rem.dislist].item.length; i++) {
            // 与正在播放的歌曲 id 相同
            if((musicList[rem.dislist].item[i].id !== undefined) && 
              (musicList[rem.dislist].item[i].id == musicList[1].item[rem.playid].id) && 
              (musicList[rem.dislist].item[i].source == musicList[1].item[rem.playid].source)) {
                $(".list-item[data-no='" + i + "']").addClass("list-playing");  // 添加正在播放样式
                
                return true;    // 一般列表中只有一首，找到了赶紧跳出
            }
        }
    }
    
}
// 添加一个歌单
// 参数：编号、歌单名字、歌单封面
function addSheet(no, name, cover) {
    if(!cover) cover = "images/player_cover.png";
    if(!name) name = "读取中...";
    
    var html = '<div class="sheet-item" data-no="' + no + '">' +
    '    <img class="sheet-cover" src="' +cover+ '">' +
    '    <p class="sheet-name">' +name+ '</p>' +
    '</div>'; 
    rem.sheetList.append(html);
}
// 清空歌单显示
function clearSheet() {
    rem.sheetList.html('');
}

// 歌单列表底部登陆条
function sheetBar() {
    var barHtml;
    if(playerReaddata('uid')) {
        barHtml = '已同步 ' + rem.uname + ' 的歌单 <span class="login-btn login-refresh">[刷新]</span> <span class="login-btn login-out">[退出]</span>';
    } else {
        barHtml = '我的歌单 <span class="login-btn login-in">[点击同步]</span>';
    }
    barHtml = '<span id="sheet-bar"><div class="clear-fix"></div>' +
    '<div id="user-login" class="sheet-title-bar">' + barHtml + 
    '</div></span>'; 
    rem.sheetList.append(barHtml);
}

// 选择要显示哪个数据区
// 参数：要显示的数据区（list、sheet、player）
function dataBox(choose) {
    $('.btn-box .active').removeClass('active');
    switch(choose) {
        case "list":    // 显示播放列表
            if($(".btn[data-action='player']").css('display') !== 'none') {
                $("#player").hide();
            } else if ($("#player").css('display') == 'none') {
                $("#player").fadeIn();
            }
            $("#main-list").fadeIn();
            $("#sheet").fadeOut();
            if(rem.dislist == 1 || rem.dislist == rem.playlist) {  // 正在播放
                $(".btn[data-action='playing']").addClass('active');
            } else if(rem.dislist == 0) {  // 搜索
                $(".btn[data-action='search']").addClass('active');
            }
        break;
        
        case "sheet":   // 显示专辑
            if($(".btn[data-action='player']").css('display') !== 'none') {
                $("#player").hide();
            } else if ($("#player").css('display') == 'none') {
                $("#player").fadeIn();
            }
            $("#sheet").fadeIn();
            $("#main-list").fadeOut();
            $(".btn[data-action='sheet']").addClass('active');
        break;
        
        case "player":  // 显示播放器
            $("#player").fadeIn();
            $("#sheet").fadeOut();
            $("#main-list").fadeOut();
            $(".btn[data-action='player']").addClass('active');
        break;
    }
}

// 将当前歌曲加入播放历史
// 参数：要添加的音乐
function addHis(music) {
    if(rem.playlist == 2) return true;  // 在播放“播放记录”列表则不作改变
    
    if(musicList[2].item.length > 300) musicList[2].item.length = 299; // 限定播放历史最多是 300 首
    
    if(music.id !== undefined && music.id !== '') {
        // 检查历史数据中是否有这首歌，如果有则提至前面
        for(var i=0; i<musicList[2].item.length; i++) {
            if(musicList[2].item[i].id == music.id && musicList[2].item[i].source == music.source) {
                musicList[2].item.splice(i, 1); // 先删除相同的
                i = musicList[2].item.length;   // 找到了，跳出循环
            }
        }
    }
    
    // 再放到第一位
    musicList[2].item.unshift(music);
    
    playerSavedata('his', musicList[2].item);  // 保存播放历史列表
}

// 初始化播放列表
function initList() {
    // 登陆过，那就读取出用户的歌单，并追加到系统歌单的后面
    if(playerReaddata('uid')) {
        rem.uid = playerReaddata('uid');
        rem.uname = playerReaddata('uname');
        // musicList.push(playerReaddata('ulist'));
        var tmp_ulist = playerReaddata('ulist');    // 读取本地记录的用户歌单
        
        if(tmp_ulist) musicList.push.apply(musicList, tmp_ulist);   // 追加到系统歌单的后面
    }
    
    // 显示所有的歌单
    for(var i=1; i<musicList.length; i++) {
        
        if(i == 1) {    // 正在播放列表
            // 读取正在播放列表
            var tmp_item = playerReaddata('playing');
            if(tmp_item) {  // 读取到了正在播放列表
                musicList[1].item = tmp_item;
                mkPlayer.defaultlist = 1;   // 默认显示正在播放列表
            }
            
        } else if(i == 2) { // 历史记录列表
            // 读取历史记录
            var tmp_item = playerReaddata('his');
            if(tmp_item) {
                musicList[2].item = tmp_item;
            }
            
         // 列表不是用户列表，并且信息为空，需要ajax读取列表
        }else if(!musicList[i].creatorID && (musicList[i].item == undefined || (i>2 && musicList[i].item.length == 0))) {   
            musicList[i].item = [];
            if(musicList[i].id) {   // 列表ID已定义
                // ajax获取列表信息
                ajaxPlayList(musicList[i].id, i);
            } else {    // 列表 ID 未定义
                if(!musicList[i].name) musicList[i].name = '未命名';
            }
        }
        
        // 在前端显示出来
        addSheet(i, musicList[i].name, musicList[i].cover);
    }
    
    // 登陆了，但歌单又没有，说明是在刷新歌单
    if(playerReaddata('uid') && !tmp_ulist) {
        ajaxUserList(rem.uid);
        return true;
    }
    
    // 首页显示默认列表
    if(mkPlayer.defaultlist >= musicList.length) mkPlayer.defaultlist = 1;  // 超出范围，显示正在播放列表
    
    if(musicList[mkPlayer.defaultlist].isloading !== true)  loadList(mkPlayer.defaultlist);
    
    // 显示最后一项登陆条
    sheetBar();
}

// 清空用户的同步列表
function clearUserlist() {
    if(!rem.uid) return false;
    
    // 查找用户歌单起点
    for(var i=1; i<musicList.length; i++) {
        if(musicList[i].creatorID !== undefined && musicList[i].creatorID == rem.uid) break;    // 找到了就退出
    }
    
    // 删除记忆数组
    musicList.splice(i, musicList.length - i); // 先删除相同的
    musicList.length = i;
    
    // 刷新列表显示
    clearSheet();
    initList();
}

// 清空当前显示的列表
function clearDislist() {
    musicList[rem.dislist].item.length = 0;  // 清空内容
    if(rem.dislist == 1) {  // 正在播放列表
        playerSavedata('playing', '');  // 清空本地记录
        $(".sheet-item[data-no='1'] .sheet-cover").attr('src', 'images/player_cover.png');    // 恢复正在播放的封面
    } else if(rem.dislist == 2) {   // 播放记录
        playerSavedata('his', '');  // 清空本地记录
    }
    layer.msg('列表已被清空');
    dataBox("sheet");    // 在主界面显示出音乐专辑
}

// 刷新播放列表，为正在播放的项添加正在播放中的标识
function refreshSheet() {
    // 调试信息输出
    if(mkPlayer.debug) {
        console.log("开始播放列表 " + musicList[rem.playlist].name + " 中的歌曲");
    }
    
    $(".sheet-playing").removeClass("sheet-playing");        // 移除其它的正在播放
    
    $(".sheet-item[data-no='" + rem.playlist + "']").addClass("sheet-playing"); // 添加样式
}

// 播放器本地存储信息
// 参数：键值、数据
function playerSavedata(key, data) {
    key = 'mkPlayer2_' + key;    // 添加前缀，防止串用
    data = JSON.stringify(data);
    // 存储，IE6~7 不支持HTML5本地存储
    if (window.localStorage) {
        localStorage.setItem(key, data);	
    }
}

// 播放器读取本地存储信息
// 参数：键值
// 返回：数据
function playerReaddata(key) {
    if(!window.localStorage) return '';
    key = 'mkPlayer2_' + key;
    return JSON.parse(localStorage.getItem(key));
}
