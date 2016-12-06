jQuery(function($){
	
	//定义一个数组检查所有验证是否都正确
    var allTrue = true;
	var arrCheck = new Array(4);
	for(var i=0;i<4;i++){
		arrCheck[i] = false;//先全部初始化false
	}
	
	//获取焦点与失去焦点后边框的改变
	$("input").focus(function(){
		$(this).css("outline",0);
		$(this).css("border","1px solid #e60000");
	});
	$("input").blur(function(){
		$(this).css("border","1px solid #BDBDBD");
	});
	
	//首先获取cookie里面的登录名与密码
	if(getCookie("username")){
		$(".userName input").val(getCookie("ewjUsername"));
	}
	if(getCookie("password")){
		$(".psd input").val(getCookie("ewjPassword"));
	}
	
	//存放密码
	var _psd;
	
	//判断用户名是否输入正确
	function checkUserName(){
        var username = $(".userName>input").val();
		//去掉多余的空格
		username = username.replace(/ /g,"");
		$(".userName>input").val(username);
		$.ajax({
			url:"../json/userData.json",
			data:{regname:username},
			success:function(res){
				var hasName;
				$.each(res, function(_index,ele) {
					if(username == ele.name){
						hasName = true;
						_psd = ele._password;
					}
				});
				if(hasName || username == getCookie("ewjUsername")){//判断用户名是否存在
					arrCheck[0] = true;
		            $(".userName .info").css("display","none");
				}else if(username.length == 0){//判断是否为空
		       	    arrCheck[0] = false;
		            $(".userName .info").html("请填写您的用户名").css("display","inline-block");
		       }else if((username.length>0&&username.length<4) || username.length>20){//判断是否输入符合要求 
		            arrCheck[0] = false;
		            $(".userName .info").html("请确认您输入的用户名长度在4-20字符之间").css("display","inline-block");
		       }else{
		           arrCheck[0] = false;
					$(".userName .info").html("对不起，此用户名不存在").css("display","inline-block");
		       }
			}
		});	
    }
	$(".userName>input").blur(function(){
	    checkUserName();
	});
	
	//判断密码输入是否正确
	function checkPsd(){
		var userName = $(".userName>input").val();
    	var psd = $(".psd input").val();
    	psd = psd.replace(/ /g,"");
    	$(".psd input").val(psd);
    	if(arrCheck[0] == false){
    		arrCheck[1] = false;
    		$(".psd .info").html("请先正确填写用户名！").css("display","inline-block");
    	}else if((psd == getCookie("ewjPassword") && userName == getCookie("ewjUsername")) || (psd == _psd)){
    		arrCheck[1] = true;
    		$(".psd .info").css("display","none");
    	}else if(psd == ""){
    		arrCheck[1] = false;
    		$(".psd .info").html("请输入密码！").css("display","inline-block");
    	}else{
    		arrCheck[1] = false;
    		$(".psd .info").html("密码不正确！").css("display","inline-block");
    	}
    }
    $(".psd input").blur(function(){
    	checkPsd();
    });
	
	//请求json文件模拟生成验证码并验证
	function isCode(){
		$.ajax({
			type:"GET",
			url:"../json/checkCode.json",
			success:function(res){
				var n = Math.floor(Math.random()*8);
			    $(".checkCode img").prop("src",res[n].imgCode);
			    $(".checkCode>input").blur(function(){
			    	var _code = $(this).val();
			    	_code = _code.replace(/ /g,"");
			    	$(this).val(_code);
			    	if(_code == res[n].code){
			    		arrCheck[2] = true;
			    		$(".checkCode .info").css("display","none");
			    	}else if(_code == ""){
			    		arrCheck[2] = false;
			    		$(".checkCode .info").html("请填写验证码！").css("display","inline-block");
			    	}else{
			    		arrCheck[2] = false;
			    		$(".checkCode .info").html("验证码输入不正确！").css("display","inline-block");
			    	}
		        });
			}
		});
	}
	isCode();
	
	//改变验证码后判断输入验证码是否正确
    $(".checkCode>a").click(function(){
       isCode();
    });
    
    //所有验证成功之后提交信息，这里采用cookie模拟
    $("form").submit(function(){
    	
    	//判断是否勾选同意记住密码
    	if($(".autoSign input").prop("checked")){
    		arrCheck[3] = true;
    	}else{
    		arrCheck[3] = false;
    	}
    	
    	//点击提交按钮之后，对每个输入框的信息进行再一次验证
    	//如果输入不符合要求则提交不成功，并输出提示信息
        if(arrCheck[0] == false){//用户名
        	checkUserName();
        	allTrue = false;
        }else{
        	allTrue = true;
        }
         if(arrCheck[1] == false){//密码
        	checkPsd();
        	allTrue = false;
        }else{
        	allTrue = true;
        }
    	if(arrCheck[2] == false){//验证码
        	allTrue = false;
		    $(".checkCode .info").html("验证码输入不正确！").css("display","inline-block");
     	}else{
    		allTrue = true;
    	}
     	if(arrCheck[3] == false){//记住密码
     		allTrue = false;
     	}else{
     		allTrue = true;
     	}
    	//如果有一个以上不正确则阻止提交跳转，否则保存注册信息
    	if(allTrue == false){
    		return false;
    	}else{
    		//保存用户名，密码，手机号7天
    		var d = new Date();
    		d.setDate(d.getDate()+7);
    		setCookie("ewjUsername",$(".userName input").val(),d,"/");
    		setCookie("ewjPassword",$(".psd input").val(),d,"/");
    	}
    });
	
});