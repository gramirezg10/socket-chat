const { io } = require('../server');
const { Users } = require('../classes/Users')
const { createMessage } = require ('../utils/utils')
const users = new Users()

io.on('connection', (client) => {
    client.on('joinChat', (user, callback) => {
        if (!user.userName || !user.room) {
            return callback({
                ok: false,
                message: 'userName and room are required!'
            })
        }

        client.join(user.room)

        users.addPerson(client.id, user.userName, user.room)
        client.broadcast.to(user.room).emit('listPersons', users.getPersonsPerRoom(user.room))
        callback(users.getPersonsPerRoom(user.room))
    })

    client.on('createMessage', (data) => {
        let person = users.getPerson(client.id)
        let message= createMessage(person.name, data.message)
        client.broadcast.to(person.room).emit('createMessage', message)
    })
    
    client.on('disconnect', () => {
        let personDeleted = users.deletePerson(client.id)
        client.broadcast.to(personDeleted.room).emit('createMessage', createMessage('Admin', `${personDeleted.name} has left the chat`))
        client.broadcast.to(personDeleted.room).emit('listPersons', users.getPersonsPerRoom(personDeleted.room))
    })

    client.on('privateChat', (data) => {
        let person = users.getPerson(client.id)
        client.broadcast.to(data.for).emit('privateChat', createMessage(person.name, data.message))
    })
});