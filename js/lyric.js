/**************************************************
 * MKOnlinePlayer v2.0
 * 歌词解析及滚动模块
 * 编写：mengkun(http://mkblog.cn)
 * 时间：2017-3-16
 *************************************************/
 
var lyricArea = $("#lyric");    // 歌词显示容器

// 歌曲加载完后的回调函数
// 参数：歌词源文件
function lyricCallback(str) {
    rem.lyric = parseLyric(str);    // 解析获取到的歌词
    
    lyricArea.html('');     // 清空歌词区域的内容
    lyricArea.scrollLeft(0);    // 滚动到顶部
    
    // 显示全部歌词
    for(var k in rem.lyric){
        var txt = rem.lyric[k];
        if(!txt) txt = "&nbsp;";
        var li = $("<li>"+txt+"</li>");
        lyricArea.append(li);
    }
}

// 强制刷新当前时间点的歌词
// 参数：当前播放时间（单位：秒）
function refreshLyric(time) {
    time = parseInt(time);  // 时间取整
    var i = 0;
    for(var k in rem.lyric){
        if(k >= time) break;
        i = k;      // 记录上一句的
    }
    
    scrollLyric(i);
}

// 滚动歌词
// 参数：当前播放时间（单位：秒）
function scrollLyric(time) {
    time = parseInt(time);  // 时间取整
    
    if(rem.lyric === undefined || rem.lyric[time] === undefined) return false;  // 当前时间点没有歌词
    
    if(rem.lastLyric == time) return true;  // 歌词没发生改变
    
    var i = 0;  // 获取当前歌词是在第几行
    for(var k in rem.lyric){
        if(k == time) break;
        i ++;
    }
    rem.lastLyric = time;  // 记录方便下次使用
    $(".lplaying").removeClass("lplaying");
    lyricArea.children().eq(i).attr("class","lplaying");    // 加上正在播放样式
    
    var scroll = (lyricArea.children().height() * i) - ($(".lyric").height() / 2); 
    lyricArea.stop().animate({scrollTop: scroll}, 300);  // 平滑滚动到当前歌词位置
    
}

// 解析歌词
// 参数：原始歌词文件
function parseLyric(lrc) {
    var lyrics = lrc.split("\n");
    var lrcObj = {};
    for(var i=0;i<lyrics.length;i++){
        var lyric = decodeURIComponent(lyrics[i]);
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        var timeRegExpArr = lyric.match(timeReg);
        if(!timeRegExpArr)continue;
        var clause = lyric.replace(timeReg,'');
        for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            lrcObj[time] = clause;
        }
    }
    return lrcObj;
}
