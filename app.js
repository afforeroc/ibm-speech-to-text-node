'use strict';
// Libraries
const path = require('path');
const fs = require('fs');
const fsextra = require('fs-extra')

// IBM STT init and config
const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: 'G-XvoHRPvKMmehHE8HlIWesjbQw0cx5jrgswse3kQHt8',
    }),
    serviceUrl: 'https://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/a4d01b0b-ef73-43b7-b27a-2a8c5e0264f0',
});


// MAIN function
console.log('IBM Speech to Text using NodeJS\n');
var comProtocol = 'websockets';
var audioSources = 'audios/';
console.log(`Communication protocol: ${comProtocol}`)
console.log(`Audio sources: ${audioSources}\n`)

var audioFiles = fs.readdirSync(audioSources);
if (audioFiles.length > 0) {
    console.log('Processing files...');
    for (const i in audioFiles) {
        let audioFile = audioFiles[i];
        let audioPathfile = path.join(audioSources, audioFile);
        if (fs.lstatSync(audioPathfile).isFile()) {
            console.log(`${audioFile} was read`); 
            let params = getParams(comProtocol, audioPathfile);
            if (comProtocol == 'recognize') { 
                sttRecognize(params, audioPathfile);
            } else {
                sttWebSockets(params, audioPathfile);
            }
        }
    }
} else {
    console.log('Error: There are not files in audios folder')
}



// Get STT params according with a communication protocol
function getParams(comProtocol, audioPathfile) {
    let params = {
        contentType: 'audio/mp3',
        model: 'es-CO_NarrowbandModel',
        keywords: ['grabada y monitoreada', 'términos y condiciones'],
        keywordsThreshold: 0.5,
        inactivityTimeout: -1,
        speakerLabels: true                                       
    };
    if (comProtocol == 'recognize') {
        params["audio"] = fs.createReadStream(audioPathfile);
    } else if (comProtocol == 'websockets') {
        params["objectMode"] = true;
    }
    return params;
}


// Using STT RECOGNIZE
function sttRecognize(params, audioPathfile) {
    let audioFile = path.parse(audioPathfile).base;
    speechToText.recognize(params)
    .then(response => {
        let dataJSON = JSON.stringify(response.result, null, 2);
        saveJSONFile(audioFile, dataJSON);
        moveFile('audios', 'audios/read', audioFile);
    })
    .catch(err => {
        console.log(err);
    });
}

// Using STT Web Sockets RECOGNIZE
function sttWebSockets(params, audioPathfile) {
    let audioFile = path.parse(audioPathfile).base;
    const recognizeStream = speechToText.recognizeUsingWebSocket(params);
    fs.createReadStream(audioPathfile).pipe(recognizeStream);
    recognizeStream.on('data', function(event) { onEvent('Data', event, audioFile); });
    recognizeStream.on('error', function(event) { onEvent('Error', event, audioFile); });
    recognizeStream.on('close', function(event) { onEvent('Close', event, audioFile); });
}

// Auxiliar function to STT WebSockets
function onEvent(name, event, audioFile) {
    if (name == 'Data') {
        let dataJSON = JSON.stringify(event, null, 2);
        saveJSONFile(audioFile, dataJSON);
        moveFile('audios', 'audios/read', audioFile);
    } else {
        console.log(`${name}: ${event}, recognizing ${audioFile}`);
    }
}

// Save JSON file with filename of audiofile
function saveJSONFile(audioFile, dataJSON) {
    let filename = audioFile.split('.').slice(0, -1).join('.');
    let jsonFile = `${filename}.json`;
    fs.writeFileSync('json/' + jsonFile, dataJSON);
    console.log(`${jsonFile} file was saved`);
}

// Move file
function moveFile(source, destination, file) {
    fsextra.move(`${source}/${file}`, `${destination}/${file}`, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log(`${file} was moved to ${destination}/`);
    })
}
