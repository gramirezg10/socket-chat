var socket = io();
var params = new URLSearchParams(window.location.search)

if (!params.has('userName') || !params.has('room')) {
    window.location = 'index.html'
    throw new Error('userName and room are  required!')
}

var user= {
    userName: params.get('userName'),
    room: params.get('room')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('joinChat', user, function(res){
        console.log('users conected: ')
        console.log(res)
    })
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});


// Enviar información
// socket.emit('createMessage', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('createMessage', function(mensaje) {
    console.log('server:', mensaje);
});

//listen event, when an user join or left this chat
socket.on('listPersons', function(persons){
    console.log(persons)
})

// private chat
socket.on('privateChat', function(privateChat){
    console.log('private chat: ', privateChat)
})