var socket = io('https://chatpk.herokuapp.com/');

$(document).ready(function(){
    var alert_name = $('.formName .alert-danger'),
        input_name = $('.formName #inputName'),
        list_member = $('.listMember'),
        input_message = $('#inputMessage'),
        list_message = $('.message')
    ;

    input_name.keypress(function (e) {
        if(e.which === 13){
            var name_val = $(this).val();
            if(name_val === ''){
                alert_name.removeClass('d-none');
                setTimeout(function(){
                    alert_name.addClass("d-none");
                }, 2000);
                alert_name.html('Name is required!');
            }
            else {
                socket.emit('username', name_val);
            }
        }
    });

    input_message.keypress(function (e) {
        if(e.which === 13){
            var message_val = $(this).val();
            if(message_val !== ''){
                socket.emit('message', message_val);
                input_message.val('');
            }
        }
    });

    socket.on('username_error', function () {
        alert_name.removeClass('d-none');
        setTimeout(function(){
            alert_name.addClass("d-none");
        }, 2000);
        alert_name.html('This name already has the user!');
    });

    socket.on('username_success', function () {
        $('.formName').hide();
        $('.homePage').show();
    });

    socket.on('listUser', function (listUser) {
        list_member.children().remove();
        listUser.forEach(function(item) {
            list_member.append('<div class="member">' + item + '</div>')
        });
    });

    socket.on('resMessage', function (data) {
        list_message.append('<div><b>' + data.user + ': </b>'+ data.mess +'</div>');
        list_message.scrollTop(list_message[0].scrollHeight);

    });
});
