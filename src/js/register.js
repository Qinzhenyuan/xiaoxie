jQuery(function($){
	
	//定义一个全局变量与数组检查所有验证是否都正确（都正确后进行页面跳转）
    var allTrue = true;
	var arrCheck = new Array(7);
	for(var i=0;i<7;i++){ 
		arrCheck[i] = false;
	}
	
//获取焦点与失去焦点后输入框颜色改变
	$("input").focus(function(){
		$(this).css("outline",0);
		$(this).css("border","1px solid #e60000");
	});
	$("input").blur(function(){
		$(this).css("border","1px solid #BDBDBD");
	});
	
//失去焦点时判断用户名的正确性
    function checkUserName(){
        var username = $(".userName>input").val();
		//去掉多余的空格
		username = username.replace(/ /g,"");
		$(".userName>input").val(username);
		$.ajax({
			url:"../json/userData.json",
			success:function(res){
				var hasName;
				$.each(res, function(_index,ele) {
					if(username == ele.name){//遍历json文件，查找用户名是否已经被注册
						hasName = true;
					}
				});
				if(hasName){//判断是否被注册
					arrCheck[0] = false;
					$(".userName .info").html("对不起，此用户名已注册，请换一个").css("display","inline-block");
				}else if((username.length>0&&username.length<4) || username.length>20){//判断是否输入符合要求 
		            arrCheck[0] = false;
		            $(".userName .info").html("请确认您输入的用户名长度在4-20字符之间").css("display","inline-block");
		       }else if(username.length == 0){//判断是否为空
		       	    arrCheck[0] = false;
		            $(".userName .info").html("请填写您的用户名").css("display","inline-block");
		       }else{//正确
		       	    arrCheck[0] = true;
		            $(".userName .info").css("display","none");
		       }
			}
		});	
    }
    //失去焦点调用函数
	$(".userName>input").blur(function(){
	    checkUserName();
	});
	
//判断手机号码的正确性
    function checkPhoneNum(){
    	var phone = $(".phoneNum>input").val();
    	phone = phone.replace(/ /g,"");
    	$(".phoneNum>input").val(phone);
    	var check = /^[1][34578][0-9]{9}$/;
    	if(phone == ""){
    		arrCheck[1] = false;
    		$(".phoneNum .info").html("请填写您的手机号码").css("display","inline-block");
    	}else if(check.test(phone)){
    		arrCheck[1] = true;
    		$(".phoneNum .info").css("display","none");
    	}else{
    		arrCheck[1] = false;
    		$(".phoneNum .info").html("请输入正确的手机号码").css("display","inline-block");
    	}
    }
    $(".phoneNum>input").blur(function(){
    	checkPhoneNum();
    });
	
//请求json文件模拟生成验证码并验证
function isCode(){
	$.ajax({
		type:"GET",
		url:"../json/checkCode.json",
		success:function(res){
			var n = Math.floor(Math.random()*8);//随机获取json文件某个验证码对象
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

//验证短信验证码
	$(".checkMsg a").click(function(){
		var msg = 1234;
		alert("您的短信验证码为："+msg);
		$(".checkMsg input").blur(function(){
			if($(this).val() == msg){
				arrCheck[3] = true;
				$(".checkMsg .info").css("display","none");
			}else if($(this).val() == ""){
				arrCheck[3] = false;
				$(".checkMsg .info").html("请填写短信验证码！").css("display","inline-block");
			}else{
				arrCheck[3] = false;
				$(".checkMsg .info").html("短信验证码输入不正确！").css("display","inline-block");
			}
		});
	});
	
//验证密码是否输入正确
    function checkPsd(){
    	var psd = $(".setPsd input").val();
    	psd = psd.replace(/ /g,"");
    	$(".setPsd input").val(psd);
    	var checkPsd = /^[a-z0-9_-]{6,18}$/;
    	if(checkPsd.test(psd)){
    		arrCheck[4] = true;
    		$(".setPsd .info").css("display","none");
    	}else if(psd == ""){
    		arrCheck[4] = false;
    		$(".setPsd .info").html("请设置密码！").css("display","inline-block");
    	}else{
    		arrCheck[4] = false;
    		$(".setPsd .info").html("密码格式不正确！").css("display","inline-block");
    	}
    }
    $(".setPsd input").blur(function(){
    	checkPsd();
    });
    
//验证确认密码是否与第一次输入一致
    function askPsd(){
    	var _psd = $(".ackPsd input").val();
    	_psd = _psd.replace(/ /g,"");
    	$(".ackPsd input").val(_psd);
    	var psd = $(".setPsd input").val();
    	if(_psd == psd && _psd != ""){
    		arrCheck[5] = true;
    		$(".ackPsd .info").css("display","none");
    	}else if(_psd == ""){
    		arrCheck[5] = false;
    		$(".ackPsd .info").html("请确认密码").css("display","inline-block");
    	}else{
    		arrCheck[5] = false;
    		$(".ackPsd .info").html("两次输入密码不一致").css("display","inline-block");
    	}
    }
    $(".ackPsd input").blur(function(){
    	askPsd();
    });

//弹出服务协议窗口
    $(".agreement a").click(function(){
    	$(".ewjAgreement").fadeIn();
    });
//点击同意协议按钮，关闭服务协议窗口并勾选
    $(".ewjAgreement .agreeBtn").click(function(){
    	$(".ewjAgreement").fadeOut();
    	$(".agreement input").prop("checked","checked");
    });
   
    
//所有验证成功之后提交信息，这里采用cookie模拟
    $("form").submit(function(){
    	
    	//判断是否勾选同意服务协议
    	if($(".agreement input").prop("checked")){
    		arrCheck[6] = true;
    	}else{
    		arrCheck[6] = false;
    	}
    	
    	//点击提交按钮之后，对每个输入框的信息进行再一次验证
    	//如果输入不符合要求则提交不成功，并输出提示信息
        if(arrCheck[0] == false){//用户名
        	checkUserName();
        	allTrue = false;
        }else{
        	allTrue = true;
        }
         if(arrCheck[1] == false){//手机号
        	checkPhoneNum();
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
     	if(arrCheck[3] == false){//短信验证码
        	allTrue = false;
			$(".checkMsg .info").html("短信验证码输入不正确！").css("display","inline-block");
     	}else{
     		allTrue = true;
     	}
     	if(arrCheck[4] == false){//设置密码
     		allTrue = false;
    	    checkPsd();
     	}else{
     		allTrue = true;
     	}
     	if(arrCheck[5] == false){//确认密码
     		allTrue = false;
    	    askPsd();
     	}else{
     		allTrue = true;
     	}
     	if(arrCheck[6] == false){//协议框
     		allTrue = false;
     	}else{
     		allTrue = true;
     	}
    	//如果有一个以上不正确则阻止提交跳转，否则保存注册信息
    	if(allTrue == false){
    		return false;
    	}else{//全部正确之后执行
    		//保存用户名，密码，手机号
    		var d = new Date();
    		d.setDate(d.getDate()+7);
    		setCookie("ewjUsername",$(".userName input").val(),d,"/");
    		setCookie("ewjPassword",$(".setPsd input").val(),d,"/");
    		setCookie("ewjPhoneNum",$(".phoneNum input").val(),d,"/");
    	}
    });
    

});


