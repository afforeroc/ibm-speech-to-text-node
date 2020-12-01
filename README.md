# IBM Speech to Text using NodeJS

## Tutorial

### System requirements
* OS: WSL/Ubuntu 20.04 LTS
* NodeJS: v10.19.0
* NodeJS dependencies.
    * fs: 0.0.1-security
    * fs-extra: ^9.0.1
    * ibm-watson: ^5.7.1
    * path: ^0.12.7

### 0. Pre-requisites
0.1 Get a [IBM Cloud account](https://cloud.ibm.com/login).

### 1. Install NodeJS and NPM
1.1 Install [NodeJS](https://nodejs.org/en/).
```
$ sudo apt install nodejs
```
```
$ nodejs --version
```

1.2 Install [NPM](https://www.npmjs.com/).
```
$ sudo apt install npm
```
```
$ npm --version
```

### 2. Install dependencies
2.1 Go to root folder of app.
```
$ cd ibm-speech-to-text-node/
```

2.2 Install dependencies.
```
$ npm install
```

### 3. Run the app
3.1 Explore `audios`, `audios/read` and `json` folders and delete the `erase.me` files.

3.2 Put your target audios inside of `audios` folder.

3.3 Put your IBM Speech to Text credencials inside of `app.js`.
<pre>
const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: <b>'&ltyour-apikey&gt'</b>,
    }),
    serviceUrl: <b>'&ltyour-serviceUrl&gt'</b>,
});
</pre>

3.4 Finally, run the app.
```
$ node app.js
```

3.5 If need stop the app use: <kbd>ctrl</kbd> + <kbd>C</kbd>.

## Reference links
* [IBM Cloud API Docs / Speech to Text / Node](https://cloud.ibm.com/apidocs/speech-to-text?code=node)
* [watson-developer-cloud/node-sdk](https://github.com/watson-developer-cloud/node-sdk/blob/master/examples/speech_to_text.v1.js)
* [Medium - Get List of all files in a directory in Node.js](https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5)
* [Stack Overflow - Get list of filenames in folder with Javascript](https://stackoverflow.com/questions/31274329/get-list-of-filenames-in-folder-with-javascript)