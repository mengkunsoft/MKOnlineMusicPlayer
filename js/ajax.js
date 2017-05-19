/**************************************************
 * MKOnlinePlayer v2.2
 * Ajax 后台数据交互请求模块
 * 编写：mengkun(http://mkblog.cn)
 * 时间：2017-3-26
 *************************************************/

// ajax加载搜索结果
function ajaxSearch() {
    if(rem.loadPage == 1) { // 弹出搜索提示
        var tmpLoading = layer.msg('搜索中', {icon: 16,shade: 0.01});
    }
    $.ajax({
        type: mkPlayer.method, 
        url: mkPlayer.api, 
        data: "types=search&count=" + mkPlayer.loadcount + "&pages=" + rem.loadPage + "&name=" + rem.wd,
        dataType : "jsonp",
        complete: function(XMLHttpRequest, textStatus) {
            if(tmpLoading) layer.close(tmpLoading);    // 关闭加载中动画
        },  // complete
        success: function(jsonData){
            if(jsonData.code == "-1"){
                layer.msg('搜索内容不能为空', {anim:6});
                return false;
            }
            
            if(jsonData.result === undefined || jsonData.result.songCount === undefined || jsonData.result.songCount == "0")
            {
                layer.msg('没有找到相关歌曲', {anim:6});
                return false;
            }
            
            // 调试信息输出
            if(mkPlayer.debug) {
                console.log("搜索结果获取成功");
            }
            
            if(rem.loadPage == 1)   // 加载第一页，清空列表
            {
                musicList[0].item = [];
                rem.mainList.html('');   // 清空列表中原有的元素
                addListhead();      // 加载列表头
            } else {
                $("#list-foot").remove();     //已经是加载后面的页码了，删除之前的“加载更多”提示
            }
            
            if(typeof jsonData.result.songs === undefined || typeof jsonData.result.songs == "undefined")
            {
                addListbar("nomore");  // 加载完了
                return false;
            }
            
            var tempItem = [], no = musicList[0].item.length;
            
            for (var i = 0; i < jsonData.result.songs.length; i++) {
                no ++;
                tempItem =  {
                    musicName: jsonData.result.songs[i].name,  // 音乐名字
                    artistsName: jsonData.result.songs[i].ar[0].name, // 艺术家名字
                    albumName: jsonData.result.songs[i].al.name,    // 专辑名字
                    albumPic: null,    // 专辑图片
                    musicId: jsonData.result.songs[i].id,  // 网易云音乐ID
                    mp3Url: null // mp3链接
                };
                musicList[0].item.push(tempItem);   // 保存到搜索结果临时列表中
                addItem(no, tempItem.musicName, tempItem.artistsName, tempItem.albumName);  // 在前端显示
            }
            
            rem.dislist = 0;    // 当前显示的是搜索列表
            rem.loadPage ++;    // 已加载的列数+1
            
            dataBox("list");    // 在主界面显示出播放列表
            refreshList();  // 刷新列表，添加正在播放样式
            
            if(no < mkPlayer.loadcount) {
                addListbar("nomore");  // 没加载满，说明已经加载完了
            } else {
                addListbar("more");     // 还可以点击加载更多
            }
        },   //success
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('搜索结果获取失败 - ' + XMLHttpRequest.status);
        }   // error
    });//ajax
}

// 完善获取音乐信息
// 音乐所在列表ID、音乐对应ID、回调函数
function ajaxUrl(music, callback)
{
    // 已经有数据，直接回调
    if(music.mp3Url !== null && music.mp3Url !== "err") {
        callback(music);
        return true;
    }
    // id为空，赋值链接错误。直接回调
    if(music.musicId === null) {
        musicList[listID].item[musicID].mp3Url = "err";
        callback(music);
        return true;
    }
    
    $.ajax({ 
        type: mkPlayer.method, 
        url: mkPlayer.api,
        data: "types=musicInfo&id=" + music.musicId,
        dataType : "jsonp",
        success: function(jsonData){
            var mp3Url, picUrl;
            mp3Url = jsonData.url;  // 获取音乐链接
            
            // 调试信息输出
            if(mkPlayer.debug) {
                console.log("歌曲信息获取成功");
            }
            
            if(!mp3Url) mp3Url = "err";
            if(!picUrl) picUrl = null;
            
            music.mp3Url = mp3Url;    // 记录结果
            // music.albumPic = picUrl;
            
            updateMinfo(music); // 更新音乐信息
            
            callback(music);    // 回调函数
            return true;
        },   //success
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('歌曲信息获取失败 - ' + XMLHttpRequest.status);
        }   // error 
    }); //ajax
    
}

