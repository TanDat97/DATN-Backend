function makeHandleEvent(client, clientManager, chatroomManager) {

    function handleEvent(chatroomName, createEntry) {
        return ensureValidChatroomAndUserSelected(chatroomName)
            .then(function ({ chatroom, user }) {
                // append event to chat history
                const entry = { user, ...createEntry() }
                chatroom.addEntry(entry)

                // notify other clients in chatroom
                chatroom.broadcastMessage({ chat: chatroomName, ...entry })
                return chatroom
            })
    }

    return handleEvent
}

module.exports = function (client, clientManager, chatroomManager) {
    const handleEvent = makeHandleEvent(client, clientManager, chatroomManager)

    function handleRegister(userName, callback) {
        const user = clientManager.getUserByName(userName)
        clientManager.registerClient(client, user)

        return callback(null, user)
    }

    function handleMessage({ chatroomName, message } = {}, callback) {
        const createEntry = () => ({ message })

        handleEvent(chatroomName, createEntry)
            .then(() => callback(null))
            .catch(callback)
    }

    function handleGetAvailableUsers(_, callback) {
        return callback(null, clientManager.getAvailableUsers())
    }

    function handleDisconnect() {
        // remove user profile
        clientManager.removeClient(client)
    }

    return {
        handleRegister,
        handleMessage,
        handleGetAvailableUsers,
        handleDisconnect
    }
}
