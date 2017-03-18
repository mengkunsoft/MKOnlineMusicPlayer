<?php
/**************************************************
 * MKOnlinePlayer v2.0
 * 后台音乐数据抓取模块
 * 编写：mengkun(http://mkblog.cn)
 * 时间：2017-3-16
 *************************************************/

// api设置
$GLOBALS['config'] = array(
    'proxy' => false,    // 是否使用代理（true/false）
    'proxyIP' => '222.186.34.84',    // 代理 IP
    'proxyPort' => 8998,    // 代理端口
    'proxyUserpwd' => ''    // 代理账号及密码(不需要则留空) 格式为 '用户名:密码'
);

//参考资料
// https://github.com/darknessomi/musicbox/wiki/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90API%E5%88%86%E6%9E%90

/**
 * Curl网易云获取数据函数
 * @param $url api url
 * @param $post_data post传送的数据
 * @return 获取结果
 */
function curl($url, $post_data){ //从网易云音乐读取数据
    $curl = curl_init();
    $header =array(
        'Host: music.163.com',
        'Origin: http://music.163.com',
        'User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36',
        'Content-Type: application/x-www-form-urlencoded',
        'Referer: http://music.163.com/search/',
    );
    curl_setopt($curl, CURLOPT_URL,$url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER,1);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
    
    if($GLOBALS['config']['proxy'] == true) {    // 开启了代理
        curl_setopt($curl, CURLOPT_PROXYAUTH, CURLAUTH_BASIC); // 代理认证模式
        curl_setopt($curl, CURLOPT_PROXY, $GLOBALS['config']['proxyIP']); // 代理服务器地址
        curl_setopt($curl, CURLOPT_PROXYPORT, $GLOBALS['config']['proxyPort']); // 代理服务器端口
        if($GLOBALS['config']['proxyUserpwd'] != '') {
            curl_setopt($curl, CURLOPT_PROXYUSERPWD, $GLOBALS['config']['proxyUserpwd']); // http代理认证帐号，username:password的格式
        }
        curl_setopt($curl, CURLOPT_PROXYTYPE, CURLPROXY_HTTP); // 使用http代理模式
    }
    
    $src = curl_exec($curl);
    curl_close($curl);
    return $src;
}

$types = getParam('types');  //api类型
switch($types)
{
    case "musicInfo":   //获取歌曲信息
        $id = getParam('id');  //歌曲ID
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
        $id = getParam('id');  //歌曲ID
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
        $fileurl = getParam('url');  //链接
        $musicname = getParam('name');  //歌曲名字
        
        if(!$fileurl){
            $tempArr = array("code"=>-1,"msg"=>"歌曲链接为空");
            echojson(json_encode($tempArr));
        }else{
            $ua = $_SERVER["HTTP_USER_AGENT"]; 
            $filename = $musicname . ".mp3";
            $encoded_filename = urlencode($filename); 
            $encoded_filename = str_replace("+", "%20", $encoded_filename); 
            header("Content-Type: application/force-download");
            if (preg_match("/MSIE/", $ua) || preg_match("/rv\:11\.0/", $ua)) {  // IE浏览器
                header('Content-Disposition: attachment; filename="' . $encoded_filename . '"'); 
            } else if (preg_match("/Firefox/", $ua)) {  //火狐浏览器
                header('Content-Disposition: attachment; filename*="utf8\'\'' . $filename . '"'); 
            } else if (preg_match("/Edge/", $ua)) {  //edge浏览器
                header('Content-Disposition: attachment; filename="' . $encoded_filename . '"'); 
            } else { 
                header('Content-Disposition: attachment; filename="' . $filename . '"'); 
            } 
            $mp3file = file_get_contents($fileurl); 
            echo $mp3file;
        }
        break;
    
    case "userlist":    // 获取用户歌单列表
        $uid = getParam('uid');  //用户ID
        if(!$uid){
            $tempArr = array("code"=>-1,"msg"=>"用户ID为空");
            echojson(json_encode($tempArr));
        }
        $url= "http://music.163.com/api/user/playlist/?offset=0&limit=1001&uid=".$uid;    //请求url
        $post_data = '';
        echojson(curl($url,$post_data));
        break;
        
    case "playlist":    // 获取歌单中的歌曲
        $id = getParam('id');  //歌单ID
        if(!$id){
            $tempArr = array("code"=>-1,"msg"=>"歌单ID为空");
            echojson(json_encode($tempArr));
        }
        $url= "http://music.163.com/api/playlist/detail?id={$id}&updateTime=-1";    //请求url
        $post_data = '';
        echojson(curl($url,$post_data));
        break;
     
    case "search":  //搜索歌曲
    default:
        $s = getParam('name');  //歌名
        $limit = getParam('count');  //每页显示数量
        $pages = getParam('pages');  //页码
        if($pages>1000 || $pages<1)$pages=1;    //纠正错误的值
        if($limit == "") $limit = 20;
        $offset= ($pages-1) * $limit;     //偏移量
        
        if(!$s){
            $tempArr = array("code"=>-1,"msg"=>"歌名为空");
            echojson(json_encode($tempArr));
        }else{
            $url= "http://music.163.com/api/search/get/web?csrf_token=";    //请求url
            $post_data = 'hlpretag=<span class="s-fc7">&hlposttag=</span>&s='. $s . '&type=1&offset='. $offset . '&total=true&limit=' . $limit;
            echojson(curl($url,$post_data));
        }   
}

/**
 * 获取GET或POST过来的参数
 * @param $key 键值
 * @param $default 默认值
 * @return 获取到的内容（没有则为默认值）
 */
function getParam($key,$default='')
{
    return trim($key && is_string($key) ? (isset($_POST[$key]) ? $_POST[$key] : (isset($_GET[$key]) ? $_GET[$key] : $default)) : $default);
}

/**
 * 输出一个json或jsonp格式的内容
 * @param $data 数组内容
 */
function echojson($data)    //json和jsonp通用
{
    header("Content-type: application/json");
    $callback = getParam('callback');
    if($callback != "") //输出jsonp格式
    {
        echo $callback."(".$data.")";
    }
    else
    {
        echo $data;
    }
}