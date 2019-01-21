// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const data = require('./app/data');
const WebSocket = require('ws');
const app = express();

const port = 8000;

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //parse application/json

require('./app/routes')(app, data);

const server = app.listen(port, () => {
    console.log('We are live on ' + port);
});

// const wss = new WebSocket.Server({ port: 8080 });
const wss = new WebSocket.Server({
    server,
});

wss.on('connection', function connection(ws, req) {
    console.log("websocket connection open");

    ws.on('message', function incoming(message) {
        const incomingMessage = JSON.parse(message);
        if (incomingMessage.legProgress) {
            // do nothing
        } else{

            console.log('received: %s', message);
            
            // Broadcast to everyone else.
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                    client.send(JSON.stringify({msg:"broadcast message"}));
                    console.log("broadcast message");
                }
            });
        }
        ws.send(JSON.stringify({msg:"Hello Client"}));
    });

});