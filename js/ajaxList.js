/*
    MK在线音乐播放器 V 1.1
    支持搜索并播放音乐；
    支持一键提取音乐外链；
    支持显示歌曲封面、歌词。
    
    首发于吾爱破解论坛（http://www.52pojie.cn/）
    孟坤网页实验室（http://lab.mkblog.cn/）出品
    
    前端界面修改自 http://sc.chinaz.com/jiaoben/150714514230.htm
    音乐资源来自于 网易云音乐
    
    二次开发请保留以上信息，谢谢！
*/

$(function(){
    /*歌曲列表效果*/
	$(".songList").hover(function(){
		$(this).find(".more").show();
		$(this).find(".dele").show();
	},function(){
		$(this).find(".more").hide();
		$(this).find(".dele").hide();
	});
	
	$(".cannotclick").click(function(){
	    showTips("Sorry,该功能暂未上线!");
    });
	
	/*复选框*/
    $('.checkIn').click(function(){
		var s = $(this).attr("select");
		if (s == "0") {
			$(this).css("background-position","-37px -710px");
			$(this).attr("select","1");
		}
		if (s == "1") {
			$(this).css("background-position","");
			$(this).attr("select","0");
		}		
	});
	
	/*点击列表播放按钮*/
	$('.start em').click(function(){
		/*开始放歌*/
		songIndex = $(this).attr("sonN"); //获取歌曲在列表中的ID
		musicID = $(this).attr("musicID");  //获取歌曲的网易云ID
		
		if((typeof($(this).attr("musicURL"))=="undefined") || (typeof($(this).attr("musicURL"))=="undefined"))  //先直接读取看有没有
		{
    		$.ajax({                                //调用jquery的ajax方法
                type: "POST",                       //设置ajax方法提交数据的形式   
                url: APIurl,                      //把数据提交到ok.php   
                data: "types=musicInfo&id=" + musicID, //输入框writer中的值作为提交的数据 
                dataType : "jsonp",
                jsonp: "callback",//参数名
                jsonpCallback:"mkPlayerCallBack",//函数名
                success: function(jsonData){             //提交成功后的回调，msg变量是ok.php输出的内容。   
                    
                    //console.log(jsonData);  //控制台输出返回的json（用于调试）
                    //jsonData=JSON.parse(jsonData);
                    
                    switch(jsonData.code)
                    {
                        case "-1":
                            console.log("歌曲ID为空");
                        break;
                        
                        //case "200":
                        default:
                            var mp3Url = jsonData.songs[0].mp3Url;  //获取音乐链接
                            var picUrl = jsonData.songs[0].album.picUrl;    //获取音乐图片
                            if(mp3Url === null) //已下架的歌曲获取到的链接为空
                            {
                                showTips("抱歉，这首歌暂时无法播放！");  //弹出提示
                            }
                            else
                            {
                                mp3Url = mp3Url.replace("http:\/\/m", "http://p");   //替换无版权链接算法
                                //console.log("mp3链接地址已获取-" + mp3Url);
                                playmp3(mp3Url,picUrl);    //播放音乐
                                $(".start em[sonN=" + songIndex + "]").attr({musicURL:mp3Url,picURL:picUrl});   //保存获取的结果
                            }

                    } 
                }   
            }); //ajax
		}
		else
		{
	        musicURL = $(this).attr("musicURL");  //获取歌曲的url
		    picURL = $(this).attr("picURL");  //获取歌曲的图片地址
		    playmp3(musicURL,picURL);    //播放音乐
		}
	}); /*点击列表播放按钮*/
	
	function playmp3(url,picUrl){      //播放音乐
	    $("#audio").attr("src",url);	
		audio=document.getElementById("audio");//获得音频元素
		
		$(".dian").css("left",0);   //进度条归位
		$(".duration").html("00:00");//总时间归零
		$(".position").html("00:00");//当前时间归零
		
		audio.play();
		audio.addEventListener('timeupdate',updateProgress,false);  //显示歌曲总长度
		audio.addEventListener('play',audioPlay,false); //开始播放了
		audio.addEventListener('pause',audioPause,false);   //暂停
		audio.addEventListener('ended',audioEnded,false);   //播放结束
		
		/*播放歌词*/
		getReady(songIndex);//准备播放
		mPlay();//显示歌词
		//对audio元素监听pause事件
		
		/*底部显示歌曲信息*/
		var songName=$(".start em[sonN=" + songIndex + "]").parent().parent().find(".colsn").html();
		var singerName =$(".start em[sonN=" + songIndex + "]").parent().parent().find(".colcn").html();
		$(".songName").html(songName);
		$(".songPlayer").html(singerName);
		
		/*外观改变*/
		var html="";
		html+='<div class="manyou">';
		html+=' <a href="' + APIurl +'?types=download&url=' + url + '&name=' + urlEncode(songName) + ' - ' + urlEncode(singerName) + '" class="manyouA" target="_blank">下载这首歌曲</a>';
		html+='</div>';
		$(".start em").css({
			"background":"",
			"color":""
		});
		$(".manyou").remove();  //移除之前的漫游(歌曲下载)
		$(".songList").css("background-color","#fff");  //把列表框所有条目背景色还原

		$(".start em[sonN=" + songIndex + "]").parent().parent().parent().append(html);
		$(".start em[sonN=" + songIndex + "]").parent().parent().parent().css("background-color","#f0f0f0");

		
		/*换右侧图片*/
		$("#canvas1").attr("src",picUrl);   //歌曲封面
		$("#canvas1").load(function(){
			loadBG();
		});
		
		//setTimeout('loadBG()',100);
		
		$(".blur").css("opacity","0");
		$(".blur").animate({opacity:"1"},1000);
	}
	/*双击播放*/
	$('.songList').dblclick(function(){
	    //console.log("双击播放");
		var sid = $(this).find(".start em").html();
		$(".start em[sonN="+sid+"]").click();
	});
	
	//更多 按钮的点击事件
	$(".more").click(function(){
		var songUrl = $(this).parent().parent().find(".start em").attr("musicURL"); //获取外链
		
		if((typeof(songUrl)=="undefined") || (typeof(songUrl)=="undefined"))    //还没播放过（额，这是一个偷懒的做法，得改！）
		{
		    showTips("请先播放这首歌再尝试获取外链");
		    return 1;
		}
		
		var songName = $(this).parent().parent().find(".colsn").html(); //获取歌名
		var singerName = $(this).parent().parent().find(".colcn").html();   //获取歌手
		//alert(songUrl+songName+singerName);
		
		showMusicUrl(singerName + ' - ' + songName,songUrl); //显示歌曲外链
	});
	
});