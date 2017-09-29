/**
 * We'll define a call back to process images from a buffer
 * @callback imageHandler 
 */

const express = require('express');
const app = express();
const drone = require("ar-drone");
const client = drone.createClient();
const fs = require('fs');

const minImageInterval = 2000;
var lastImageRetrieval = 0;

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

/**
 * API call to begin streaming images from the drone every 2 seconds
 */
app.get('/drone-images', function(req, res) {
    var currentRetrieval = Date.now()
    console.log("Gonna get me some drone images...");
    startImageStreaming(function(buffer) {
        var currentRetrieval = Date.now(); 
        if ((currentRetrieval - lastImageRetrieval) > minImageInterval) {
            console.log("GOT AN IMAGE!!")
            lastImageRetrieval = currentRetrieval;
            fs.writeFile(__dirname + '/public/droneImage.png', buffer, function(err) {
                if (err) {
                    console.error('Image file write error: ' + err.message);
                } else {
                    console.log('New drone image written')
                    analyzeImage();
                    console.log('Image submitted for analysis');
                }
            });
        }   
    });
    res.sendStatus(200);
});

app.listen(3000, function() {
    console.log('Preparing middle out compression...');
    console.log('Ready for drone control on port 3000!')
});

function launchDrone() {
    client.takeoff();
}

function landDrone() {
    client.stop();
    client.land();
}

function analyzeImage() {
    // Placeholder to send image to a recognization API and see what we get

    // Prolly need to think through a return value that continues some fun stuff we can react to...
}

/**
 * Initiate the image streaming from the drone
 * @param {imageHandler} imageHandler - callback that takes in a buffer
 */
function startImageStreaming(imageHandler) {
    var imageStream = client.getPngStream();
    console.log('Image streaming started');
    imageStream
        .on('error', console.log)
        .on('data', function(imageBuffer) {
            console.log('Image data event fired');
            imageHandler(imageBuffer);
        });
}