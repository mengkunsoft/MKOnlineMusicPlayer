<?php

/*
    MK在线音乐播放器 V 1.0
    支持搜索并播放音乐；
    支持一键提取音乐外链；
    支持显示歌曲封面、歌词。
    
    首发于吾爱破解论坛（http://www.52pojie.cn/）
    孟坤网页实验室（http://lab.mkblog.cn/）出品
    
    前端界面修改自 http://sc.chinaz.com/jiaoben/150714514230.htm
    音乐资源来自于 网易云音乐
    
    二次开发请保留以上信息，谢谢！
*/

//参考资料
//https://segmentfault.com/q/1010000002941430/a-1020000002941456
//http://www.itiyun.com/ent-163-music-api.html
//http://moonlib.com/606.html
//http://www.miyay.cn/83.html

//前端界面来自 http://sc.chinaz.com/jiaoben/150714514230.htm

header("Content-type:text/html;charset=utf-8");

function curl($url,$post_data){ //从网易云音乐读取数据
    $curl = curl_init();

    curl_setopt($curl, CURLOPT_URL,$url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER,1);

    $header =array(
        'Host: music.163.com',
        'Origin: http://music.163.com',
        'User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36',
        'Content-Type: application/x-www-form-urlencoded',
        'Referer: http://music.163.com/search/',
    );

    curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
    $src = curl_exec($curl);
    curl_close($curl);
    return $src;
}

@$types = $_POST['types']?$_POST['types']:$_GET['types'];  //api类型
switch($types)
{
    case "musicInfo":   //获取歌曲信息
        @$id = $_POST['id']?$_POST['id']:$_GET['id'];  //歌曲ID
        if(!$id){
            $tempArr = array("code"=>-1,"msg"=>"歌曲ID为空");
            echojson(json_encode($tempArr));
        }else{
            $url= "http://music.163.com/api/song/detail/?id={$id}&ids=%5B{$id}%5D&csrf_token=";    //请求url
            $post_data = '';
            echojson(curl($url,$post_data));
        }
        break;
    
    case "lyric":       //获取歌词
        @$id = $_POST['id']?$_POST['id']:$_GET['id'];  //歌曲ID
        if(!$id){
            $tempArr = array("code"=>-1,"msg"=>"歌曲ID为空");
            echojson(json_encode($tempArr));
        }else{
            $url = "http://music.163.com/api/song/lyric?os=pc&id=" . $id . "&lv=-1&kv=-1&tv=-1";    //请求url
            $post_data = '';
            echojson(curl($url,$post_data));
        }
        break;
        
    case "download":    //下载歌曲
        @$fileurl = $_POST['url']?$_POST['url']:$_GET['url'];  //链接
        @$musicname = $_POST['name']?$_POST['name']:$_GET['name'];  //歌曲名字
        
        if(!$fileurl){
            $tempArr = array("code"=>-1,"msg"=>"歌曲链接为空");
            echojson(json_encode($tempArr));
        }else{

            $ua = $_SERVER["HTTP_USER_AGENT"]; 
            $filename = $musicname . ".mp3";
            $encoded_filename = urlencode($filename); 
            $encoded_filename = str_replace("+", "%20", $encoded_filename); 
            header("Content-Type: application/force-download");
            if (preg_match("/MSIE/", $ua)) { 
                header('Content-Disposition: attachment; filename="' . $encoded_filename . '"'); 
            } else if (preg_match("/Firefox/", $ua)) {  //火狐浏览器
                header('Content-Disposition: attachment; filename*="utf8\'\'' . $filename . '"'); 
            } else if (preg_match("/Edge/", $ua)) {  //edge浏览器
                header('Content-Disposition: attachment; filename="' . $encoded_filename . '"'); 
            } else { 
                header('Content-Disposition: attachment; filename="' . $filename . '"'); 
            } 
            //echo $musicname;
            //header("Content-Type: application/force-download");
            //header('Content-Disposition: attachment; filename="'.$musicname.'.mp3"');
            //header('Content-Transfer-Encoding: binary'); 
            $mp3file = file_get_contents($fileurl); 
            echo $mp3file;
        }
        break;
    
    case "userlist":    //获取用户歌单
        //http://music.163.com/api/user/playlist/?offset=0&limit=1001&uid=275545417
        break;
     
    case "search":  //搜索歌曲
    default:
        @$s = $_POST['name']?$_POST['name']:$_GET['name'];  //歌名
        @$limit = $_POST['count']?$_POST['count']:$_GET['count'];  //每页显示数量
        @$pages = $_POST['pages']?$_POST['pages']:$_GET['pages'];  //页码
        if($pages>1000 || $pages<1)$pages=1;    //纠正错误的值
        if($limit == "") $limit = 20;
        @$offset= ($pages-1) * $limit;     //偏移量
        
        if(!$s){
            $tempArr = array("code"=>-1,"msg"=>"歌名为空");
            echojson(json_encode($tempArr));
        }else{
            $url= "http://music.163.com/api/search/get/web?csrf_token=";    //请求url
            $post_data = 'hlpretag=<span class="s-fc7">&hlposttag=</span>&s='. $s . '&type=1&offset='. $offset . '&total=true&limit=' . $limit;
            echojson(curl($url,$post_data));
        }   
}

function echojson($data)    //json和jsonp通用
{
    @$callback = $_POST['callback']?$_POST['callback']:$_GET['callback'];
    if($callback != "") //输出jsonp格式
    {
        echo $callback."(".$data.")";
    }
    else
    {
        echo $data;
    }
}