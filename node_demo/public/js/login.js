$(function(){ 
    $("#register0").click(function(){ 
        location.href = 'register';
    });
    $("#login0").click(function(){ 
        var username = $("#username").val();
        var password = $("#password").val();
        var data = {"username":username,"password":password};
        $.ajax({ 
            url:'/login',
            type:'post',
            data: data,
            success: function(res,status){ 
                console.log(res)
                if(res.code == '200'){ 
                    localStorage.setItem('token', res.token);
                    alert('登录成功');
                }
            },
            error: function(res,status){ 
               console.log(res)
            }
        });
    });
});