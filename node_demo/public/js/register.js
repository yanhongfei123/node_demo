$(function () {
    $("#login1").click(function () {
        location.href = 'login';
    });

    $("#register1").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();
        var password1 = $("#password1").val();
        if (password !== password1) {
            $("#password").css("border", "1px solid red");
            $("#password1").css("border", "1px solid red");
        } else if (password === password1) {
            var data = {
                "username": username,
                "password": password
            };
            $.ajax({
                url: '/register',
                type: 'post',
                data: data,
                success: function (data, status) {
                    if (data.code == 200) {
                        alert('注册成功')
                    } else {
                        alert(data.msg)
                    }
                },
                error: function (data, err) {
                    //  location.href = 'register';
                }
            });
        }
    });

    $("#getHtml").click(function () {
        $.ajax({
            url: '/getData',
            type: 'GET',
            headers: {
                token: localStorage.getItem('token')
            },
            success: function (data, status) {
                if (res.status === 403) {
                    setTimeout(function () {
                        window.location.href = 'login';
                    }, 1000)
                }
            },
            error: function (data, err) {

            }
        });
    });

    $("#getHtml2").click(function () {
        $.ajax({
            url: '/getArticle',
            type: 'GET',
            headers: {
                token: localStorage.getItem('token')
            },
            success: function (res, status) {
                if (res.status === 403) {
                    setTimeout(function () {
                        window.location.href = 'login';
                    }, 1000)
                }
            },
            error: function (data, err) {

            }
        });
    });
    $("#getHtml3").click(function () {
        $.ajax({
            url: '/user/populate',
            type: 'GET',
            headers: {
                token: localStorage.getItem('token')
            },
            success: function (res, status) {

            },
            error: function (data, err) {

            }
        });
    });

    $("#getHtml4").click(function () {
        console.log(document.getElementById("text").value)
        console.log(document.getElementById("file").files[0])
        var formData = new FormData();
        formData.append('text', document.getElementById("text").value); 
        formData.append('file',document.getElementById("file").files[0]); // js 获取文件对象)
        //ajax异步上传
        $.ajax({
            url: "/user/upload",
            type: "POST",
            headers: {
                token: localStorage.getItem('token')
            },
            data: formData,
            contentType: false, //必须false才会自动加上正确的Content-Type
            processData: false, //必须false才会避开jQuery对 formdata 的默认处理,
            success: function (result) {
                
            },
        });
    });


    var base64Data = ''

    $('#file').change(function(){
        var file = document.getElementById("file").files[0];
        var reader = new FileReader();
        reader.onload = function(event){
            base64Data = this.result;
        }
        reader.readAsDataURL(file)
    })


    // $("#getHtml4").click(function () {
    //     var formData = new FormData();
    //     formData.append('text', document.getElementById("text").value); 
    //     formData.append('file',document.getElementById("file").files[0]); // js 获取文件对象)
    //     //ajax异步上传
    //     $.ajax({
    //         url: "/user/upload",
    //         type: "POST",
    //         data:{
    //           des: document.getElementById("text").value,
    //           base64Data,
    //         },
    //         headers: {
    //             token: localStorage.getItem('token')
    //         },
    //         success: function (result) {
                
    //         },
    //     });
    // });


});