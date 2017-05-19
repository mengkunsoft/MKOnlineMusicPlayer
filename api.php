<?php
/**************************************************
 * MKOnlinePlayer v2.21
 * 后台音乐数据抓取模块
 * 编写：mengkun(http://mkblog.cn)
 * 时间：2017-5-19
 *************************************************/

require_once('plugns/Meting.php');

use Metowolf\Meting;


$API = new Meting('netease');

$API->format(false);

// api设置
$GLOBALS['config'] = array(
    'proxy' => array(    // 是否使用代理（true/false）  供海外空间“翻墙”用
            'musicInfo'=> false,        // 歌曲信息获取（海外空间如果歌曲无法播放请将这一项设为 true）
            'lyric'=> false,            // 歌词获取（海外空间如果歌词无法获取请将这一项设为 true）
            'userlist'=> false,         // 用户歌单获取（海外空间用户歌单无法加载时请将此项设为 true）
            'playlist'=> false,         // 系统歌单获取（海外空间系统歌单无法加载时请将此项设为 true）
            'search'=> false,            // 搜索（海外空间搜索功能无法使用时请将此项设为 true）
            'download'=> false          // 下载(海外空间歌曲无法下载时请将此项设为 true)
        ),
    'proxyIP' => '222.186.34.84',    // 代理 IP     （这里的代理是随手搜的，可能有点慢，请自己寻找更快的代理）
    'proxyPort' => 8998,    // 代理端口
    'proxyUserpwd' => ''    // 代理账号及密码(不需要则留空) 格式为 '用户名:密码'
);

// 参考资料
// https://github.com/darknessomi/musicbox/wiki/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90API%E5%88%86%E6%9E%90

/**
 * Curl网易云获取数据函数
 * @param $url api url
 * @param $proxy 是否开启 代_理 访问
 * @param $post_data post传送的数据
 * @return 获取结果
 */
function curl($url, $proxy = false, $post_data = ''){ //从网易云音乐读取数据
    $curl = curl_init();
    $header =array(
        'Host: music.163.com',
        'Origin: http://music.163.com',
        'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
        'Content-Type: application/x-www-form-urlencoded',
        'Referer: http://music.163.com/search/',
        'Cookie: os=linux; appver=1.0.0.1026; osver=Ubuntu%2016.10; MUSIC_U=78d411095f4b022667bc8ec49e9a44cca088df057d987f5feaf066d37458e41c4a7d9447977352cf27ea9fee03f6ec4441049cea1c6bb9b6; __remember_me=true',
        'X-FORWARDED-FOR:220.168.209.130',
        'CLIENT-IP:220.168.209.130'
    );
    curl_setopt($curl, CURLOPT_URL,$url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER,1);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
    
    if($proxy == true) {    // 开启了代理
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
        }
        
        $data = $API->url($id);
        $data = $API->netease_url($data);
        
        echojson($data);
        
        break;
    
    case "lyric":       //获取歌词
        $id = getParam('id');  //歌曲ID
        if(!$id){
            $tempArr = array("code"=>-1,"msg"=>"歌曲ID为空");
            echojson(json_encode($tempArr));
        }
        
        $url = "http://music.163.com/api/song/lyric?os=pc&id=" . $id . "&lv=-1&kv=-1&tv=-1";    //请求url
        echojson(curl($url, $GLOBALS['config']['proxy']['lyric']));
        break;
        
    case "download":    //下载歌曲
        $fileurl = getParam('url');  //链接
        if(!$fileurl){
            $tempArr = array("code"=>-1, "msg"=>"歌曲链接为空");
            echojson(json_encode($tempArr));
        }
        
        $musicname = getParam('name', 'noname');  //歌曲名字
        
        header("location:$fileurl");
        exit();
        break;
    
    case "userlist":    // 获取用户歌单列表
        $uid = getParam('uid');  //用户ID
        if(!$uid){
            $tempArr = array("code"=>-1,"msg"=>"用户ID为空");
            echojson(json_encode($tempArr));
        }
        
        $url= "http://music.163.com/api/user/playlist/?offset=0&limit=1001&uid=".$uid;    //请求url
        echojson(curl($url, $GLOBALS['config']['proxy']['userlist']));
        break;
        
    case "playlist":    // 获取歌单中的歌曲
        $id = getParam('id');  //歌单ID
        if(!$id){
            $tempArr = array("code"=>-1,"msg"=>"歌单ID为空");
            echojson(json_encode($tempArr));
        }
        
        // $API->format(true);
        $data = $API->playlist($id);
        
        $data = json_decode($data, true);
        
        if(isset($data['playlist']['coverImgId_str'])) {
            $data['playlist']['coverImgUrl'] = $API->pic($data['playlist']['coverImgId_str'], 150, false);
        } else {
            $data['playlist']['coverImgUrl'] = '';
        }
        
        $data = json_encode($data);
        echojson($data);
        break;
     
    case "search":  //搜索歌曲
    default:
        $s = getParam('name');  //歌名
        if(!$s){
            $tempArr = array("code"=>-1,"msg"=>"歌名为空");
            echojson(json_encode($tempArr));
        }
        
        $limit = getParam('count', 20);  //每页显示数量
        $pages = getParam('pages');  //页码
        if($pages<1) $pages=1;    //纠正错误的值
        $offset= ($pages-1) * $limit;     //偏移量
        
        $data = $API->search($s, $pages, $limit);
        
        echojson($data);
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
        die($callback."(".$data.")");
    } else {
        die($data);
    }
}