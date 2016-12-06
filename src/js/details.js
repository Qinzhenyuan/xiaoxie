jQuery(function($){
    
    //给放大镜区域加载第一张图片
    $(".fdj img").prop("src",$(".xiaotu img:first").prop("src"));
    
	//放大图效果
	$(".fdj").myZoomImg({
		_width:420,        //宽度
		_height:420,       //高度
		gap:30,            //大图与小图的间距
		_position:"right", //大图位置
		bgColor:"black"      //放大镜模拟框的背景颜色
    });
    
    //鼠标经过小图标在放大镜区域该图片
	$(".xiaotu li").mouseenter(function(){
		$(".fdj img").prop("src",$(this).find("img").prop("src"));
	});
	
	//点击左右按钮移动小图片列表
	var num = 0;
	$(".img-zoom .btnLeft").click(function(){
		if(num >= 1){
			num--;
    		$(".xiaotu ul").animate({left:-95*num});
		}
	});
	$(".img-zoom .btnRight").click(function(){
		num++;
    	$(".xiaotu ul").animate({left:-95*num});
    	if(num >= 3){
    		num = 0;
    	}
	});
	
	//促销倒计时
	function countdown(){
		var days = 0,hours = 0,minutes = 0,seconds = 0;
		//失效时间
		var d = new Date();
		d.setHours(d.getHours()+4);
        
        setInterval(function(){
        	//获取当前时间
        	var d1 = new Date();
        	//与失效时间的毫秒数之差
        	var num = d.getTime() - d1.getTime();
        	//天数
        	days = parseInt(num/86400000);
        	$(".countdown i").first().html(days);
        	//小时数
        	hours = parseInt(num/(3600*1000));
        	$(".countdown i").eq(1).html(hours);
			//分钟数
        	minutes = parseInt(num/(60*1000)%60);
        	$(".countdown i").eq(2).html(minutes);
        	//秒数
        	seconds = Math.ceil((num/ 1000)%60);
        	$(".countdown i").eq(3).html(seconds);
        },1000);
	}
    countdown();
    
    //点击添加减少数量，不超过库存
    $(".reduce").click(function(){
    	var buyNum = $(".stock input").val();
    	if(buyNum > 1){
    		buyNum -- ;
    	}
    	$(".stock input").val(buyNum);
    });
    $(".increase").mousedown(function(){
    	var buyNum = $(".stock input").val();
    	var stockNum = $(".stock span").attr("data");
    	if(buyNum < stockNum){
    		buyNum ++ ;
    	}
    	$(".stock input").val(buyNum);
    });
    //判断是否输入超过库存或者为负数
    $(".stock input").change(function(){
    	var buyNum = $(this).val();
    	var stockNum = $(".stock span").attr("data");
    	if(buyNum > stockNum){
    		buyNum = stockNum;
    	}
    	if(buyNum < 0 ){
    		buyNum = 1;
    	}
    	if(isNaN(buyNum)){
    		buyNum = 1
    	}
    	$(this).val(buyNum);
    });
    
    
    //点击加入购物车按钮生成cookie并显示加入购物车的动画效果
    $(".btn button").click(function(){
    	var $self = $(this);
		var $img = $(".fdj img");		
		
		//生成图片元素并克隆当前被点击的按钮所在的商品图片的属性
		var pyl = $img.offset();
		var _width = $img.width();
		var _src = $img.attr("src");
		var $cloneImg = $("<img />");
		//给克隆的图片设置样式
		$cloneImg.attr("src",_src);
		$cloneImg.css({
			position:"absolute",
			left : pyl.left,
			top : pyl.top,
			width : _width
		}).appendTo("body");
		
		//开始运动
		$cloneImg.animate({
			left:$(".header-center-car a").offset().left,
			top:$(".header-center-car a").offset().top,
			height : 10,
			width : 10
		},1000,function(){//运动完之后移除掉
			$cloneImg.remove();
			//将该商品添加到cookie中
            //先获取需要存到cookie的属性
			var _id = $self.attr("goodsid"),
			    _imgUrl = $img.attr("src"),
			    _name = $(".details-info-right h3").html(),
			    _price = $(".goods-price").find("b").attr("price"),
			    _num = parseInt($(".stock input").val());
			
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
				
				var n = 0;
				
				//遍历数组获取数组中的商品数量
				for(var j=0;j<goodsArr.length; j++){
					n += goodsArr[j].goodsNum;
				}
				//实时更新购物车的商品数量
				cartNum1.html(n);
				cartNum2.html(n);
				//使用当前数组覆盖指定cookie
				var d = new Date();
				d.setDate(d.getDate()+10);
				setCookie("ewjGoods",JSON.stringify(goodsArr),d,"/");
			}
		});
		
    });
    
    //给图片详情区的导航条绑定点击事件
    $(".img-info ul li").on("click",function(){
    	var _index = $(this).index();
    	$(".img-info ul li").css({color:"black",background:"white"});
    	$(".img-info ul li").eq(_index).css({color:"white",background:"#e14041"});
    });
});
