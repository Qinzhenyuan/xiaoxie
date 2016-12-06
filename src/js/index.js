//首页的js语句
jQuery(function($){
	
	//当浏览器窗口大小改变时设置吸顶菜单的位置
	$(window).resize(function(){
		//浏览器窗口分辨率大于菜单则居中，否则靠左对齐
		var _left = ($(window).width() - $(".ceilig-nav").width())/2;
		if(_left > 0){
			$(".ceilig-nav").css("left",_left);
		}else{
			$(".ceilig-nav").css("left",0)
		}
	}).trigger("resize");
	
	//滚动条滚动到指定位置，吸顶菜单显示
	$(window).scroll(function(){
		if($(window).scrollTop() >= 660){
			$(".ceilig-nav").fadeIn();
		}else{
			$(".ceilig-nav").fadeOut();
		}
	});

	//请求轮播图的json文件，动态加载图片
	$.ajax({
		type:"GET",
		url:"json/carouselImg.json",
		success:function(res){
            //遍历请求回来的数据加载图片与连接
            $.each(res,function(_index,ele){
                var $a = $(".carousel li a");
            	$a.eq(_index).prop("href",ele.hrefUrl);
            	var $img = $(".carousel li a img");
            	$img.eq(_index).prop("src",ele.imgUrl);
            });
		}
	});
	
	//使用插件开始轮播图片(最后一张图片加载完之后再开始轮播)
	$(".carousel img:last").load(function(){
		//轮播图插件
		$(".carousel").myCarouselImg({
			_width:1900,         //宽度
			_height:443,        //高度
			playType:"fade",    //图片切换方式
			isShowPage:true,    //是否显示小页码
			isShowBtn:false,     //是否显示左右切换按钮
			autoPlay:true,      //是否自动播放
			playSpeed:3000,     //自动播放速度
			isStopPlay:false,   //鼠标经过是否停止播放
			clickOrover:"over"  //小页码是点击切换还是鼠标经过切换
		});
		//当浏览器窗口大小改变时设置轮播区域的位置
		$(window).resize(function(){
			var _left = ($(window).width() - $(".carousel").width())/2;
			$(".carousel").css("left",_left);
		}).trigger("resize");
	});
	
	//实现限时抢购倒计时
	function countdown(){

		var hours = 0,minutes = 0,seconds = 0;
		//设置失效时间
		var d = new Date();
		d.setHours(d.getHours()+14);
        //开启定时器，每个一秒获取一次当前时间
        setInterval(function(){
        	//获取当前时间
        	var d1 = new Date();
        	//与失效时间的毫秒数之差
        	var num = d.getTime() - d1.getTime();
        	//时
        	hours = parseInt(num/(3600*1000));
        	$(".countdown span").eq(0).html(parseInt(hours/10));
        	$(".countdown span").eq(1).html(parseInt(hours%10));
			//分
        	minutes = parseInt(num/(60*1000)%60);
        	$(".countdown span").eq(2).html(parseInt(minutes/10));
        	$(".countdown span").eq(3).html(parseInt(minutes%10));
        	//秒
        	seconds = Math.ceil((num/ 1000)%60);
        	$(".countdown span").eq(4).html(parseInt(seconds/10));
        	$(".countdown span").eq(5).html(parseInt(seconds%10));
        },1000);
	}
	//调用倒计时函数
    countdown();
    
	//滚动楼梯与右边小图标的效果
	function stairAndIcons(){
		//获取相应元素
		var $stairList = $("#stairList");
		var $li = $stairList.find("li");
		var $div = $(".commodity-content>div");
		
		$(window).scroll(function(){
			//获取滚动条到顶部的距离
			var _srcollTop = $(window).scrollTop();
			//遍历页面的平行区域，到达哪个区域显示到达几楼
			$div.each(function(_index,ele){
				
				var _top = $(ele).offset().top;
				var _height = $(ele).height();
				var _theme = $(ele).attr("theme");
	            //一楼
				if(_index == 0){
					if(_srcollTop >= _top-200){//滚动条到指定位置显示和隐藏购物车等小图标
						$stairList.fadeIn();
						$(".small-icons").fadeIn();
					}else{
						$stairList.fadeOut();
						$(".small-icons").fadeOut();
					}
				}
				//每一楼的区间（自身top值-200到自身高度）
				if(_srcollTop >= _top-200 && _srcollTop <= _top + _height){
					$li.find("span").css("display","block");
					$li.find("a").css("display","none");
					$li.eq(_index).find("span").css("display","none");
					$li.eq(_index).find("a").css("display","block").html(_theme);
				}
			});
		});
		//点击几楼和回到顶部，滚动条缓慢滚动到指定区域
		$li.click(function(){
			var _index = $(this).index();
			$("html,body").animate({scrollTop:$div.eq(_index).offset().top-200});
		});
		$(".backTop-icons").click(function(){
			$("html,body").animate({scrollTop:0});
		});
	}
	//调用
	stairAndIcons();
	

    //访问服务器的json文件加载商品信息
    $.ajax({
    	type : "GET",
    	url : "json/index-commodity.json",
    	success : function(res){
    		//第一次遍历返回的数据，获得主题
    		$.each(res,function(_index1,ele1){
    			//判断是哪个主题，把该主题的商品信息加载到相应的区域
    			if(ele1.commodityTheme == "限时抢购"){
    				var $li_1 = $(".flash-sale-list>li");
    				//第二次遍历商品列，生成商品信息元素
    				$.each(ele1.commodityList,function(_index2,ele2){
    					//生成包容商品信息的容器元素,相应的样式已经设置完成
    					var $a = $("<a target='_blank'></a>")
    					var $img = $("<img />")
    					var $span = $("<span></span>");
    					var $p1 = $("<p class='text-info'></p>");
    					var $p2 = $("<p class='price'></p>");
    					//设置必要的属性并追加到相应的位置
    					$img.prop("src",ele2.sampleUrl).appendTo($a);
    					$span.html(ele2.bondedState).css("background","rgba(225,225,225,0.6) url("+ ele2.bondedStateImg +") no-repeat left center").appendTo($a);
    					$a.prop("href",ele2.link).appendTo($li_1.eq(_index2));
    					
    					$p1.append("<b>"+ ele2.name +"</b><span>"+ ele2.information +"</span>").appendTo($li_1.eq(_index2));
    					$p2.append("￥"+ele2.discountPrice+"<span>"+ ele2.price +"</span>").appendTo($li_1.eq(_index2));

    				});
    				//限时抢购主题鼠标经过时的文字说明动画效果
    				$li_1.mouseenter(function(){
    					$(this).find(".text-info").find("b").stop().animate({top:-38,height:0});
    					$(this).find(".text-info").find("span").stop().animate({top:-38,height:75});
    				}).mouseleave(function(){
    					$(this).find(".text-info").find("b").stop().animate({top:0,height:30});
    					$(this).find(".text-info").find("span").stop().animate({top:39,height:0});
    				});
    			}else if(ele1.commodityTheme == "尖货推荐"){
    				var $li_2 = $(".tip-goods-recommend-list>li");
    				$.each(ele1.commodityList,function(_index2,ele2){
    					if(ele2.id == "G0006"){//跳转到自己写的商品详情页，实际开发中不建议
    						$li_2.eq(_index2).find("a").prop("href","html/details-of-goods.html");
    					}else{
    						$li_2.eq(_index2).find("a").prop("href",ele2.link);
    					}
    					$li_2.eq(_index2).find("img:first").prop("src",ele2.sampleUrl);
    					$li_2.eq(_index2).find(".text-info b").html(ele2.name);
    					$li_2.eq(_index2).find(".text-info span").html(ele2.information);
    					$li_2.eq(_index2).find(".price").append("￥"+ele2.discountPrice+"<span>￥"+ ele2.price +"</span>").attr("price",ele2.discountPrice);
    				});
    			}else if(ele1.commodityTheme == "上新品"){
    			    var $li_3 = $(".new-goods-list>li");
    			    $.each(ele1.commodityList, function(_index2,ele2){
    			    	$li_3.eq(_index2).find(".goods-img").children("a").prop("href",ele2.link);
    			    	$li_3.eq(_index2).find(".goods-img").children("a").find("img").prop("src",ele2.sampleUrl);
    			    	$li_3.eq(_index2).find(".goods-info").children("span").html(ele2.bondedState).css("background","url("+ ele2.bondedStateImg +") no-repeat left center");
    			        $li_3.eq(_index2).find(".goods-info").children("a").html(ele2.name).prop("href",ele2.link);
    			        $li_3.eq(_index2).find(".goods-info").children("p").html(ele2.information);
    			        $li_3.eq(_index2).find(".goods-info").children("b").html("￥"+ele2.discountPrice).attr("price",ele2.discountPrice);
    			        $li_3.eq(_index2).find(".goods-info").children("button").attr("goodsId",ele2.id);//保存商品id
    			    });
    			}else if(ele1.commodityTheme == "跨境精选"){
    				var $li_4 = $(".cross-border-select-list li");
    			    $.each(ele1.commodityList, function(_index2,ele2){
    			    	$li_4.eq(_index2).find(".goods-img").children("a").prop("href",ele2.link);
    			    	$li_4.eq(_index2).find(".goods-img").children("a").find("img").prop("src",ele2.sampleUrl);
    			    	$li_4.eq(_index2).find(".goods-info").children("span").html(ele2.bondedState).css("background","url("+ ele2.bondedStateImg +") no-repeat left center");
    			        $li_4.eq(_index2).find(".goods-info").children("a").html(ele2.name).prop("href",ele2.link);
    			        $li_4.eq(_index2).find(".goods-info").children("p").html(ele2.information);
    			        $li_4.eq(_index2).find(".goods-info").children("b").html("￥"+ele2.discountPrice).attr("price",ele2.discountPrice);
    			        $li_4.eq(_index2).find(".goods-info").children("button").attr("goodsId",ele2.id);//保存商品id
    			    });
    			}else if(ele1.commodityTheme == "Enjoy City"){
    				var $li_5 = $(".enjoy-city-list li");
    			    $.each(ele1.commodityList, function(_index2,ele2){
    			    	$li_5.eq(_index2).find(".goods-img").children("a").prop("href",ele2.link);
    			    	$li_5.eq(_index2).find(".goods-img").children("a").find("img").prop("src",ele2.sampleUrl);
    			    	$li_5.eq(_index2).find(".goods-info").children("span").html(ele2.bondedState).css("background","url("+ ele2.bondedStateImg +") no-repeat left center");
    			        $li_5.eq(_index2).find(".goods-info").children("a").html(ele2.name).prop("href",ele2.link);
    			        $li_5.eq(_index2).find(".goods-info").children("p").html(ele2.information);
    			        $li_5.eq(_index2).find(".goods-info").children("b").html("￥"+ele2.discountPrice).attr("price",ele2.discountPrice);
    			        $li_5.eq(_index2).find(".goods-info").children("button").attr("goodsId",ele2.id);//保存商品id
    			    });
    			}else if(ele1.commodityTheme == "产地直采"){
    				var $li_6 = $(".direct-mining-area-list li");
    			    $.each(ele1.commodityList, function(_index2,ele2){
    			    	$li_6.eq(_index2).find(".goods-img").children("a").prop("href",ele2.link);
    			    	$li_6.eq(_index2).find(".goods-img").children("a").find("img").prop("src",ele2.sampleUrl);
    			    	$li_6.eq(_index2).find(".goods-info").children("span").html(ele2.bondedState).css("background","url("+ ele2.bondedStateImg +") no-repeat left center");
    			        $li_6.eq(_index2).find(".goods-info").children("a").html(ele2.name).prop("href",ele2.link);
    			        $li_6.eq(_index2).find(".goods-info").children("p").html(ele2.information);
    			        $li_6.eq(_index2).find(".goods-info").children("b").html("￥"+ele2.discountPrice).attr("price",ele2.discountPrice);
    			        $li_6.eq(_index2).find(".goods-info").children("button").attr("goodsId",ele2.id);//保存商品id
    			    });
    			}
    		});
    	}
    });
    
    //点击加入购物车按钮生成cookie并显示加入购物车的动画效果
    $(".commodity-content button").click(function(){
    	
    	//保存该jq元素
    	var $self = $(this);
    	//去掉外边框
    	$self.css("outline",0);
    	//获取被点击按钮所属的商品信息区的商品图
		var $img = $(this).parent().parent().find("img").eq(0);		
		
		//生成图片元素并克隆当前被点击的按钮所在的商品图片的属性和样式
		var pyl = $img.offset();
		var _width = $img.width();
		var _src = $img.attr("src");
		var $cloneImg = $("<img />");
		//给克隆的图片设置样式和样式并插入到body中
		$cloneImg.attr("src",_src);
		$cloneImg.css({
			position:"absolute",
			left : pyl.left,
			top : pyl.top,
			width : _width
		}).appendTo("body");
		
		//开始运动
		$cloneImg.animate({
			left:$(".car-icons").offset().left,
			top:$(".car-icons").offset().top,
			height : 10,
			width : 10
		},1000,function(){
			$cloneImg.remove();//运动完之后移除掉
			
			//改变数组与更新cookie等操作放在运动完成之后的回调函数中
			//将该商品添加到cookie中
            //先获取需要存到cookie的属性
			var _id = $self.attr("goodsid"),
			    _imgUrl = "../"+$img.attr("src"),
			    _name = $self.parent().children("a").html(),
			    _price = $self.parent().find("b").attr("price"),
			    _num = 1;
			
			//判断数组是否为空
			if(goodsArr.length == 0){
				//往数组里面追加数据
				goodsArr.push({
					goodsId:_id,
					goodsImg:_imgUrl,
					goodsName:_name,
					goodsPrice:_price,
					goodsNum:_num
				});
				//全局数组改变，cookie也实时改变
				updata();
			}else{//不为空的情况
				//声明一个变量来监控数组中是否存在该商品的id，存在则为真
				var isHasId = false;
				for(var i=0; i<goodsArr.length; i++){
					if(goodsArr[i].goodsId == _id){
						goodsArr[i].goodsNum += _num;
						isHasId = true;
						updata();
					}
				}
				
				//如果不存在则把该商品的信息追加到全局数组中
				if(!isHasId){
					//往数组里面追加数据
					goodsArr.push({
						goodsId:_id,
						goodsImg:_imgUrl,
						goodsName:_name,
						goodsPrice:_price,
						goodsNum:_num
					});
					updata();
				}
			}
			
			//封装一个实时更新cookie与购物车商品数量的函数
			function updata(){
				
				var n = 0;//用于统计存放到数组的商品数量
				
				//遍历数组获取数组中的商品数量
				for(var j=0;j<goodsArr.length; j++){
					n += goodsArr[j].goodsNum;
				}
				console.log(goodsArr);
				//实时更新购物车显示的商品数量
				cartNum1.html(n);
				cartNum2.html(n);
				//使用当前数组覆盖指定cookie
				var d = new Date();
				d.setDate(d.getDate()+10);
				setCookie("ewjGoods",JSON.stringify(goodsArr),d,"/");
			}
		});
		
    });  
});

