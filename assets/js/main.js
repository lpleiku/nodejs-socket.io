var socket = io('https://chatpk.herokuapp.com/');
//var socket = io('http://localhost:3000/');

$(document).ready(function(){
    var alert_name = $('.formName .alert-danger'),
        input_name = $('.formName #inputName'),
        list_member = $('.listMember'),
        input_message = $('#inputMessage'),
        list_message = $('.message'),
        input_room = $('#input-room'),
        btn_room = $('.create-room'),
        alert_modal = $('.modal-body .alert-danger'),
        close_modal = $('.modal-footer .btn-close'),
        list_room = $('.listRoom'),
        room = $('.listRoom .room')
    ;

    //create name
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

    //send message
    input_message.keypress(function (e) {
        if(e.which === 13){
            var message_val = $(this).val();
            if(message_val !== ''){
                socket.emit('message', message_val);
                input_message.val('');
            }
        }
    });

    // create room
    btn_room.on('click', function () {
        var room_val = input_room.val();
        if(room_val === ''){
            alert_modal.removeClass('d-none');
            setTimeout(function(){
                alert_name.addClass("d-none");
            }, 2000);
            alert_modal.html('Room is required!');
        }
        else {
            socket.emit('create_room', room_val);
        }
    });

    socket.on('username_error', function () {
        alert_name.removeClass('d-none');
        setTimeout(function(){
            alert_name.addClass("d-none");
        }, 2000);
        alert_name.html('This name already has the user!');
    });

    socket.on('username_success', function (username) {
        $('.formName').hide();
        $('.homePage').show();
        $('.info span').html(username);
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

    socket.on('create_room_error', function () {
        alert_modal.removeClass('d-none');
        setTimeout(function(){
            alert_modal.addClass("d-none");
        }, 2000);
        alert_modal.html('This room is exists!');
    });

    socket.on('create_room_success', function (room) {
        console.log('success: ' + room);
        close_modal.click();
    });

    socket.on('listRoom', function (listRoom) {
        list_room.children().remove();
        listRoom.forEach(function(item) {
            list_room.append('<div class="room" onclick="join_room(\'' + item.name + '\')">' + item.name + '(' + item.number + ')</div>')
        });
    });
});

function join_room(room) {
    socket.emit('join_room', room);
}
