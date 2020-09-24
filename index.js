'use strict';
var express = require('express');
var app = express();
const path = require('path');
const fs = require('fs');
var XLSX = require('xlsx')

// Loading basekeywords
var workbook = XLSX.readFile('basekeywords.xlsx');
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
//console.log(xlData);

var basekeywords = [];
for (const idx in xlData) {
    basekeywords.push(xlData[idx].keyword)
    //console.log(xlData[idx].keyword);
}
//console.log(basekeywords)

// IBM STT init and config
const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');

const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: 'eI_VNmgdMy5rLsis0Y77xR1bcZDfgpgFaa2DYQYiPLop',
    }),
    serviceUrl: 'https://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/0ab13aa8-b4ae-4f59-a836-8c2b7f9eaba8',
});


// using RECOGNIZE
var audiosFiles = fs.readdirSync('audios/');
for (const i in audiosFiles) {
    let audioFile = audiosFiles[i];
    console.log(audioFile);
    const params = {
        audio: fs.createReadStream('audios/' + audioFile),
        contentType: 'audio/mp3',
        model: 'es-CO_NarrowbandModel',
        keywords: ['bancolombia', 'alianza', 'buenos'],
        keywordsThreshold: 0.5,
        maxAlternatives: 3,
        speakerLabels: true
    };
    speechToText.recognize(params)
    .then(response => {
        let dataJSON = JSON.stringify(response.result, null, 2);
        saveJSONFilename(audioFile, dataJSON);
    })
    .catch(err => {
        console.log(err);
    });
}


// Only audio file
/*
const params = {
    audio: fs.createReadStream('audios/' + audioFile),
    contentType: 'audio/mp3; rate=44100',
    model: 'es-CO_NarrowbandModel',
    keywords: ['bancolombia', 'alianza', 'buenos'],
    keywordsThreshold: 0.5,
    maxAlternatives: 3,
    speakerLabels: true
};

speechToText.recognize(params)
    .then(response => {
        let dataJSON = JSON.stringify(response.result, null, 2);
        saveJSONFilename(audioFile, dataJSON);
    })
    .catch(err => {
        console.log(err);
});
*/

// using WEBSOCKETS
/*
const params = {
    objectMode: true,
    contentType: 'audio/mp3',
    model: 'es-CO_NarrowbandModel',
    keywords: basekeywords,
    keywordsThreshold: 0.5,
    maxAlternatives: 3,
    speakerLabels: true
};

const recognizeStream = speechToText.recognizeUsingWebSocket(params);
var audioFile = 'sample.mp3'
fs.createReadStream('audios/' + audioFile).pipe(recognizeStream)

recognizeStream.on('data', function(event) { 
    let dataJSON = onEvent('Data', event, audioFile);
    saveJSONFilename(audioFile, dataJSON); 
});

recognizeStream.on('error', function(event) { 
    onEvent('Error', event, audioFile); 
});

recognizeStream.on('close', function(event) { 
    onEvent('Close', event, audioFile); 
});

// Events handling
function onEvent(name, event, audioFilename) {
    if (name == 'Data') {
        return JSON.stringify(event, null, 2);
    }
    return event;
}
*/

// Save JSON file with filename of audio file
function saveJSONFilename(audioFile, dataJSON) {
    let nameFile = audioFile.split('.').slice(0, -1).join('.')
    let JSONFile = `${nameFile}.json`
    fs.writeFileSync('json/' + JSONFile, dataJSON);
    console.log(`${JSONFile} was saved successfully`)
}