// ajax加载用户歌单
// 参数：歌单网易云 id, 歌单存储 id，回调函数
function ajaxPlayList(lid, id, callback){
    if(!lid) return false;
    
    // 已经在加载了，跳过
    if(musicList[id].isloading === true) {
        layer.msg('列表读取中...', {icon: 16,shade: 0.01,time: 500}); //0代表加载的风格，支持0-2
        return true;
    }
    
    musicList[id].isloading = true; // 更新状态：列表加载中
    
    $.ajax({
        type: mkPlayer.method, 
        url: mkPlayer.api, 
        data: "types=playlist&id=" + lid,
        dataType : "jsonp",
        complete: function(XMLHttpRequest, textStatus) {
            musicList[id].isloading = false;    // 列表已经加载完了
        },  // complete
        success: function(jsonData){
            // 存储歌单信息
            var tempList = {
                id: lid,    // 列表的网易云 id
                name: jsonData.playlist.name,   // 列表名字
                cover: jsonData.playlist.coverImgUrl,   // 列表封面
                creatorName: jsonData.playlist.creator.nickname,   // 列表创建者名字
                creatorAvatar: jsonData.playlist.creator.avatarUrl,   // 列表创建者头像
                item: []
            };
            
            if(jsonData.playlist.coverImgUrl !== '') {
                tempList.cover = jsonData.playlist.coverImgUrl;
            } else {
                tempList.cover = musicList[id].cover;
            }
            
            if(typeof jsonData.playlist.tracks !== undefined || jsonData.playlist.tracks.length !== 0) {
                // 存储歌单中的音乐信息
                for (var i = 0; i < jsonData.playlist.tracks.length; i++) {
                    tempList.item[i] =  {
                        musicName: jsonData.playlist.tracks[i].name,  // 音乐名字
                        artistsName: jsonData.playlist.tracks[i].ar[0].name, // 艺术家名字
                        albumName: jsonData.playlist.tracks[i].al.name,    // 专辑名字
                        albumPic: jsonData.playlist.tracks[i].al.picUrl,    // 专辑图片
                        musicId: jsonData.playlist.tracks[i].id,  // 网易云音乐ID
                        mp3Url: null//urlHandle(jsonData.playlist.tracks[i].mp3Url) // mp3链接
                    };
                }
            }
            
            // 歌单用户 id 不能丢
            if(musicList[id].creatorID) {
                tempList.creatorID = musicList[id].creatorID;
                if(musicList[id].creatorID === rem.uid) {   // 是当前登录用户的歌单，要保存到缓存中
                    var tmpUlist = playerReaddata('ulist');    // 读取本地记录的用户歌单
                    if(tmpUlist) {  // 读取到了
                        for(i=0; i<tmpUlist.length; i++) {  // 匹配歌单
                            if(tmpUlist[i].id == lid) {
                                tmpUlist[i] = tempList; // 保存歌单中的歌曲
                                playerSavedata('ulist', tmpUlist);  // 保存
                                break;
                            }
                        }
                    }
                }
            }
            
            // 存储列表信息
            musicList[id] = tempList;
            
            // 首页显示默认列表
            if(id == mkPlayer.defaultlist) loadList(id);
            if(callback) callback(id);    // 调用回调函数
            
            // 改变前端列表
            $(".sheet-item[data-no='" + id + "'] .sheet-cover").attr('src', tempList.cover);    // 专辑封面
            $(".sheet-item[data-no='" + id + "'] .sheet-name").html(tempList.name);     // 专辑名字
            
            // 调试信息输出
            if(mkPlayer.debug) {
                console.log("歌单 [" +tempList.name+ "] 中的音乐获取成功");
            }
        },   //success
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('歌单读取失败 - ' + XMLHttpRequest.status);
            $(".sheet-item[data-no='" + id + "'] .sheet-name").html('<span style="color: #EA8383">读取失败</span>');     // 专辑名字
        }   // error  
    });//ajax
}

