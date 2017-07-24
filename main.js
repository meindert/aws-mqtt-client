"use strict";
import v4 from 'aws-signature-v4';
import crypto from 'crypto';
import MqttClient from './node_modules/mqtt/lib/client';
import websocket from 'websocket-stream';

const AWS_ACCESS_KEY = 'AKIAJTKDBJ57NKDMCBDA';
const AWS_SECRET_ACCESS_KEY = '';
const AWS_IOT_ENDPOINT_HOST = 'a1udr0qzhg5qir.iot.us-east-1.amazonaws.com';
//const MQTT_TOPIC = 'animal/vote';
const MQTT_TOPIC = '$aws/things/Mqtt_Client/shadow/#';

var client;
addLogEntry('Hello World!');

document.getElementById('connect').addEventListener('click', () => {
    client = new MqttClient(() => {
        var url = v4.createPresignedURL(
            'GET',
            AWS_IOT_ENDPOINT_HOST.toLowerCase(),
            '/mqtt',
            'iotdevicegateway',
            crypto.createHash('sha256').update('', 'utf8').digest('hex'),
            {
                'key': AWS_ACCESS_KEY,
                'secret': AWS_SECRET_ACCESS_KEY,
                'protocol': 'wss',
                'expires': 15
            }
        );

        addLogEntry('Connecting to URL: ' + url);
        return websocket(url, [ 'mqttv3.1' ]);
    });

   


    client.on('connect', () => {
        addLogEntry('Successfully connected to AWS IoT Broker!  :-)');
        client.subscribe(MQTT_TOPIC);
    });

    client.on('close', () => {
        addLogEntry('Failed to connect :-(');
        client.end();  // don't reconnect
        client = undefined;
    });

    client.on('message', (topic, message) => {
        addLogEntry('<==' + topic + ' : ' + message.toString());
    });
});

document.getElementById('send').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    addLogEntry('Outgoing message to animal/vote: '  + message);
    client.publish('animal/vote', message);
});

document.getElementById('subscribe').addEventListener('click', () => {
    const message = document.getElementById('subscribe').value;
    client.subscribe(message);
});

function addLogEntry(info) {
    const newLogEntry = document.createElement('li');
    newLogEntry.textContent = '[' + (new Date()).toTimeString().slice(0, 8) + '] ' + info;

    const theLog = document.getElementById('the-log');
    theLog.insertBefore(newLogEntry, theLog.firstChild);
}