/**
 * We'll define a call back to process images from a buffer
 * @callback imageHandler 
 */

const express = require('express');
const app = express();
const drone = require("ar-drone");
const droneClient = drone.createClient();
const fs = require('fs');

const droneFilePath = __dirname + '/public/droneImage.png';
const minImageInterval = 1500;
var lastImageRetrieval = 0;
var foundName = "None";

app.use('/', express.static('public'));

app.get('/', function(req, res) {
    res.sendFile('./index.html')
});

app.get('/launch', function(req, res) {
    console.log('Launching drone')
    launchDrone();
    res.sendStatus(200);
});

app.get('/land', function(req, res) {
    console.log('Landing drone')
    landDrone();
    res.sendStatus(200);
});

app.get('/identify', function(req, res) {
    console.log('Identify')
       
    res.set('Content-Type', 'text/plain');
    res.write('Layok');   
    res.end();    
   
});

app.get('/analyze-current-image', function(req, res) {
    
})

/**
 * API call to begin streaming images from the drone every 2 seconds
 */
app.get('/drone-images', function(req, res) {
    var currentRetrieval = Date.now()
    console.log("Gonna get me some drone images...");
    res.sendStatus(200);
});

app.listen(3000, function() {
    console.log('Preparing middle out compression...');
    console.log('Ready for drone control on port 3000!')
});

function launchDrone() {
    droneClient.takeoff();
}

function landDrone() {
    droneClient.stop();
    droneClient.land();
}

function announcePersonFound(name) {
    console.log('made it to the server');
}

/**
 * Initiate the image streaming from the drone
 * @param {imageHandler} imageHandler - callback that takes in a buffer
 */
function startImageStreaming(imageHandler) {
    var imageStream = droneClient.getPngStream();
    console.log('Image streaming started');
    imageStream
        .on('error', console.log)
        .on('data', function(imageBuffer) {
            console.log('Image data event fired');
            imageHandler(imageBuffer);
        });
}