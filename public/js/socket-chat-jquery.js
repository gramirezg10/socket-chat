var params = new URLSearchParams(window.location.search)

var user = params.get('nombre')
var room = params.get('sala')


var divUsuarios = $('#divUsuarios');
var formSend = $('#formSend');
var txtMsg = $('#txtMsg');
var divChatbox = $('#divChatbox');

// functions to render users
function RenderUsers(persons) {
    var html = '';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>';
    for (let i = 0; i < persons.length; i++) {
        html += '<li>';
        html += '    <a data-id="' + persons[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + persons[i].name + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }
    divUsuarios.html(html)
}

function renderCharbox(message, I) {
    var html = ''
    var date = new Date(message.date)
    var hour = date.getHours() + ':' + date.getMinutes()
    var adminClass= 'info'

    if (message.name === 'Admin') adminClass='danger'

    if (I) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + message.name + '</h5>';
        html += '        <div class="box bg-light-inverse">' + message.message + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />';
        html += '    </div>';
        html += '    <div class="chat-time">' + hour + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if (adminClass === 'info')
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" />';
        html += '    </div>';
        html += '    <div class="chat-content">';
        html += '        <h5>' + message.name + '</h5>';
        html += '        <div class="box bg-light-'+ adminClass +'">' + message.message + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hour + '</div>';
        html += '</li>';
    }

    divChatbox.append(html)
    scrollBottom()
}

function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');
    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
        divChatbox.scrollTop(scrollHeight);
}

// Listeners
divUsuarios.on('click', 'a', function () {
    var id = $(this).data('id')
    if (id) console.log('id: ', id)
})

formSend.on('submit', function (e) {
    e.preventDefault()
    if (txtMsg.val().trim().length === 0) return

    socket.emit('createMessage', {
        user: user,
        message: txtMsg.val().trim()
    }, function (resp) {
        txtMsg.val('')
        txtMsg.focus()
        renderCharbox(resp, true)
    });
})