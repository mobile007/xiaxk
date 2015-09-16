
var imgHeight = 180,
	bodyH = 0,
	bodyW = 0,
	dataUrl = 'http://124.232.137.177:85/api';
	
$(function(){	
	var body = window;
	bodyH = $(body).height();
	bodyW = $(body).width();
	imgHeight = bodyH*0.28;
	
});



//----------------------------------------------------------
//栏目项 模板
var Template = {
	village: '<div class="one-village"><a href="/index.php/mobile/Share/Villagedetail?id={link}">'+
		'<div class="village-top"><img src="{img}" width="100%" alt="图片加载失败" />'+
		'<div class="info">'+
		'<h2>{title}</h2>'+
		'<ul>{tagslist}</ul></div></div>'+
		'<article class="content">{desc}</article>'+
		'<section class="address">'+
		'<address>距离:{juli}km</address>'+
		'<p class="msg">已有<i>{commentaryCount}</i>人评论</p>'+
		'</section></a></div>',
	town:
		'<div class="town-box">'
		+'<a href="/index.php/mobile/Share/Playdetail?id={link}">'		
		+'<img width="100%" src="{img}" />'
		+'<div class="info">'
		+'<h3>{title}</h3>'
		+'<address>距离: {juli}km</address>'
		+'<article>已有{commentaryCount}人评论</article>'
		+'</div><ul>{tagslist}</ul></a></div>'
};
//当前正在使用模板
var curTemp = Template.village;
var tempid = 1;
//初始化坐标信息
var map = null,
	myPos = null;

//tempid: 模板编号： 1-村子， 2-农庄， 默认1
//isForce: 是否强制更新
function initPos( callback, tid,  isForce ){	
	
	//判断村子和农庄使用不同模板
//	
	tempid = tid;
	curTemp = tempid == 2 ? Template.town: Template.village;	
	
	map = new BMap.Map( "tempmap" );
	//检测是否存在
	var pos = localStorage.getItem("mypos");
	if( !isForce && pos!=null && pos.toString().length>0 ){		
		pos = pos.split(",");
		myPos = new BMap.Point( pos[0], pos[1] );
		
		hideLoad();
		callback && callback();
		return false;
	}
	
	//获取
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			myPos = new BMap.Point( r.point.lng, r.point.lat );
			
			hideLoad();
			callback && callback();
			localStorage.setItem("mypos", r.point.lng+","+r.point.lat ); //保存到缓存			
		}
		else {
			alert('failed'+this.getStatus());
		}        
	},{enableHighAccuracy: true});
}


//获取坐标数据
function countKm( lon, lati ){	
	//计算当前坐标	
	var pointB = new BMap.Point(lon,lati);
	var juli = (map.getDistance(myPos,pointB)/1000).toFixed(2);
	return juli;	
}





//加载动画
//------------------------------
var loadArr = [];
loadArr.push( '<div id="loading-remind" class="loading-remind">' );
loadArr.push( '<div class="loading">' );
loadArr.push( '<div class="loader-inner ball-spin-fade-loader">' );
loadArr.push( '<div></div><div></div><div></div><div></div>' );
loadArr.push( '<div></div><div></div><div></div><div></div>' );
loadArr.push( '</div></div><p></p></div>' );

// 加载中
function loading(){
	var $load = $(loadArr.join(""));
	$("body").append( $load );
	$load.fadeIn(300);
}

//隐藏加载
function hideLoad(){
	$(".loading-remind").fadeOut(300,function(){
		$(this).remove();
	});
}

//参数查询
function getQuery(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if( !r ){ return null;}
    
    return unescape(r[2]); 
}








