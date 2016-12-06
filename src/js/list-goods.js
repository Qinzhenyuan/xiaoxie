jQuery(function($){
	
	//实现分页加载效果
	//请求json文件生成商品列表
	
	var liNum = 0; //用来监控每行最后一个商品
	var goodsNumber = 0;//统计json文件中的商品数
	var pageNum = 1;//页码数
	var $ul = $(".list");//存放商品信息的元素
	
	//封装一个生成商品列表的函数,传递页码数为参数
	function setEle(pageNum){
		$.ajax({
		type : "GET",
		url : "../json/goodsList.json",
		success : function(res){
			$.each(res, function(_index1,ele){
					//页面刚开始进入加载第一页
					if(ele.page == pageNum){
						$(".page-number-son button").css({"background":"white","color":"black"})
						$(".page-number-son button").eq(pageNum).css({"background":"#E14041","color":"white"});
						//加载中模拟
						$ul.html("正在加载，请稍后...");
						//遍历指定页数的商品数据
						setTimeout(fn,500);
						function fn(){
							$ul.html("");//每次遍历都清空列表中的内容
							$.each(ele.goods, function(_index2,ele2){
								liNum++;
								var $li = $("<li></li>");  //创建li用来包含商品所有的信息
								if(liNum%4==0){
									$li.css("margin-right",0);//每行第四个li的margin-right值设为0
								}
								//生成需要的元素插入$li中
								var $a1 = $("<a class='img-info' target='_blank'></a>");
								var $img = $("<img />");
								var $span1 = $("<span></span>");
								$img.prop("src",ele2.sampleUrl).appendTo($a1);
								$span1.html(ele2.bondedState).css("background","url("+ ele2.bondedStateImg +") no-repeat 5px center");
								$span1.appendTo($a1);
								$a1.prop("href",ele2.link).appendTo($li);
								var $a2 = $("<a class='text-info' target='_blank'></a>");
								$a2.html(ele2.name).prop("href",ele2.link).appendTo($li);
								var $span2 = $("<span></span>");
								$span2.html("用券").appendTo($li);
								var $div = $("<div class='price-btnCar'></div>");
								//价格与加入购物车按钮，设置自定属性方便获取数据用于建立cookie
								$div.append("<span price='"+ele2.price+"'>￥"+ ele2.price +"</span><button goodsid='"+ele2.id+"'>加入购物车</button>");
								$li.append($div);
								$li.appendTo($ul);//将$li插入列表中
							});
						}
						
					}
				});
			}
		});
	}
	//页面刚进入加载第一页数据
	setEle(pageNum);
	
	
	//点击页码按钮加载相应的页码商品数据
    $(".page-number-son button").click(function(){
    	
    	var strPage = $(this).html();
    	if(strPage == "上一页"){
    		if(pageNum == 2){
    			pageNum = 1;
    			setEle(pageNum);
    			setTimeout(fn,1000);
    		}else if(pageNum == 3){
    			pageNum = 2;
    			setEle(pageNum);
    			setTimeout(fn,1000);
    		}
    	}else if(strPage = "下一页"){
    		if(pageNum == 1){
    			pageNum = 2;
    			setEle(pageNum);
    			setTimeout(fn,1000);
    		}else if(pageNum == 2){
    			pageNum = 3;
    			setEle(pageNum);
    			setTimeout(fn,1000);
    		}
    	}else if(strPage == "1"){
    		pageNum = 1;
    		setEle(pageNum);
    		setTimeout(fn,1000);
    	}else if(strPage == "2"){
    		pageNum = 2;
    		setEle(pageNum);
    		setTimeout(fn,1000);
    	}else if(strPage == "3"){
    		pageNum = 3;
    		setEle(pageNum);
    		setTimeout(fn,1000);
    	}
    });
    
    //统计商品数量
    $.ajax({
		type : "GET",
		url : "../json/goodsList.json",
		success : function(res){
			$.each(res, function(_index1,ele){
				$.each(ele.goods,function(){
					goodsNumber++;
				});
			});
			$(".page-number-son span b").html(goodsNumber);
		}				
	});
	
	//点击加入购物车按钮生成cookie并显示加入购物车的动画效果
	//全部的操作封装成一个函数，然后使用延时器调用
	//避免请求ajax没有加载完获取不到需要的元素
	function fn(){
		$(".price-btnCar button").click(function(){
	    	//保存该jq元素
	    	var $self = $(this);
	    	
			var $img = $self.parent().parent().find("img").eq(0);		
			
			//生成图片元素克隆当前被点击的按钮所在的商品图片的属性
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
				left:$(".car-icons").offset().left,
				top:$(".car-icons").offset().top,
				height : 10,
				width : 10
			},1000,function(){
				$cloneImg.remove();//运动完之后移除掉
				
				//将该商品添加到cookie中
	            //先获取需要存到cookie的属性
				var _id = $self.attr("goodsid"),
				    _imgUrl = $img.attr("src"),
				    _name = $(".text-info").html(),
				    _price = $self.parent().find("span").attr("price"),
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
	}
	//延时调用
	setTimeout(fn,1000);
});
