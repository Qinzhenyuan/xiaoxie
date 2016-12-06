	
	//获取cookie动态生成用户名
	var userName = getCookie("ewjUsername");
	if(userName){//判断是否存在cookie
	    var $a = jQuery("<a></a>").attr("href","index.html").html(userName);
	    var $li = jQuery("<li></li>");
	    $li.append($a);//生成用户名的元素并插入网页头部相应位置中
	    //相应的改变其他元素
	    jQuery(".header-top-list1").prepend($li);
	    jQuery(".header-top-list1 li").eq(1).after("<li id='sign-out'><a href='index.html'>退出</a></li>")
	    jQuery("#sign-in").remove();
	    jQuery("#register").remove();
	}
	//点击退出删除cookie中的用户名等信息
    jQuery(".header-top-list1 li").eq(2).click(function(){
    	var d = new Date();
    	setCookie("ewjUsername","",d,"/");
    	setCookie("ewjPassword","",d,"/");
    	setCookie("ewjPhoneNum","",d,"/");
    })
	
	//鼠标经过手机e万家显示二维码
	jQuery(".QR-code").hover(function(){
		$(this).find("ul").toggle();
	});
	

	//点击搜索按钮跳转到相应的商品列表
	jQuery("#sub").click(function(){
		window.open("html/list-of-goods.html");
	});
	
	
	//获取cookie里面存储的商品个数，显示购物车添加了几件商品
	//先声明一个全局数组用来保存添加到购物车的商品信息
	var goodsArr = [];
	var goodsCookie = getCookie("ewjGoods");
	var cartNum1 =  jQuery(".header-center-car span");
	var cartNum2 = jQuery(".small-icons span");
	//判断是否存在指定cookie
	if(goodsCookie){
		goodsArr = JSON.parse(goodsCookie);
		var n = 0;
		for(var i=0; i<goodsArr.length; i++){ //遍历数组取得存在cookie的商品数
			n += goodsArr[i].goodsNum;
		}
		cartNum1.html(n);
		cartNum2.html(n);
	}

	
	//访问json文件生成二级导航菜单
	jQuery.ajax({
		type:"GET",
		url:"json/index-navList.json",
		async:true,
		success:function(res){
			//遍历返回的数据生成二级菜单
	        jQuery.each(res,function(_index,ele){
	        	var $li = jQuery("<li></li>");
	        	var $a = jQuery("<a></a>");
	        	$a.prop("href",ele.href).html(ele.goodTypeName);
	        	$li.append($a);
	        	$li.css("background","url("+ ele.bgImg +") no-repeat 40px center");
	        	$li.appendTo(jQuery("#goods-sort .subList"));
	        });
			var $li = jQuery("#goods-sort>.subList>li");
			
			//鼠标经过二级菜单改变样式并生成下一级菜单
			$li.mouseenter(function(){
				
				var index = jQuery(this).index();
				var $div = jQuery("#goods-sort div");
				$div.html("");//清空
				jQuery(this).css("background","#e60000 url("+ res[index].bgImgHover +") no-repeat 40px center");
				//遍历json数据生成三级菜单
				jQuery.each(res[index].categoryList,function(_index,ele){
					var $ul = jQuery("<ul></ul>");
					var $firstLi = jQuery("<li class='name-type'></li>");
					$firstLi.html(ele.typeName).appendTo($ul);
					jQuery.each(ele.goodList,function(_index,ele){
						$ul.append("<li><a href='"+ele.href+"'>"+ele.name+"</a></li>");
						$ul.append("<li>|</li>");
					});
					$div.append($ul);
				});
				//显示三级菜单盒子
				$div.show();
			});
			//鼠标离开后返回原来的状态
			$li.mouseleave(function(){
				jQuery(this).css("background","white url("+ res[jQuery(this).index()].bgImg +") no-repeat 40px center");
				jQuery("#goods-sort div").hide();
			});
		}
	});
	
	//鼠标移入与移除时分别显示和隐藏三级菜单的盒子
	jQuery("#goods-sort div").hover(function(){
		jQuery(this).show();
	},function(){
		jQuery(this).hide();
	});
