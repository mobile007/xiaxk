

(function(){
	
	//参数对象
	var ParamObj = {
		api_name: "Active",
		city: "",
		pageNum:1,
		type: 0,
		location: "",
		sortType: 0
	}
	
	
	loading();	
	var $rgba = $("#active-box-rgba");
	
	$(function(){
		initPos( getActivity );
		
		
		//监听滚动条是否到底部
		$(window).on( "scroll", function(e){
			//document.title = ($(this).scrollTop()+bodyH)+","+document.body.scrollHeight;		
			if( $(this).scrollTop()+bodyH === document.body.scrollHeight ){			
				ParamObj.pageNum++;
				getActivity();
			}		
		});
		
		
		//显示面板
		$("#title").find("span").on("touchend",function(e){
			e.preventDefault();
			var tar = $(this).attr("data-target");
			$(tar).addClass("active");
			
			//显示蒙版
			$rgba.fadeIn(200);
		});
		//点击蒙版
		$rgba.on("touchend",function(e){
			e.preventDefault();
			$(".active-box").removeClass("active");
			$rgba.fadeOut(300);
		});
		
		//选中
		$(".active-ul>li").on("touchend",function(e){
			e.preventDefault();			
			var name = $(this).attr( "data-name" );
			var value = $(this).attr( "data-value" );
			
			//配置参数
			if( name=="sortType" && value=="0" ){
				//初始化位置
				ParamObj.location = myPos.lat+","+myPos.lng;
			}else{
				ParamObj.location = "";
				ParamObj[name] = value;
			}			
			
			//改变标题
			var tid = $(this).parent().attr("data-target");
			$(tid).text( $(this).text() );
			//更改样式
			$(this).siblings().removeClass("cur");
			$(this).addClass("cur");			
			//隐藏
			$(".active-box").removeClass("active");
			$rgba.fadeOut(300);
			
			//请求数据	
			ParamObj.pageNum = 1;
			getActivity( 1 );
		});
		
	});
	
	
	//获取数据
	function getActivity( isClear ){
		
		loading();		
//		console.log( JSON.stringify( ParamObj ) );		
		var arr = [];
		$.ajax({
			url: dataUrl+"/Active",
			type: "get",
			data: ParamObj,
			dataType: "json",
			success: function(data){		
				data = data.actives;				
				for( var i=data.length-1; i>=0; i-- ){					
					var obj = data[i];	
					arr.push('<div class="town-box">');
					arr.push('<a href="/index.php/mobile/Share/Activedetail?id='+obj.vid+'">');	
					
					var img = obj.image || "img/default.png"; //无图处理	
					arr.push('<img width="100%" src="'+img+'" />');
					arr.push('<div class="info">');	
					arr.push('<h3>'+obj.name+'</h3>');	
					arr.push('<address>'+obj.address+'</address>');	
					
					var pos = obj.location.split(",");
					var juli = countKm( pos[1], pos[0] );	
					arr.push('<article>距离：'+juli+'km 即将开始</article>');	
					arr.push('</div><span class="recommend">推荐</span></a></div>');						
				}
				//无数据
				if( isClear && arr.length == 0 ){
					arr.push( '<div class="no-data">没有符合条件的数据</div>' );		
					ParamObj.pageNum = 1;
				}
				
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
	
	
})();