// ajax加载歌词
// 参数：音乐ID，回调函数
function ajaxLyric(mid, callback) {
    lyricTip('歌词加载中...');
    
    if(!mid) callback('');  // 没有音乐ID，直接返回
    
    $.ajax({
        type: mkPlayer.method,
        url: mkPlayer.api,
        data: "types=lyric&id=" + mid,
        dataType : "jsonp",
        success: function(jsonData){
            if(jsonData.code == -1) {
                console.log("歌曲ID为空");
                return false;
            }
            
            var lyric;
            if ((jsonData.nolyric === true)||(typeof jsonData.lrc === undefined) || (typeof jsonData.lrc == "undefined")||(typeof jsonData.lrc.lyric === undefined) || (typeof jsonData.lrc.lyric == "undefined"))  //没有歌词
            {
                lyric = '';
            } else {
                lyric = jsonData.lrc.lyric;
            }
            
            // 调试信息输出
            if(mkPlayer.debug) {
                console.log("歌词获取成功");
            }
            
            callback(lyric);    // 回调函数
        },   //success
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('歌词读取失败 - ' + XMLHttpRequest.status);
            callback('');    // 回调函数
        }   // error   
    });//ajax
}


// ajax加载用户的播放列表
// 参数 用户的网易云 id
function ajaxUserList(uid)
{
    var tmpLoading = layer.msg('加载中...', {icon: 16,shade: 0.01});
    $.ajax({
        type: mkPlayer.method,
        url: mkPlayer.api,
        data: "types=userlist&uid=" + uid,
        dataType : "jsonp",
        complete: function(XMLHttpRequest, textStatus) {
            if(tmpLoading) layer.close(tmpLoading);    // 关闭加载中动画
        },  // complete
        success: function(jsonData){
            if(jsonData.code == "-1" || jsonData.code == 400){
                layer.msg('用户 uid 输入有误');
                return false;
            }
            
            if(jsonData.playlist.length === 0 || typeof(jsonData.playlist.length) === "undefined")
            {
                layer.msg('没找到用户 ' + uid + ' 的歌单');
                return false;
            }else{
                var tempList,userList = [];
                $("#sheet-bar").remove();   // 移除登陆条
                rem.uid = uid;  // 记录已同步用户 uid
                rem.uname = jsonData.playlist[0].creator.nickname;  // 第一个列表(喜欢列表)的创建者即用户昵称
                layer.msg('欢迎您 '+rem.uname);
                // 记录登录用户
                playerSavedata('uid', rem.uid);
                playerSavedata('uname', rem.uname);
                
                for (var i = 0; i < jsonData.playlist.length; i++)
                {
                    // 获取歌单信息
                    tempList = {
                        id: jsonData.playlist[i].id,    // 列表的网易云 id
                        name: jsonData.playlist[i].name,   // 列表名字
                        cover: jsonData.playlist[i].coverImgUrl,   // 列表封面
                        creatorID: uid,   // 列表创建者id
                        creatorName: jsonData.playlist[i].creator.nickname,   // 列表创建者名字
                        creatorAvatar: jsonData.playlist[i].creator.avatarUrl,   // 列表创建者头像
                        item: []
                    };
                    // 存储并显示播放列表
                    addSheet(musicList.push(tempList) - 1, tempList.name, tempList.cover);
                    userList.push(tempList);
                }
                playerSavedata('ulist', userList);
                // 显示退出登录的提示条
                sheetBar();
            }
            // 调试信息输出
            if(mkPlayer.debug) {
                console.log("用户歌单获取成功 [用户网易云ID：" + uid + "]");
            }
        },   //success
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('歌单同步失败 - ' + XMLHttpRequest.status);
            console.log(XMLHttpRequest + textStatus + errorThrown);
        }   // error
    });//ajax
    return true;
}