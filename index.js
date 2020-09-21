'use strict';
var express = require('express');
var app = express();
const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const fs = require('fs');

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

// create the stream
const recognizeStream = speechToText.recognizeUsingWebSocket(params);

// pipe in some audio
fs.createReadStream(audioFile).pipe(recognizeStream);

// json file cofig
var audioFile = 'sample.mp3'
var nameFile = audioFile.split('.').slice(0, -1).join('.')
var jsonFile = `${nameFile}.json`


/*
// these two lines of code will only work if `objectMode` is `false`
// pipe out the transcription to a file
recognizeStream.pipe(fs.createWriteStream('transcription.txt'));
// get strings instead of Buffers from `data` events
recognizeStream.setEncoding('utf8');
*/

recognizeStream.on('data', function (event) {
    onEvent('Data:', event);
});

recognizeStream.on('error', function (event) {
    onEvent('Error:', event);
});

/*
recognizeStream.on('close', function (event) {
  onEvent('Close:', event);
});*/

// Displays events on the console.

function onEvent(name, event) {
    let data = JSON.stringify(event, null, 2);
    fs.writeFile(jsonFile, data, (err) => {
        if (err) throw err;
        console.log(`${jsonFile} was saved successfully`);
    });
}