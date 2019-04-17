module.exports = function ({ projectid }) {
    const listClient = new Map()
    let commentHistory = []

    function broadcastComment(message) {
        listClient.forEach(m => m.emit('comment', message))
    }

    function addUser(client) {
        listClient.set(client.id, client)
    }

    function removeUser(client) {
        listClient.delete(client.id)
    }

    function serialize() {
        return {
            projectid,
            numClient: listClient.size
        }
    }

    function addEntry(entry) {
        commentHistory = commentHistory.concat(entry)
      }
    
      function getCommentHistory() {
        return commentHistory.slice()
      }

    return {
        broadcastComment,
        addUser,
        removeUser,
        serialize,
        addEntry,
        getCommentHistory,
    }
}
