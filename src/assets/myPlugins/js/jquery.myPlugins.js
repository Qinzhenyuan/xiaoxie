;(function($){
	$.fn.extend({
		//轮播图插件
		myCarouselImg : function(options){//插件使用者传递的对象参数
			//插件默认参数
			var defaults = {
				_width:810,
				_height:320,
				isShowPage:true,//是否显示页码
				autoPlay:true,//是否自动轮播
				playType:'left',//动画类型：水平滚动left, 垂直滚动top, 渐现效果fade
				isShowBtn:true,//是否显示前后按钮
				playSpeed:3000,//轮播图速度
				isStopPlay:true //鼠标进入是否停止定时器
			};
			//使用传递过来的参数扩展出一个新的参数
			var opt = $.extend({},defaults,options);
			//使用each遍历jquery实例对象,考虑this为多个实例对象的时候
			this.each(function(){
				var $self = $(this);  //保留实例对象，方便使用
				var $ul = $("ul",$self); //获取当前元素的ul
				$ul.append($ul.html()); //添加一倍内容，实现无缝切换图片
				//初始化图片索引
				var _index = 0;
				var len = $ul.children().length;
				var $page; //页码jquery对象声明
				//调用初始化函数进行初始化
				init();
				//如果opt.autoPlay值为true开启定时器
				if(opt.autoPlay){
					var timer;
					if(opt.isStopPlay){
						// 鼠标移入移出
						$self.on('mouseenter',function(){
							clearInterval(timer);
						}).on('mouseleave',function(){
							timer = setInterval(function(){
								_index++;
								startSwitch();
							},opt.playSpeed);
						}).trigger('mouseleave'); // 模拟事件（手动触发一个事件）
					}else if(!opt.isStopPlay){
						timer = setInterval(function(){
							_index++;
							startSwitch();
							},opt.playSpeed);
					}
				}
				//初始化函数
				function init(){
					//给$self设置样式
					$self.addClass('myCarouselImg').css({height:opt._height,width:opt._width});
					//给$ul，$ul>li,$ul>li>img设置高宽
					$ul.css({height:opt._height,width:opt._width});
					$ul.find("li").css({height:opt._height,width:opt._width});
					$ul.find("img").css({height:opt._height,width:opt._width});
					//根据轮播的方式设置$ul的高宽与样式
					if(opt.playType == "left"){ //左右移动
						$ul.addClass("type-left").css({width:opt._width*len});
					}else if(opt.playType == "top"){//上下移动
						$ul.css({height:opt._height*len});
					}else if(opt.playType == "fade"){//渐隐渐现
						$ul.addClass("type-fade").children().css({opacity:0}).eq(_index).css({opacity:1});
					}
					//如果显示页码，则生成页码
					if(opt.isShowPage){
					
						$page = $('<div/>').addClass('page');
						for(var i=1;i<=len/2;i++){
							var $span = $('<span/>');
							if(i==1){
								$span.addClass('active');
							}
							$span.appendTo($page);
						}
						$page.appendTo($self);
                        $page.css("margin-left",-$page.outerWidth()/2); //页码居中设置
						if(opt.clickOrover == "click"){
							// 点击页码切换
							$page.on('click','span',function(){
								_index = $(this).index();
								btnSwitch();
							});
						}else if(opt.clickOrover = "over"){
							//s鼠标经过页码切换
							$page.on('mouseenter','span',function(){
								_index = $(this).index();
								btnSwitch();
							});
						}
					}
					//如果显示前后按钮，则生成按钮
					if(opt.isShowBtn){
						$('<div/>').addClass('next').appendTo($self);
						$('<div/>').addClass('prev').appendTo($self);
						$self.on('click','.next',function(){
							_index++;
							btnSwitch();
						}).on('click','.prev',function(){
							_index--;
							btnSwitch();
						});
					}
				}
				//实现切换图片的函数startSwitch
				function startSwitch(){
					if(_index > len/2){ //判断是否达到叠加后的第一张图片
						_index = 1;
						$ul.css({left:0,top:0});
					}else if(_index<0){
						_index = len/2 - 1;
						if(opt.playType == 'left'){
							$ul.css({left:-len/2*opt._width});
						}else if(opt.playType == 'top'){
							$ul.css({top:-len/2*opt._height});
						}
					}
					if(opt.playType === 'left'){
						$ul.stop().animate({left:-opt._width*_index});
					}else if(opt.playType === 'top'){
						
						$ul.stop().animate({top:-opt._height*_index});
					}else if(opt.playType === 'fade'){
						$ul.children().eq(_index).stop().animate({opacity:1}).siblings('li').stop().animate({opacity:0});
					}
					// 页码高亮效果
					if(opt.isShowPage) {
						$page.children().removeClass().eq(_index).addClass('active');
					}
					if(_index==len/2){
						$page.children().removeClass().eq(0).addClass('active');
					}
				}
				//按钮点击或者鼠标经过切换图片函数
				function btnSwitch(){
					clearInterval(timer);
					startSwitch();
					timer = setInterval(function(){
								_index++;
								startSwitch();
							},opt.playSpeed);
				}
				
			});
			return this;
		},
		
		//放大镜插件
		myZoomImg : function(options){//插件使用者传递的对象参数
			//插件默认参数
			var defaults = {
				_width:300,
				_height:300,
				gap:30,
				_position:"right",
				bgColor:"yellow"
			};
			//使用传递过来的参数扩展出一个新的参数
			var opt = $.extend({},defaults,options);
			//使用each遍历jquery实例对象
			this.each(function(){
				var $self = $(this);  //保留实例对象，方便使用
				//定义需要的全局变量（jquery对象）
				var $bigDiv , //大图外框
				    $bigImg , //大图
				    $minZoom , //放大镜模拟框
				    ratio;  //大图与小图的比例
				var $smallImg = $("img",$self);//获取小图
			    var bigUrl = $smallImg.attr('data-big') || $smallImg.attr('src'); //获取大图的路径
				
				$smallImg.load(function(){
					init();
				});
				//鼠标移入，移除与移动事件
				$self.on("mouseenter",function(){
					$bigDiv.appendTo('body');
					//将放大镜写入$self中
					$minZoom.css({width:opt._width/ratio,height:opt._height/ratio,background:opt.bgColor});
					$minZoom.appendTo($self);
				}).on("mouseleave",function(){
					$bigDiv.remove();
					$minZoom.remove();
				}).on("mousemove",function(e){
					// 设置$min的位置
					// pageX = clientX + scrollLeft
					// pageY = clientY + scrollTop
					var top = e.pageY - $smallImg.offset().top - $minZoom.outerHeight()/2;
					var left = e.pageX - $smallImg.offset().left - $minZoom.outerWidth()/2;
					// 防止放大镜移出小图区域
					if(left<0){
						left = 0;
					}else if(left > $smallImg.outerWidth() - $minZoom.outerWidth()){
						left = $smallImg.outerWidth() - $minZoom.outerWidth();
					}
					if(top < 0 ){
						top = 0;
					}else if(top > $smallImg.outerHeight() - $minZoom.outerHeight()){
						top = $smallImg.outerHeight() - $minZoom.outerHeight();
					}
					$minZoom.css({
						top:top,
						left:left
					});
					$bigImg.css({
						top:-top*ratio,
						left:-left*ratio
					});
				});
				//初始化函数
				function init(){
				    var bigUrl = $smallImg.attr('data-big') || $smallImg.attr('src'); //获取大图的路径
					$self.addClass("myZoomImg");
					// 创建大图
					$bigDiv = $('<div/>').addClass('myZoomImg-big');
					$bigDiv.css({width:opt._width,height:opt._height});
					$bigImg = $('<img/>').attr({src:bigUrl});
					// 把大图写入页面
					$bigDiv.append($bigImg).appendTo('body');
					$bigImg.load(function(){
						ratio = $bigImg.outerWidth()/$smallImg.outerWidth();
						$bigDiv.remove();
					});
					// 把大图默认显示在右边
					var pos = {
							left:$smallImg.offset().left + $smallImg.outerWidth() + opt.gap,
							top:$smallImg.offset().top
						}
					if(opt._position == 'bottom'){
						pos.left = $smallImg.offset().left;
						pos.top = $smallImg.offset().top + $smallImg.outerHeight() + opt.gap;
					}else if(opt._position == 'left'){
						pos.left = $smallImg.offset().left - $big.outerWidth() - opt.gap;
					}
					$bigDiv.css(pos);
					// 创建放大镜
					$minZoom = $('<span/>').addClass('myZoomImg-min');
				}
			});
			return this;
		}
	});
})(jQuery);
