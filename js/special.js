
(function(){
	
	var ParamObj = {
		api_name: "Project",
		pageNum: 1
	};

	
	//窗体加载
	$(function(){
				
		//监听滚动条是否到底部
		$(window).on( "scroll", function(e){
			//document.title = ($(this).scrollTop()+bodyH)+","+document.body.scrollHeight;		
			if( $(this).scrollTop()+bodyH === document.body.scrollHeight ){	
				_init();
			}		
		});
	});
	
	//初始化
	function _init( isClear ){
		
		loading();			
		var arr = [];		
		$.ajax({
			url: dataUrl+"/Project",
			type: "get",
			data: ParamObj,
			dataType: "json",
			success: function(data){	
				data = data.lst;	
				
				for( var i=data.length-1; i>=0; i-- ){					
					var obj = data[i];	
										
					arr.push('<div class="special-box">');
					arr.push('<a href="/index.php/mobile/Share/topicDetail?id='+obj.projectID+'">');	
					
					var img = obj.photoUrl || "img/default.png"; //无图处理	
					arr.push('<img width="100%" src="'+img+'" />');
					arr.push( '<p class="zan"><i></i><span>'+obj.praiseNum+'</span>人喜欢</p>' );					
					arr.push('<div class="info">');	
					arr.push('<h4>'+obj.projectName+'</h4>');	
					arr.push('<article>'+obj.description+'</article></div>');	
					
					arr.push('</a></div>');						
				}
				//无数据
				if( isClear && arr.length == 0 ){
					arr.push( '<div class="no-data">没有符合条件的数据</div>' );		
					ParamObj.pageNum = 1;
				}
				
				//翻页
				if( arr.length > 0 ){
					ParamObj.pageNum++;
				}
				
				//添加到页面
				var $content = $(arr.join(""));				
				//是否清空
				isClear && $("#special-page").empty();
				//添加
				$("#special-page").append( $content );
				$content.fadeIn(200);
				hideLoad();
			}
		});
	}
	
	window.initSpecialList = _init;
})();



//获取大咖
;(function(_win){
	
	var w = $(window).width();
	_win._init_person = function(){
		
		$(function(){
			
			$(window).off( "scroll");
						
			//tab切换
			$(".info-tab>h4").on("touchend",function(e){
				e.preventDefault();					
				$(this).siblings().removeClass("cur");
				$(this).addClass("cur");
				
				var index = $(this).index(); 
				//切换面板
				move( 1-index );
			});			
			
			$("#info-about").css("left", w);			
			$(".info-box").on("touchstart",function(e){
				this.x = e.originalEvent.changedTouches[0].pageX;
			});
			$(".info-box").on("touchend",function(e){
				this.x2 = e.originalEvent.changedTouches[0].pageX;
				if( this.x2-this.x >40 ){
					e.preventDefault();
					move(1); 
				}else if( this.x-this.x2 >40 ){
					e.preventDefault();
					move(0);
				}
			});
			
			getPersonInfo();
		});			
	}
	
	//移动面板
	function move( x ){
		$("#info-about").animate({"left": x*w},200);	
		$(".info-tab").find(".line").animate({
			left: (1-x)*50+"%"
		},300);
	}
	
	
	//初始化个人信息
	function getPersonInfo(){
		
		loading();
		//获取参数
		var mid = getQuery("id") || 3;		
		$.ajax({
			url: dataUrl+"/Project",			
			type: "get",
			data: "api_name=Project&masterID="+mid,
			dataType: "json",
			success: function(data){		
				$(".title").text( data.masterName );
				$(".head-img").attr( "src", data.photoUrl );
				$(".info-top>article").text( data.description );		
				$("#info-about").html( data.contents.replace(/\r\n/ig,"<br />") );
				
				//
				var arr = [];
				for( var i=data.lstProject.length-1; i>=0; i-- ){
					var obj = data.lstProject[i];											
					arr.push('<div class="special-box">');
					arr.push('<a href="/index.php/mobile/Share/topicDetail?id='+obj.projectID+'">');						
					var img = obj.photoUrl || "img/default.png"; //无图处理	
					arr.push('<img width="100%" src="'+img+'" />');
					arr.push( '<p class="zan"><i></i><span>'+obj.praiseNum+'</span>人喜欢</p>' );					
					arr.push('<div class="info">');	
					arr.push('<h4>'+obj.projectName+'</h4>');	
					arr.push('<article>'+obj.description+'</article></div>');
					arr.push('</a></div>');	
				}
				
				var $content = $(arr.join(""));		
				$("#info-page").html( $content );
				$content.fadeIn(200);
				hideLoad();
			}
		});
		
	}
	
	
})(window);











