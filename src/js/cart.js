jQuery(function($){
	
	//获取cookie动态生成用户名
	var userName = getCookie("ewjUsername");
	if(userName){//判断是否存在cookie
	    var $a = $("<a></a>").attr("href","index.html").html(userName);
	    var $li = $("<li></li>");
	    $li.append($a);//生成用户名的元素并插入网页头部相应位置中
	    //相应的改变其他元素
	    $(".address").after($li);
	    $(".sign-in a").html("会员中心").prop("href","../index.html");
	    $(".register a").html("退出").prop("href","shopping-Cart.html");
	}
	//点击退出删除cookie中的用户名等信息
    $(".register a").click(function(){
    	var d = new Date();
    	setCookie("ewjUsername","",d,"/");
    	setCookie("ewjPassword","",d,"/");
    	setCookie("ewjPhoneNum","",d,"/");
    })
	
	
	//获取存储商品信息的cookie，生成购物车商品列表
	//先声明一个全局数组用来保存添加到购物车的商品信息
	var goodsArr = [];
	var goodsCookie = getCookie("ewjGoods");
	var $gdsNum = $(".goodsList-header span");
	if(goodsCookie){
		goodsArr = JSON.parse(goodsCookie);
		var n = 0;
		for(var i=0; i<goodsArr.length; i++){ //遍历数组取得存在cookie的商品数并生成商品列表
			n += goodsArr[i].goodsNum;
			
			//生成需要的元素容乃商品各种信息
			//一个ul包含一个商品所有信息
			var $ul = $("<ul></ul>"); 
			$ul.prop("id",goodsArr[i].goodsId);//存储商品id
			
			//添加复选框
			$ul.append("<li><input type='checkbox'/></li>");
			//添加商品图片
			var $li1 = $("<li></li>");
			var $img = $("<img />")
			$img.prop("src",goodsArr[i].goodsImg).appendTo($li1);
			$ul.append($li1);
			//添加商品名称以及连接
			var $li2 = $("<li></li>");
			var $a = $("<a></a>");
			$a.prop("href","#").html(goodsArr[i].goodsName).appendTo($li2);
			$ul.append($li2);
			//添加规格
			$ul.append("<li style='padding-right:180px;'>&ensp;</li>");
			//添加价格
			var $li3 = $("<li></li>");
			$li3.html("￥"+goodsArr[i].goodsPrice).attr("price",goodsArr[i].goodsPrice);
			$ul.append($li3);
			//添加数量按钮
			var $li4 = $("<li class='numBtn'></li>");
			$li4.append("<button>-</button>");
			var $input = $("<input type='text' />");
			$input.val(goodsArr[i].goodsNum).appendTo($li4);
			$li4.append("<button>+</button>");
			$ul.append($li4);
			//添加总价
			var $li5 = $("<li style='padding-left: 40px;'>￥</li>");
			$li5.append(goodsArr[i].goodsNum*parseFloat(goodsArr[i].goodsPrice));
			$ul.append($li5);
			//添加删除按钮
			$ul.append("<li style='padding-left:70px;'><b>删除</b></li>");
			
			//最后：将该商品的信息插入商品列表区
			$ul.appendTo($(".goodsList-content"));
		}
		//更新商品总数
		$gdsNum.html(n);
	}
	

	//复选框选中商品提交订单并计算商品数量与总价
	var $allChecked1 = $(".goodsList-header input");
	var $checkbox = $(".goodsList-content :checkbox");
	var $allChecked2 = $(".slectAll input");
	
	//点击删除，移除整个商品信息
	$(".goodsList-content").on("click","b",function(){
		var thisId = $(this).parent().parent().attr("id");
		var $checked = $checkbox.filter(":checked");
		//移除对应的ul
		$(this).parent().parent().remove();
		//遍历数组，改变数组
		for(var i=0;i<goodsArr.length;i++){
			if(goodsArr[i].goodsId == thisId){
				goodsArr.splice(i,1);
			}
		}
		//然后使用该数组用于覆盖原来的cookie
		var d = new Date();
		d.setDate(d.getDate()+10);
		setCookie("ewjGoods",JSON.stringify(goodsArr),d,"/");
		console.log(22)
		total();

	});
	
	//点击添加和减少数量的按钮做相应的改变
	$(".goodsList-content").on("click","button",function(){

		var $checked = $checkbox.filter(":checked");
		var inputNum = $(this).parent().find("input").val();
		var priceTotal = 0;
		if($(this).index() == 0){
			if(inputNum > 1){
				inputNum--;
			}
		}
		if($(this).index() == 2){
			inputNum++;
		}
		//改变数量框的值
		$(this).parent().find("input").val(inputNum);
		//改变数组与cookie
		for(var j=0;j<goodsArr.length;j++){
			if(goodsArr[j].goodsId == $(this).parent().parent().attr("id")){
				goodsArr[j].goodsNum = inputNum;
				priceTotal = goodsArr[j].goodsNum*parseFloat(goodsArr[j].goodsPrice);
			}
		}
		//然后使用该数组用于覆盖原来的cookie
		var d = new Date();
		d.setDate(d.getDate()+10);
		setCookie("ewjGoods",JSON.stringify(goodsArr),d,"/");

		//调用total函数
		total();
		//改变总价
		$(this).parent().next().html("￥"+priceTotal);
	});
	
	
	
	//第一个全选框
	$allChecked1.click(function(){
		//给单个的复选框与另一个全选框传值
		$checkbox.prop("checked",$allChecked1.prop("checked"));
		$allChecked2.prop("checked",$allChecked1.prop("checked"));
		var $checked = $checkbox.filter(":checked");

		if($(this).prop("checked")){
			total();
		}else{
			$(".slectAll i").html("0");
			$(".subMit-btn span").html("0");
		}
		
	});
	//第二个全选框
	$allChecked2.click(function(){
		//给单个的复选框与另一个全选框传值
		$checkbox.prop("checked",$allChecked2.prop("checked"));
		$allChecked1.prop("checked",$allChecked2.prop("checked"));
		var $checked = $checkbox.filter(":checked");
		
		if($(this).prop("checked")){
			total();
		}else{
			$(".slectAll i").html("0");
			$(".subMit-btn span").html("0");
		}
	});
	
	//单个复选框集
	$checkbox.click(function(){
		$(".subMit-btn span").html("0");
		var $checked = $checkbox.filter(":checked");
		//调用total函数
		total();

		$(".subMit-btn span").html("￥"+priceTotal);
		$allChecked2.prop("checked",$checkbox.length == $checked.length);
		$allChecked1.prop("checked",$checkbox.length == $checked.length);
	});

	//封装一个统计已勾选的商品的数量与总价
	function total(){
		//计算已勾选的商品
		var num = 0;
		//计算已勾选的商品的总价
		var priceTotal = 0;
		$checkbox.each(function(_index,ele){
			if($(ele).prop("checked")){
				console.log(goodsArr[_index].goodsNum);
				
				priceTotal += goodsArr[_index].goodsNum*parseFloat(goodsArr[_index].goodsPrice);
				//num += goodsArr[_index].goodsNum;
			}
		});
		$(".slectAll i").html(num);
		$(".subMit-btn span").html("￥"+priceTotal);
	}
	
});
