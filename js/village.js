
var curPage = 1,//当前页码
	curBoxIndex = 0, //当前第几个盒子
	isTouchMove = false, //移动时触发touchend事件
	villOrTown = 1; //村子或者农庄 1:村子， 2:农庄

//获取村子传递参数
var Param = {
	api_name: "Village",
	dataname: "hotVillage",
	pageNum: 1,
	tag: '',
	location: ''
};


loading();
$(function(){
	//
	//监听滚动条是否到底部
	$(window).on( "scroll", function(e){
		//document.title = ($(this).scrollTop()+bodyH)+","+document.body.scrollHeight;		
		if( curBoxIndex==0 && ($(this).scrollTop()+bodyH === document.body.scrollHeight)){	
			getVillage();
		}		
	});
	
	//返回
	$("#back-a").on("touchend", function(e){
		e.preventDefault();
		if( curBoxIndex == 1){
			curBoxIndex = 0;
			$(".header").removeClass("blank");
			moveActive();
		}
	});
	
	//分类切换
	$("#class-span-btn").on("touchend", function(e){
		e.preventDefault();
		curBoxIndex = 1;
		Param.location = "";
		$(".header").addClass("blank");
		
		moveActive();		
	});
	//按距离
	$("#km-span-btn").on("touchend", function(e){
		e.preventDefault();
		Param.location = myPos.lat+","+myPos.lng;
		getVillage( 1 );
	});
	//按热度
	$("#hot-span-btn").on("touchend", function(e){
		e.preventDefault();
		Param.location = "";
//		ParamObj.tagId = "";
		getVillage( 1 );
	});
		
	
	$("#tag-box").on("touchmove", function(e){	
		isTouchMove = true;
	});
	//选中标签
	$("#tag-box").on("touchend","li", function(e){	
		e.preventDefault();
		if( isTouchMove ){
			isTouchMove = false; return false;
		}		
		
		curBoxIndex = 0;
		$(".header").removeClass("blank");
		
		//更新数据
		Param.pageNum = 1;
		Param.tag = $(this).attr("tagId");
		getVillage( 1 );
		$("#class-span-btn").text($(this).text());
		moveActive();
	});
	
	//获取标签
	getTag();
});

//移动动画
function moveActive(){		
//	$("#village-page").animate({"left": -curBoxIndex*100 + "%"}, 200);
	if( curBoxIndex==0 ){
		$("#tag-page").fadeOut( 100,function(){
			$("#village-page").fadeIn(200);
		});		
	}else{
		$("#village-page").fadeOut( 100,function(){
			$("#tag-page").fadeIn(200);
		});		
	}
}

//获取页面标签
function getTag(){
	
	var tagsarr = [];
	$.ajax({
		url: dataUrl+"/Tags",
		type: "get",
		dataType: "json",
		success: function(data){
			var tags = data.tags;
			for( var obj in tags ){
				tagsarr.push('<div class="tag">');
				tagsarr.push('<h2>'+tags[obj].name+'</h2>');
				tagsarr.push('<ul>');
				
				var tag = tags[obj].tags;
				for( var i=tag.length-1; i>=0; i-- ){
					tagsarr.push( '<li tagId="'+tag[i].tagId+'">'+tag[i].tagName+'</li>' );
				}	
				tagsarr.push('</ul></div>');
			}						
			$("#tag-box").append( tagsarr.join("") );
		}
	});	
}

//获取数据
function getVillage( isClear ){
	
	loading();
	//根据类型获取不同数据
	if( tempid == 2 ){
		Param.api_name = "Play";
		Param.dataname = "hotPlay";
	}else{		
		Param.api_name = "Village";
		Param.dataname = "hotVillage";
	}
	
	$.ajax({
		url: dataUrl+"/"+Param.api_name,
		type: "get",
		data: Param,
		dataType: "json",
		success: function(data){	
			data = data[ Param.dataname ];			
			var len = data.length;			
			var arr = [];
			for( var i=0; i<len; i++){
				var obj = data[i];
				//标签列表
				var tags = obj.tags;
				var str = '';
				for(var n=0;n<tags.length;n++){
					var tag = tags[n];
					str += '<li data-tarId="'+tag.tagId+'" style="background-color:'+tag.color+'">'+tag.tagName+'</li>';
				}
				
				var pos = obj.location.split(",");
				var juli = countKm( pos[1], pos[0] );				
				var img = obj.image || "img/default.png"; //无图处理	
				
				arr.push (
					curTemp.replace("{link}",obj.vid)
						.replace("{img}", img)
						.replace("{title}",obj.name)
						.replace("{tagslist}", str )
						.replace("{desc}", obj.desc )
						.replace("{juli}", juli )
						.replace("{commentaryCount}", obj.commentaryCount )
				);
			}
			
			//无数据
			if( isClear && arr.length == 0 ){
				arr.push( '<div class="no-data">没有符合条件的数据</div>' );							
				Param.pageNum = 1;
			}
			
			if( arr.length > 0 ){ Param.pageNum++; }
			
			//添加到页面
			var $content = $(arr.join(""));
			
			//是否清空
			isClear && $("#main").empty();
			//添加
			$("#main").append( $content );
			$content.fadeIn(200);
			hideLoad();
		}
	});
}


























