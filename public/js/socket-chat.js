var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var user = {
    userName: params.get('nombre'),
    room: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('joinChat', user, function(resp) {
        console.log('Usuarios conectados', resp);
        RenderUsers(resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     nombre: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('createMessage', function(mensaje) {
    renderCharbox(mensaje, false)
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('listPersons', function(personas) {
    RenderUsers(personas);
});

// Mensajes privados
socket.on('privateChat', function(mensaje) {

    console.log('Mensaje Privado:', mensaje);

});