$(function () {
    function render(data) {
        var html = '';
        $.each(data, function (i, item) {
            console.log(item)
            html += '<li> <span>用户名: ' + item.name + '</span> <span>密码: ' + item.password + '</span><span class="update" data-name="' + item.name + '">修改</span> <span class="delete" data-name="' + item.name + '">删除</span></li>';
        })
        return html;
    }
    $.ajax({
        url: '/home/getUserList',
        type: 'get',
        success: function (res, status) {
            console.log(res)
            if (res.code == '200') {
                $('#list').html(render(res.data));
            }
        },
        error: function (res, status) {
            console.log(res)
        }
    });

    $('#list').on('click', '.delete', function () {
        var that = this;
        $.ajax({
            url: '/home/delete',
            type: 'post',
            data: {
                name: $(that).data('name'),
            },
            success: function (res, status) {
                if (res.code == '200') {
                    $(that).parent().remove();
                }
            },
            error: function (res, status) {
                console.log(res)
            }
        });

    })

    $('#list').on('click', '.update', function () {
        var that = this;
        $.ajax({
            url: '/home/update',
            type: 'post',
            data: {
                name: $(that).data('name'),
            },
            success: function (res, status) {
                if (res.code == '200') {
                    alert('已修改')
                }
            },
            error: function (res, status) {
                console.log(res)
            }
        });

    })

});