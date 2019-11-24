const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })
const connections = []

wss.on('connection', ws => {
    connections.push(ws)
})

module.exports =
{
    pushStatusChange: function(id, status)
    {
        connections.forEach( connection => {
            connection.send(`Chargepoint ${id} is now ${status}.`)
        })
    }
}