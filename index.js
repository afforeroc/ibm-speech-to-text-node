'use strict';
var express = require('express');
var app = express();
const path = require('path');
const fs = require('fs');

// IBM STT init and config
const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');

const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: 'eI_VNmgdMy5rLsis0Y77xR1bcZDfgpgFaa2DYQYiPLop',
    }),
    serviceUrl: 'https://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/0ab13aa8-b4ae-4f59-a836-8c2b7f9eaba8',
});

const params = {
    objectMode: true,
    contentType: 'audio/mp3',
    model: 'es-CO_NarrowbandModel',
    keywords: ['buenas', 'bancolombia', 'alianza'],
    keywordsThreshold: 0.5,
    maxAlternatives: 3,
    speakerLabels: true
};

// Create the stream
const recognizeStream = speechToText.recognizeUsingWebSocket(params);
var audioFile = 'sample.mp3'
fs.createReadStream('audios/' + audioFile).pipe(recognizeStream)
recognizeStream.on('data', function(event) { onEvent('Data', event, audioFile); });
recognizeStream.on('error', function(event) { onEvent('Error', event, audioFile); });
recognizeStream.on('close', function(event) { onEvent('Close', event, audioFile); });

// audioFile to jsonFile (replace extension)
function getJsonFile(audioFile) {
    var nameFile = audioFile.split('.').slice(0, -1).join('.')
    return `${nameFile}.json`
}

// Events handling
function onEvent(name, event, audioFile) {
    if (name == 'Data') {
        let data = JSON.stringify(event, null, 2);
        let jsonFile = getJsonFile(audioFile);
        fs.writeFileSync('json/' + jsonFile, data);
    }
    else {
        console.log(name, event, audioFile);
    }
}